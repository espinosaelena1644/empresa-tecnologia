// components/EmployeeItem.tsx
import React from "react";
import { Employee } from "../types/Employee";
import { useEmployees } from "../context/EmployeeContext";

const EmployeeItem: React.FC<{ employee: Employee }> = ({ employee }) => {
  const { deleteEmployee } = useEmployees();

  return (
    <div>
      <p>
        {employee.name} - {employee.department}
      </p>
      <p>Salario: {employee.salary}</p>
      <p>
        {employee.startDate} - {employee.endDate}
      </p>

      <button onClick={() => deleteEmployee(employee.id)}>Eliminar</button>
    </div>
  );
};

export default EmployeeItem;
