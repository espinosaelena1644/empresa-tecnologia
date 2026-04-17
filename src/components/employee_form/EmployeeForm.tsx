// components/employee_form/EmployeeForm.tsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEmployees } from "../../context/EmployeeContext";
import { type Employee } from "../../types/employee";
import { v4 as uuidv4 } from "uuid";
import "./EmployeeForm.css";

interface EmployeeFormProps {
  employeeToEdit?: Employee;
  onEditComplete?: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employeeToEdit,
  onEditComplete,
}) => {
  const { addEmployee, updateEmployee } = useEmployees();

  const [form, setForm] = useState<{
    name: string;
    department: string;
    salary: number;
    startDate: Date | null;
    endDate: Date | null;
  }>({
    name: "",
    department: "",
    salary: 0,
    startDate: null,
    endDate: null,
  });

  // Pre-llenar formulario si estamos editando
  useEffect(() => {
    if (employeeToEdit) {
      setForm({
        name: employeeToEdit.name,
        department: employeeToEdit.department,
        salary: employeeToEdit.salary,
        startDate: new Date(employeeToEdit.startDate),
        endDate: new Date(employeeToEdit.endDate),
      });
    }
  }, [employeeToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "salary" ? Number(value) : value,
    });
  };

  const handleDateChange = (
    date: Date | null,
    field: "startDate" | "endDate",
  ) => {
    setForm({
      ...form,
      [field]: date,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate) {
      alert("Por favor selecciona ambas fechas");
      return;
    }

    if (employeeToEdit) {
      // Modo edición
      updateEmployee({
        ...employeeToEdit,
        name: form.name,
        department: form.department,
        salary: form.salary,
        startDate: form.startDate.toISOString().split("T")[0],
        endDate: form.endDate.toISOString().split("T")[0],
      });
      onEditComplete?.();
    } else {
      // Modo agregar
      addEmployee({
        id: uuidv4(),
        name: form.name,
        department: form.department,
        salary: form.salary,
        startDate: form.startDate.toISOString().split("T")[0],
        endDate: form.endDate.toISOString().split("T")[0],
      });
    }

    // Resetear formulario solo en modo agregar
    if (!employeeToEdit) {
      setForm({
        name: "",
        department: "",
        salary: 0,
        startDate: null,
        endDate: null,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="futuristic-form">
      <h2 className="form-title">
        {employeeToEdit ? "Editar Empleado" : "Agregar Empleado"}
      </h2>

      <div className="mb-3">
        <input
          name="name"
          placeholder="Nombre"
          className="futuristic-input"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <input
          name="department"
          placeholder="Departamento"
          className="futuristic-input"
          value={form.department}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <input
          name="salary"
          placeholder="$ Salario"
          type="number"
          className="futuristic-input"
          value={form.salary}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <DatePicker
          selected={form.startDate}
          onChange={(date) => handleDateChange(date, "startDate")}
          dateFormat="dd/MM/yyyy"
          placeholderText="Fecha de inicio"
          className="futuristic-input"
          required
        />
      </div>

      <div className="mb-3">
        <DatePicker
          selected={form.endDate}
          onChange={(date) => handleDateChange(date, "endDate")}
          dateFormat="dd/MM/yyyy"
          placeholderText="Fecha de fin"
          className="futuristic-input"
          required
        />
      </div>

      <button type="submit" className="futuristic-btn">
        {employeeToEdit ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
};

export default EmployeeForm;
