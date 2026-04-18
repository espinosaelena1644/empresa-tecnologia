// context/EmployeeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { type Employee } from "../types/employee";
import { db } from "../config/firebase-config";
import {
  ref,
  onValue,
  set,
  remove,
} from "firebase/database";

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
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined,
);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
      const data = localStorage.getItem("employees");
      if (data) {
        const parsedData = JSON.parse(data);
        console.log("Empleados cargados desde localStorage:", parsedData);
        setEmployees(parsedData);
      }
    } catch (error) {
      console.error("Error leyendo localStorage como fallback:", error);
    }
  };

  // Suscribirse en tiempo real a Realtime Database y usar localStorage como fallback
  useEffect(() => {
    const employeesRef = ref(db, "employees");

    const unsubscribe = onValue(
      employeesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.values(data) as Employee[];
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

  // Mantener una copia local como cache/offline
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("employees", JSON.stringify(employees));
        console.log("Empleados guardados en localStorage:", employees);
      } catch (error) {
        console.error("Error al guardar empleados en localStorage:", error);
      }
    }
  }, [employees, isLoaded]);

  const addEmployee = async (emp: Employee) => {
    if (!emp.name.trim() || !emp.department.trim() || emp.salary <= 0) {
      pushNotification(
        "error",
        "No se pudo agregar el empleado. Revisa los datos.",
      );
      return false;
    }

    try {
      await set(ref(db, `employees/${emp.id}`), emp);
      pushNotification("success", `Empleado ${emp.name} agregado correctamente.`);
      return true;
    } catch (error) {
      console.error("Error al agregar empleado en Firebase:", error);
      pushNotification("error", "No se pudo agregar el empleado en el servidor.");
      return false;
    }
  };

  const updateEmployee = async (updated: Employee) => {
    const exists = employees.some((emp) => emp.id === updated.id);

    if (!exists) {
      pushNotification("error", "No se encontró el empleado para actualizar.");
      return false;
    }

    try {
      await set(ref(db, `employees/${updated.id}`), updated);
      pushNotification("success", `Empleado ${updated.name} actualizado correctamente.`);
      return true;
    } catch (error) {
      console.error("Error al actualizar empleado en Firebase:", error);
      pushNotification("error", "No se pudo actualizar el empleado en el servidor.");
      return false;
    }
  };

  const deleteEmployee = async (id: string) => {
    const employeeToDelete = employees.find((emp) => emp.id === id);

    if (!employeeToDelete) {
      pushNotification("error", "No se encontró el empleado para eliminar.");
      return false;
    }

    try {
      await remove(ref(db, `employees/${id}`));
      pushNotification("success", `Empleado ${employeeToDelete.name} eliminado.`);
      return true;
    } catch (error) {
      console.error("Error al eliminar empleado en Firebase:", error);
      pushNotification("error", "No se pudo eliminar el empleado en el servidor.");
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
