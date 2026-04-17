// components/employee_list/EmployeeList.tsx
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEmployees } from "../../context/EmployeeContext";
import EmployeeItem from "../employee_item/EmployeeItem";
import EmployeeFilters, { type EmployeeFiltersState } from "./EmployeeFilters";
import EmployeePagination from "./EmployeePagination";
import LoadingSkeleton from "../common/LoadingSkeleton";
import "./EmployeeList.css";

const ITEMS_PER_PAGE = 10;

const EmployeeList: React.FC = () => {
  const { employees, isLoading } = useEmployees();

  // Estado para filtros
  const [filters, setFilters] = useState<EmployeeFiltersState>({
    search: "",
    department: "",
    minSalary: "",
    maxSalary: "",
    startDateFrom: "",
    startDateTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

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

  const isPaginated = filteredEmployees.length > ITEMS_PER_PAGE;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE),
  );

  const visibleEmployees = useMemo(() => {
    if (!isPaginated) {
      return filteredEmployees;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmployees, isPaginated, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, employees.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
  const updateFilter = (key: keyof EmployeeFiltersState, value: string) => {
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

      <EmployeeFilters
        filters={filters}
        uniqueDepartments={uniqueDepartments}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
        isClearDisabled={Object.values(filters).every((f) => f === "")}
        isLoading={isLoading}
      />

      <div className="list-content">
        {isLoading ? (
          <div className="list-skeleton-wrapper">
            <LoadingSkeleton className="list-skeleton-card" count={4} />
          </div>
        ) : filteredEmployees.length === 0 ? (
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
          <AnimatePresence mode="popLayout">
            <motion.div className="employees-grid" layout>
              {visibleEmployees.map((emp) => (
                <motion.div
                  key={emp.id}
                  layout
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <EmployeeItem employee={emp} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!isLoading && filteredEmployees.length > 0 && isPaginated && (
          <EmployeePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            onSelectPage={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
