// components/EmployeeForm.tsx
import React, { useState } from "react";
import { useEmployees } from "../context/EmployeeContext";
import { Employee } from "../types/Employee";
import { v4 as uuidv4 } from "uuid";

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
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="department"
        placeholder="Departamento"
        value={form.department}
        onChange={handleChange}
      />
      <input
        name="salary"
        type="number"
        value={form.salary}
        onChange={handleChange}
      />
      <input
        name="startDate"
        type="date"
        value={form.startDate}
        onChange={handleChange}
      />
      <input
        name="endDate"
        type="date"
        value={form.endDate}
        onChange={handleChange}
      />

      <button type="submit">Guardar</button>
    </form>
  );
};

export default EmployeeForm;
