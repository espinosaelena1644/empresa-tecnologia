// components/employee_item/EmployeeItem.tsx
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type Employee } from "../../types/employee";
import { useEmployees } from "../../context/EmployeeContext";
import EmployeeForm from "../employee_form/EmployeeForm";
import "./EmployeeItem.css";

const EmployeeItem: React.FC<{ employee: Employee }> = ({ employee }) => {
  const { deleteEmployee, isAuthenticated, currentUserUid } = useEmployees();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const canManageEmployee = isAuthenticated;

  const getAddedBy = () => {
    if (employee.addedByName?.trim()) {
      return employee.addedByName;
    }

    if (employee.addedByEmail) {
      const [emailName] = employee.addedByEmail.split("@");
      return emailName || employee.addedByEmail;
    }

    return "No disponible";
  };

  const handleEditComplete = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="futuristic-card">
        <div className="card-header">
          <h5 className="employee-name">{employee.name}</h5>
          {canManageEmployee && (
            <div className="card-actions">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="futuristic-edit-btn micro-press"
                title="Editar empleado"
              >
                ✏️
              </button>
              <button
                onClick={async () => {
                  await deleteEmployee(employee.id);
                }}
                className="futuristic-delete-btn micro-press"
                title="Eliminar empleado"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="card-content">
          <p className="department-label">{employee.department}</p>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Salario</span>
              <span className="info-value">
                ${(employee.salary ?? 0).toLocaleString()}
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
            <div className="info-item">
              <span className="info-label">Agregado por</span>
              <span className="info-value">{getAddedBy()}</span>
            </div>
          </div>
        </div>

        <div className="card-border"></div>
      </div>

      {/* Modal de edición */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            className="edit-modal-overlay"
            onClick={() => setIsEditModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="edit-modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.24 }}
            >
              <button
                className="modal-close-btn micro-press"
                onClick={() => setIsEditModalOpen(false)}
                title="Cerrar"
              >
                ✕
              </button>
              <EmployeeForm
                employeeToEdit={employee}
                onEditComplete={handleEditComplete}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmployeeItem;
