// components/employee_form/EmployeeForm.tsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEmployees } from "../../context/EmployeeContext";
import { type Employee } from "../../types/employee";
import { v4 as uuidv4 } from "uuid";
import LoadingSkeleton from "../common/LoadingSkeleton";
import "./EmployeeForm.css";

interface EmployeeFormProps {
  employeeToEdit?: Employee;
  onEditComplete?: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employeeToEdit,
  onEditComplete,
}) => {
  const { addEmployee, updateEmployee, isLoading } = useEmployees();

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

  const [errors, setErrors] = useState<{
    name?: string;
    department?: string;
    salary?: string;
    startDate?: string;
    endDate?: string;
    dateRange?: string;
  }>({});

  const validateForm = () => {
    const nextErrors: typeof errors = {};

    if (!form.name.trim()) {
      nextErrors.name = "El nombre es obligatorio.";
    }

    if (!form.department.trim()) {
      nextErrors.department = "El departamento es obligatorio.";
    }

    if (form.salary <= 0) {
      nextErrors.salary = "El salario debe ser positivo.";
    }

    if (!form.startDate) {
      nextErrors.startDate = "Selecciona una fecha de inicio.";
    }

    if (!form.endDate) {
      nextErrors.endDate = "Selecciona una fecha de fin.";
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      nextErrors.dateRange =
        "Fecha de fin no puede ser anterior a fecha de inicio.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Pre-llenar formulario si estamos editando
  useEffect(() => {
    if (employeeToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      dateRange: undefined,
    }));
  };

  const handleDateChange = (
    date: Date | null,
    field: "startDate" | "endDate",
  ) => {
    setForm({
      ...form,
      [field]: date,
    });
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      dateRange: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (employeeToEdit) {
      // Modo edición
      const updated = await updateEmployee({
        ...employeeToEdit,
        name: form.name,
        department: form.department,
        salary: form.salary,
        startDate: form.startDate!.toISOString().split("T")[0],
        endDate: form.endDate!.toISOString().split("T")[0],
      });

      if (updated) {
        onEditComplete?.();
      }
    } else {
      // Modo agregar
      const added = await addEmployee({
        id: uuidv4(),
        name: form.name,
        department: form.department,
        salary: form.salary,
        startDate: form.startDate!.toISOString().split("T")[0],
        endDate: form.endDate!.toISOString().split("T")[0],
      });

      if (!added) {
        return;
      }

      // Resetear formulario solo cuando se agrega correctamente
      setForm({
        name: "",
        department: "",
        salary: 0,
        startDate: null,
        endDate: null,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="futuristic-form form-skeleton">
        <div className="form-title">Cargando formulario...</div>
        <LoadingSkeleton className="form-skeleton-line" count={6} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="futuristic-form">
      <h2 className="form-title">
        {employeeToEdit ? "Editar Empleado" : "Agregar Empleado"}
      </h2>

      <div className="mb-3">
        <input
          name="name"
          placeholder="Nombre"
          className={`futuristic-input ${errors.name ? "input-error" : ""}`}
          value={form.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <input
          name="department"
          placeholder="Departamento"
          className={`futuristic-input ${errors.department ? "input-error" : ""}`}
          value={form.department}
          onChange={handleChange}
          required
        />
        {errors.department && (
          <div className="error-message">{errors.department}</div>
        )}
      </div>

      <div className="mb-3">
        <input
          name="salary"
          placeholder="$ Salario"
          type="number"
          className={`futuristic-input ${errors.salary ? "input-error" : ""}`}
          value={form.salary}
          onChange={handleChange}
          required
        />
        {errors.salary && <div className="error-message">{errors.salary}</div>}
      </div>

      <div className="mb-3">
        <DatePicker
          selected={form.startDate}
          onChange={(date: Date | null) => handleDateChange(date, "startDate")}
          dateFormat="dd/MM/yyyy"
          placeholderText="Fecha de inicio"
          className={`futuristic-input ${errors.startDate ? "input-error" : ""}`}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          required
        />
        {errors.startDate && (
          <div className="error-message">{errors.startDate}</div>
        )}
      </div>

      <div className="mb-3">
        <DatePicker
          selected={form.endDate}
          onChange={(date: Date | null) => handleDateChange(date, "endDate")}
          dateFormat="dd/MM/yyyy"
          placeholderText="Fecha de fin"
          className={`futuristic-input ${errors.endDate || errors.dateRange ? "input-error" : ""}`}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          required
        />
        {errors.endDate && (
          <div className="error-message">{errors.endDate}</div>
        )}
        {errors.dateRange && (
          <div className="error-message">{errors.dateRange}</div>
        )}
      </div>

      <button type="submit" className="futuristic-btn micro-press">
        {employeeToEdit ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
};

export default EmployeeForm;
