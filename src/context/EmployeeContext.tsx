// context/EmployeeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {  type Employee } from "../types/employee";

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

  // Cargar desde localStorage
  useEffect(() => {
    const data = localStorage.getItem("employees");
    if (data) setEmployees(JSON.parse(data));
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

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
