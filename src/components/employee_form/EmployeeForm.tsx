// components/EmployeeForm.tsx
import React, { useState } from "react";
import { useEmployees } from "../../context/EmployeeContext";
import { type Employee } from "../../types/employee";
import { v4 as uuidv4 } from "uuid";
import "./EmployeeForm.css";

const EmployeeForm: React.FC = () => {
  const { addEmployee } = useEmployees();

  const [form, setForm] = useState<Omit<Employee, "id">>({
    name: "",
    department: "",
    salary: 0,
    startDate: "",
    endDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addEmployee({
      ...form,
      id: uuidv4(),
      salary: Number(form.salary),
    });

    setForm({
      name: "",
      department: "",
      salary: 0,
      startDate: "",
      endDate: "",
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
        <input
          name="startDate"
          placeholder="Fecha de inicio"
          type="date"
          className="futuristic-input"
          value={form.startDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <input
          name="endDate"
          placeholder="Fecha de fin"
          type="date"
          className="futuristic-input"
          value={form.endDate}
          onChange={handleChange}
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
