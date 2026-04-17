// components/employee_form/EmployeeForm.tsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEmployees } from "../../context/EmployeeContext";
import { v4 as uuidv4 } from "uuid";
import "./EmployeeForm.css";

const EmployeeForm: React.FC = () => {
  const { addEmployee } = useEmployees();

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

    addEmployee({
      id: uuidv4(),
      name: form.name,
      department: form.department,
      salary: form.salary,
      startDate: form.startDate.toISOString().split("T")[0], // Formato YYYY-MM-DD
      endDate: form.endDate.toISOString().split("T")[0],
    });

    setForm({
      name: "",
      department: "",
      salary: 0,
      startDate: null,
      endDate: null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="futuristic-form">
      <h2 className="form-title">Agregar Empleado</h2>

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
          onChange={(date:any) => handleDateChange(date, "startDate")}
          dateFormat="dd/MM/yyyy"
          placeholderText="Fecha de inicio"
          className="futuristic-input"
          required
        />
      </div>

      <div className="mb-3">
        <DatePicker
          selected={form.endDate}
          onChange={(date:any) => handleDateChange(date, "endDate")}
          dateFormat="dd/MM/yyyy"
          placeholderText="Fecha de fin"
          className="futuristic-input"
          required
        />
      </div>

      <button type="submit" className="futuristic-btn">
        Guardar
      </button>
    </form>
  );
};

export default EmployeeForm;
