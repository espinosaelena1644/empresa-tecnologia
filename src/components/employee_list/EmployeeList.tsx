// components/employee_list/EmployeeList.tsx
import React, { useState, useMemo } from "react";
import { useEmployees } from "../../context/EmployeeContext";
import EmployeeItem from "../employee_item/EmployeeItem";
import "./EmployeeList.css";

const EmployeeList: React.FC = () => {
  const { employees } = useEmployees();

  // Estado para filtros
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    minSalary: "",
    maxSalary: "",
    startDateFrom: "",
    startDateTo: "",
  });

  // Empleados filtrados
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      // Búsqueda por nombre o departamento
      const searchMatch =
        filters.search === "" ||
        employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.department
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      // Filtro por departamento
      const departmentMatch =
        filters.department === "" || employee.department === filters.department;

      // Filtro por salario mínimo
      const minSalaryMatch =
        filters.minSalary === "" ||
        employee.salary >= parseFloat(filters.minSalary);

      // Filtro por salario máximo
      const maxSalaryMatch =
        filters.maxSalary === "" ||
        employee.salary <= parseFloat(filters.maxSalary);

      // Filtro por fecha de inicio desde
      const startDateFromMatch =
        filters.startDateFrom === "" ||
        new Date(employee.startDate) >= new Date(filters.startDateFrom);

      // Filtro por fecha de inicio hasta
      const startDateToMatch =
        filters.startDateTo === "" ||
        new Date(employee.startDate) <= new Date(filters.startDateTo);

      return (
        searchMatch &&
        departmentMatch &&
        minSalaryMatch &&
        maxSalaryMatch &&
        startDateFromMatch &&
        startDateToMatch
      );
    });
  }, [employees, filters]);

  // Departamentos únicos para el select
  const uniqueDepartments = useMemo(() => {
    const departments = employees.map((emp) => emp.department);
    return [...new Set(departments)].sort();
  }, [employees]);

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: "",
      department: "",
      minSalary: "",
      maxSalary: "",
      startDateFrom: "",
      startDateTo: "",
    });
  };

  // Actualizar filtro
  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="employee-list-container">
      <div className="list-header">
        <h2 className="list-title">Lista de Empleados</h2>
        <div className="employee-count">
          <span className="count-badge">{filteredEmployees.length}</span>
          {employees.length !== filteredEmployees.length && (
            <span className="total-count">de {employees.length}</span>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-grid">
          {/* Búsqueda */}
          <div className="filter-item">
            <input
              type="text"
              placeholder="Buscar por nombre o departamento..."
              className="futuristic-input filter-input"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>

          {/* Departamento */}
          <div className="filter-item">
            <select
              className="futuristic-input filter-select"
              value={filters.department}
              onChange={(e) => updateFilter("department", e.target.value)}
            >
              <option value="">Todos los departamentos</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Salario mínimo */}
          <div className="filter-item">
            <input
              type="number"
              placeholder="Salario mínimo"
              className="futuristic-input filter-input"
              value={filters.minSalary}
              onChange={(e) => updateFilter("minSalary", e.target.value)}
            />
          </div>

          {/* Salario máximo */}
          <div className="filter-item">
            <input
              type="number"
              placeholder="Salario máximo"
              className="futuristic-input filter-input"
              value={filters.maxSalary}
              onChange={(e) => updateFilter("maxSalary", e.target.value)}
            />
          </div>

          {/* Fecha desde */}
          <div className="filter-item">
            <input
              type="date"
              placeholder="Fecha desde"
              className="futuristic-input filter-input"
              value={filters.startDateFrom}
              onChange={(e) => updateFilter("startDateFrom", e.target.value)}
            />
          </div>

          {/* Fecha hasta */}
          <div className="filter-item">
            <input
              type="date"
              placeholder="Fecha hasta"
              className="futuristic-input filter-input"
              value={filters.startDateTo}
              onChange={(e) => updateFilter("startDateTo", e.target.value)}
            />
          </div>
        </div>

        {/* Botón limpiar */}
        <div className="filters-actions">
          <button
            onClick={clearFilters}
            className="futuristic-btn clear-btn"
            disabled={Object.values(filters).every((f) => f === "")}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <div className="list-content">
        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">
              {employees.length === 0
                ? "No hay empleados registrados"
                : "No se encontraron empleados con los filtros aplicados"}
            </p>
            <p className="empty-hint">
              {employees.length === 0
                ? "Agrega uno para comenzar"
                : "Prueba ajustando los filtros"}
            </p>
          </div>
        ) : (
          <div className="employees-grid">
            {filteredEmployees.map((emp) => (
              <EmployeeItem key={emp.id} employee={emp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
