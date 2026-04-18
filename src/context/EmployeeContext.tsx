// context/EmployeeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { type Employee } from "../types/employee";
import { type User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import { ref, onValue, set, remove } from "firebase/database";

type NotificationType = "success" | "error";

export interface ToastNotification {
  id: string;
  type: NotificationType;
  message: string;
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (emp: Employee) => Promise<boolean>;
  updateEmployee: (emp: Employee) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  notifications: ToastNotification[];
  removeNotification: (id: string) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  currentUserUid: string | null;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined,
);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getCacheKey = () => "employees:public";

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const pushNotification = (type: NotificationType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setNotifications((prev) => [...prev, { id, type, message }]);

    window.setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const loadEmployeesFromLocalCache = () => {
    try {
      const data = localStorage.getItem(getCacheKey());
      if (data) {
        const parsedData = JSON.parse(data);
        console.log("Empleados cargados desde localStorage:", parsedData);
        setEmployees(parsedData);
      }
    } catch (error) {
      console.error("Error leyendo localStorage como fallback:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Suscribirse a todos los empleados para lectura publica
  useEffect(() => {
    const employeesRef = ref(db, "employees");

    const unsubscribe = onValue(
      employeesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.entries(
            data as Record<string, Record<string, Employee>>,
          ).flatMap(([ownerUid, employeeMap]) =>
            Object.entries(employeeMap ?? {})
              .map(([firebaseKey, employee]) => ({
                ...employee,
                id: employee.id ?? firebaseKey,
                addedByUid: employee.addedByUid ?? ownerUid,
              }))
              .filter((emp) => emp.name?.trim()),
          );
          setEmployees(list);
        } else {
          setEmployees([]);
        }
        setIsLoaded(true);
      },
      (error) => {
        console.error("Error al cargar empleados desde Firebase:", error);
        loadEmployeesFromLocalCache();
        setIsLoaded(true);
      },
    );

    return () => unsubscribe();
  }, []);

  // Mantener una copia local publica como cache/offline
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(getCacheKey(), JSON.stringify(employees));
        console.log("Empleados guardados en localStorage:", employees);
      } catch (error) {
        console.error("Error al guardar empleados en localStorage:", error);
      }
    }
  }, [employees, isLoaded]);

  const addEmployee = async (emp: Employee) => {
    if (!currentUser) {
      pushNotification("error", "Debes iniciar sesion para agregar empleados.");
      return false;
    }

    const getAdminName = () => {
      if (currentUser.displayName?.trim()) {
        return currentUser.displayName.trim();
      }

      if (currentUser.email) {
        const [emailName] = currentUser.email.split("@");
        return emailName || "Administrador";
      }

      return "Administrador";
    };

    if (!emp.name.trim() || !emp.department.trim() || emp.salary <= 0) {
      pushNotification(
        "error",
        "No se pudo agregar el empleado. Revisa los datos.",
      );
      return false;
    }

    try {
      const employeeWithAdmin: Employee = {
        ...emp,
        addedByUid: currentUser.uid,
        addedByName: getAdminName(),
        addedByEmail: currentUser.email ?? "",
      };

      await set(
        ref(db, `employees/${currentUser.uid}/${emp.id}`),
        employeeWithAdmin,
      );
      pushNotification(
        "success",
        `Empleado ${emp.name} agregado correctamente.`,
      );
      return true;
    } catch (error) {
      console.error("Error al agregar empleado en Firebase:", error);
      pushNotification(
        "error",
        "No se pudo agregar el empleado en el servidor.",
      );
      return false;
    }
  };

  const updateEmployee = async (updated: Employee) => {
    if (!currentUser) {
      pushNotification(
        "error",
        "Debes iniciar sesion para actualizar empleados.",
      );
      return false;
    }

    const exists = employees.some((emp) => emp.id === updated.id);

    if (!exists) {
      pushNotification("error", "No se encontró el empleado para actualizar.");
      return false;
    }

    try {
      const existingEmployee = employees.find((emp) => emp.id === updated.id);
      const ownerUid =
        existingEmployee?.addedByUid ?? updated.addedByUid ?? currentUser.uid;

      const employeeToSave: Employee = {
        ...updated,
        addedByUid: ownerUid,
        addedByName: existingEmployee?.addedByName,
        addedByEmail: existingEmployee?.addedByEmail,
      };

      await set(ref(db, `employees/${ownerUid}/${updated.id}`), employeeToSave);
      pushNotification(
        "success",
        `Empleado ${updated.name} actualizado correctamente.`,
      );
      return true;
    } catch (error) {
      console.error("Error al actualizar empleado en Firebase:", error);
      pushNotification(
        "error",
        "No se pudo actualizar el empleado en el servidor.",
      );
      return false;
    }
  };

  const deleteEmployee = async (id: string) => {
    if (!currentUser) {
      pushNotification(
        "error",
        "Debes iniciar sesion para eliminar empleados.",
      );
      return false;
    }

    const employeeToDelete = employees.find((emp) => emp.id === id);

    if (!employeeToDelete) {
      pushNotification("error", "No se encontró el empleado para eliminar.");
      return false;
    }

    const ownerUid = employeeToDelete.addedByUid ?? currentUser.uid;

    try {
      await remove(ref(db, `employees/${ownerUid}/${id}`));
      pushNotification(
        "success",
        `Empleado ${employeeToDelete.name} eliminado.`,
      );
      return true;
    } catch (error) {
      console.error("Error al eliminar empleado en Firebase:", error);
      pushNotification(
        "error",
        "No se pudo eliminar el empleado en el servidor.",
      );
      return false;
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        notifications,
        removeNotification,
        isLoading: !isLoaded,
        isAuthenticated: Boolean(currentUser),
        currentUserUid: currentUser?.uid ?? null,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context)
    throw new Error("useEmployees debe usarse dentro de EmployeeProvider");
  return context;
};
