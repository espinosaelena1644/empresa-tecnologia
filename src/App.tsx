// App.tsx
import React from "react";
import { EmployeeProvider } from "./context/EmployeeContext";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";

const App: React.FC = () => {
  return (
    <EmployeeProvider>
      <h1>Gestión de empleados</h1>
      <EmployeeForm />
      <EmployeeList />
    </EmployeeProvider>
  );
};

export default App;
