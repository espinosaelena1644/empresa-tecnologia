// components/EmployeeList.tsx
import React from "react";
import { useEmployees } from "../../context/EmployeeContext";
import EmployeeItem from "../employee_item/EmployeeItem";
import "./EmployeeList.css";

const EmployeeList: React.FC = () => {
  const { employees } = useEmployees();

  return (
    <div className="employee-list-container">
      <div className="list-header">
        <h2 className="list-title">Lista de Empleados</h2>
        <div className="employee-count">
          <span className="count-badge">{employees.length}</span>
        </div>
      </div>

      <div className="list-content">
        {employees.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No hay empleados registrados</p>
            <p className="empty-hint">Agrega uno para comenzar</p>
          </div>
        ) : (
          <div className="employees-grid">
            {employees.map((emp) => (
              <EmployeeItem key={emp.id} employee={emp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
