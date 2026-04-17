// components/EmployeeItem.tsx
import React from "react";
import { type Employee } from "../../types/employee";
import { useEmployees } from "../../context/EmployeeContext";
import "./EmployeeItem.css";

const EmployeeItem: React.FC<{ employee: Employee }> = ({ employee }) => {
  const { deleteEmployee } = useEmployees();

  return (
    <div className="futuristic-card">
      <div className="card-header">
        <h5 className="employee-name">{employee.name}</h5>
        <button
          onClick={() => deleteEmployee(employee.id)}
          className="futuristic-delete-btn"
          title="Eliminar empleado"
        >
          ✕
        </button>
      </div>

      <div className="card-content">
        <p className="department-label">{employee.department}</p>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Salario</span>
            <span className="info-value">
              ${employee.salary.toLocaleString()}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Inicio</span>
            <span className="info-value">{employee.startDate}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fin</span>
            <span className="info-value">{employee.endDate}</span>
          </div>
        </div>
      </div>

      <div className="card-border"></div>
    </div>
  );
};

export default EmployeeItem;
