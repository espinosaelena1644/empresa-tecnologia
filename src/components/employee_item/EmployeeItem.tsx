// components/employee_item/EmployeeItem.tsx
import React, { useState } from "react";
import { type Employee } from "../../types/employee";
import { useEmployees } from "../../context/EmployeeContext";
import EmployeeForm from "../employee_form/EmployeeForm";
import "./EmployeeItem.css";

const EmployeeItem: React.FC<{ employee: Employee }> = ({ employee }) => {
  const { deleteEmployee } = useEmployees();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditComplete = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="futuristic-card">
        <div className="card-header">
          <h5 className="employee-name">{employee.name}</h5>
          <div className="card-actions">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="futuristic-edit-btn"
              title="Editar empleado"
            >
              ✏️
            </button>
            <button
              onClick={() => deleteEmployee(employee.id)}
              className="futuristic-delete-btn"
              title="Eliminar empleado"
            >
              ✕
            </button>
          </div>
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

      {/* Modal de edición */}
      {isEditModalOpen && (
        <div
          className="edit-modal-overlay"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="edit-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setIsEditModalOpen(false)}
              title="Cerrar"
            >
              ✕
            </button>
            <EmployeeForm
              employeeToEdit={employee}
              onEditComplete={handleEditComplete}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeItem;
