// context/EmployeeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { type Employee } from "../types/employee";

type NotificationType = "success" | "error";

export interface ToastNotification {
  id: string;
  type: NotificationType;
  message: string;
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (emp: Employee) => boolean;
  updateEmployee: (emp: Employee) => boolean;
  deleteEmployee: (id: string) => boolean;
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

  // Cargar desde localStorage (solo una vez al montar)
  useEffect(() => {
    try {
      const data = localStorage.getItem("employees");
      if (data) {
        const parsedData = JSON.parse(data);
        console.log("Empleados cargados desde localStorage:", parsedData);
        setEmployees(parsedData);
      } else {
        console.log("No hay empleados guardados en localStorage");
      }
    } catch (error) {
      console.error("Error al cargar empleados desde localStorage:", error);
      pushNotification(
        "error",
        "No se pudieron cargar los empleados guardados.",
      );
      // Si hay error, mantener array vacío
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage (solo después de cargar inicialmente)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("employees", JSON.stringify(employees));
        console.log("Empleados guardados en localStorage:", employees);
      } catch (error) {
        console.error("Error al guardar empleados en localStorage:", error);
        pushNotification(
          "error",
          "No se pudieron guardar los cambios localmente.",
        );
      }
    }
  }, [employees, isLoaded]);

  const addEmployee = (emp: Employee) => {
    if (!emp.name.trim() || !emp.department.trim() || emp.salary <= 0) {
      pushNotification(
        "error",
        "No se pudo agregar el empleado. Revisa los datos.",
      );
      return false;
    }

    setEmployees((prev) => [...prev, emp]);
    pushNotification("success", `Empleado ${emp.name} agregado correctamente.`);
    return true;
  };

  const updateEmployee = (updated: Employee) => {
    const exists = employees.some((emp) => emp.id === updated.id);

    if (!exists) {
      pushNotification("error", "No se encontró el empleado para actualizar.");
      return false;
    }

    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updated.id ? updated : emp)),
    );
    pushNotification(
      "success",
      `Empleado ${updated.name} actualizado correctamente.`,
    );
    return true;
  };

  const deleteEmployee = (id: string) => {
    const employeeToDelete = employees.find((emp) => emp.id === id);

    if (!employeeToDelete) {
      pushNotification("error", "No se encontró el empleado para eliminar.");
      return false;
    }

    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    pushNotification("success", `Empleado ${employeeToDelete.name} eliminado.`);
    return true;
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

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context)
    throw new Error("useEmployees debe usarse dentro de EmployeeProvider");
  return context;
};
