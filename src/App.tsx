// App.tsx
import React from "react";
import { EmployeeProvider } from "./context/EmployeeContext";
import EmployeeForm from "./components/employee_form/EmployeeForm";
import EmployeeList from "./components/employee_list/EmployeeList";
import "./App.css";

const App: React.FC = () => {
  return (
    <EmployeeProvider>
      <div className="app-container">
        <div className="app-background"></div>

        <div className="app-content">
          <h1 className="app-title">Gestión de Empleados</h1>
          <EmployeeForm />
          <EmployeeList />
        </div>
      </div>
    </EmployeeProvider>
  );
};

export default App;
