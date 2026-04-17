import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEmployees } from "../../context/EmployeeContext";
import "./ToastNotifications.css";

const ToastNotifications: React.FC = () => {
  const { notifications, removeNotification } = useEmployees();

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`toast-item toast-${notification.type}`}
            initial={{ opacity: 0, y: -20, x: 48 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -12, x: 56 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            role="status"
          >
            <div className="toast-content">
              <span className="toast-title">
                {notification.type === "success" ? "Exito" : "Error"}
              </span>
              <p className="toast-message">{notification.message}</p>
            </div>
            <button
              type="button"
              className="toast-close micro-press"
              aria-label="Cerrar notificacion"
              onClick={() => removeNotification(notification.id)}
            >
              x
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotifications;
