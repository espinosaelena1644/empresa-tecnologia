import React from "react";

type ThemeMode = "dark" | "light";

interface HeaderProps {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <div className="app-title-row">
      <h1 className="app-title">Gestión de Empleados</h1>
      <button
        type="button"
        className="theme-toggle-btn micro-press"
        onClick={toggleTheme}
        aria-label="Cambiar tema"
        title={
          theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
        }
      >
        <span className="theme-toggle-icon">
          {theme === "dark" ? "☀" : "🌙"}
        </span>
        <span className="theme-toggle-text">
          {theme === "dark" ? "Tema claro" : "Tema oscuro"}
        </span>
      </button>
    </div>
  );
};

export default Header;
