// App.tsx
import React from "react";
import { motion } from "framer-motion";
import { EmployeeProvider } from "./context/EmployeeContext";
import EmployeeForm from "./components/employee_form/EmployeeForm";
import EmployeeList from "./components/employee_list/EmployeeList";
import DashboardCards from "./components/dashboard/DashboardCards";
import "./App.css";

const App: React.FC = () => {
  return (
    <EmployeeProvider>
      <motion.div
        className="app-container"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <h1 className="app-title">Gestión de Empleados</h1>

        <motion.div
          className="app-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.4 }}
        >
          <motion.div
            className="form-section"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.35 }}
          >
            <EmployeeForm />
            <DashboardCards />
          </motion.div>

          <motion.div
            className="list-section"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.35 }}
          >
            <EmployeeList />
          </motion.div>
        </motion.div>
      </motion.div>
    </EmployeeProvider>
  );
};

export default App;
