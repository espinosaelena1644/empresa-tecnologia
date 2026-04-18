// App.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EmployeeProvider } from "./context/EmployeeContext";
import EmployeeForm from "./components/employee_form/EmployeeForm";
import EmployeeList from "./components/employee_list/EmployeeList";
import DashboardCards from "./components/dashboard/DashboardCards";
import Header from "./components/common/Header";
import ToastNotifications from "./components/common/ToastNotifications";
import "./App.css";

type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "employee-theme";

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <EmployeeProvider>
      <motion.div
        className="app-container"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="app-background" aria-hidden="true" />
        <ToastNotifications />

        <Header theme={theme} toggleTheme={toggleTheme} />

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
