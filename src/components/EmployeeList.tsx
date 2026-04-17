// components/EmployeeList.tsx
import React from "react";
import { useEmployees } from "../context/EmployeeContext";
import EmployeeItem from "./EmployeeItem";

const EmployeeList: React.FC = () => {
  const { employees } = useEmployees();

  return (
    <div>
      <h2>Lista de empleados</h2>
      {employees.map((emp) => (
        <EmployeeItem key={emp.id} employee={emp} />
      ))}
    </div>
  );
};

export default EmployeeList;
