import React from "react";

export interface EmployeeFiltersState {
  search: string;
  department: string;
  minSalary: string;
  maxSalary: string;
  startDateFrom: string;
  startDateTo: string;
}

interface EmployeeFiltersProps {
  filters: EmployeeFiltersState;
  uniqueDepartments: string[];
  onUpdateFilter: (key: keyof EmployeeFiltersState, value: string) => void;
  onClearFilters: () => void;
  isClearDisabled: boolean;
}

const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  filters,
  uniqueDepartments,
  onUpdateFilter,
  onClearFilters,
  isClearDisabled,
}) => {
  return (
    <div className="filters-section">
      <div className="filters-grid">
        <div className="filter-item">
          <input
            type="text"
            placeholder="Buscar por nombre o departamento..."
            className="futuristic-input filter-input"
            value={filters.search}
            onChange={(e) => onUpdateFilter("search", e.target.value)}
          />
        </div>

        <div className="filter-item">
          <select
            className="futuristic-input filter-select"
            value={filters.department}
            onChange={(e) => onUpdateFilter("department", e.target.value)}
          >
            <option value="">Todos los departamentos</option>
            {uniqueDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <input
            type="number"
            placeholder="Salario minimo"
            className="futuristic-input filter-input"
            value={filters.minSalary}
            onChange={(e) => onUpdateFilter("minSalary", e.target.value)}
          />
        </div>

        <div className="filter-item">
          <input
            type="number"
            placeholder="Salario maximo"
            className="futuristic-input filter-input"
            value={filters.maxSalary}
            onChange={(e) => onUpdateFilter("maxSalary", e.target.value)}
          />
        </div>

        <div className="filter-item">
          <input
            type="date"
            placeholder="Fecha desde"
            className="futuristic-input filter-input"
            value={filters.startDateFrom}
            onChange={(e) => onUpdateFilter("startDateFrom", e.target.value)}
          />
        </div>

        <div className="filter-item">
          <input
            type="date"
            placeholder="Fecha hasta"
            className="futuristic-input filter-input"
            value={filters.startDateTo}
            onChange={(e) => onUpdateFilter("startDateTo", e.target.value)}
          />
        </div>
      </div>

      <div className="filters-actions">
        <button
          onClick={onClearFilters}
          className="futuristic-btn clear-btn"
          disabled={isClearDisabled}
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

export default EmployeeFilters;
