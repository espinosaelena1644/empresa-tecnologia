// context/EmployeeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { type Employee } from "../types/employee";

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (emp: Employee) => void;
  updateEmployee: (emp: Employee) => void;
  deleteEmployee: (id: string) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined,
);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
      }
    }
  }, [employees, isLoaded]);

  const addEmployee = (emp: Employee) => {
    setEmployees((prev) => [...prev, emp]);
  };

  const updateEmployee = (updated: Employee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updated.id ? updated : emp)),
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  return (
    <EmployeeContext.Provider
      value={{ employees, addEmployee, updateEmployee, deleteEmployee }}
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
