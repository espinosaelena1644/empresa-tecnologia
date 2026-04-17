import React, { useMemo } from "react";
import { useEmployees } from "../../context/EmployeeContext";
import LoadingSkeleton from "../common/LoadingSkeleton";
import "./DashboardCards.css";

const DashboardCards: React.FC = () => {
  const { employees, isLoading } = useEmployees();

  const totalEmployees = employees.length;

  const averageSalary = useMemo(() => {
    if (employees.length === 0) return 0;
    return (
      employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
    );
  }, [employees]);

  const employeesByDepartment = useMemo(() => {
    return employees.reduce<Record<string, number>>((acc, emp) => {
      acc[emp.department] = (acc[emp.department] ?? 0) + 1;
      return acc;
    }, {});
  }, [employees]);

  return (
    <section className="dashboard-panel">
      <h3 className="dashboard-heading">Dashboard de métricas</h3>

      <div className="dashboard-grid">
        {isLoading ? (
          <>
            <LoadingSkeleton className="dashboard-skeleton" count={3} />
          </>
        ) : (
          <>
        <article className="dashboard-card metric-card">
          <div className="card-label">Total de empleados</div>
          <div className="card-value">{totalEmployees}</div>
        </article>

        <article className="dashboard-card metric-card">
          <div className="card-label">Promedio de salarios</div>
          <div className="card-value">
            {averageSalary.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              maximumFractionDigits: 0,
            })}
          </div>
        </article>

        <article className="dashboard-card department-card">
          <div className="card-label">Empleados por departamento</div>
          <div className="department-list">
            {Object.entries(employeesByDepartment).length > 0 ? (
              Object.entries(employeesByDepartment).map(
                ([department, count]) => (
                  <span key={department} className="department-chip">
                    {department}: {count}
                  </span>
                ),
              )
            ) : (
              <span className="department-chip empty">Sin empleados</span>
            )}
          </div>
        </article>
          </>
        )}
      </div>
    </section>
  );
};

export default DashboardCards;
