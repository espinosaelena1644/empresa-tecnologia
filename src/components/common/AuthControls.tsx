import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type AuthError,
} from "firebase/auth";
import { auth } from "../../config/firebase-config";
import "./AuthControls.css";

const AuthControls: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoggedIn(Boolean(user));
      if (user) {
        setShowForm(false);
        setError("");
        setPassword("");
      }
    });

    return () => unsubscribe();
  }, []);

  const getUserName = () => {
    if (!currentUser) {
      return "Usuario";
    }

    if (currentUser.displayName?.trim()) {
      return currentUser.displayName.trim();
    }

    if (currentUser.email) {
      const [emailName] = currentUser.email.split("@");
      return emailName || currentUser.email;
    }

    return "Usuario";
  };

  const mapAuthError = (firebaseError: AuthError) => {
    switch (firebaseError.code) {
      case "auth/invalid-email":
        return "El correo no tiene un formato valido.";
      case "auth/user-disabled":
        return "Este usuario esta deshabilitado.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Correo o contrasena incorrectos.";
      case "auth/too-many-requests":
        return "Demasiados intentos. Intenta de nuevo mas tarde.";
      default:
        return "No se pudo iniciar sesion. Verifica tus credenciales.";
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Completa correo y contraseña.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Ingresa un correo válido.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      setShowForm(false);
      setError("");
      setPassword("");
    } catch (firebaseError) {
      setError(mapAuthError(firebaseError as AuthError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      await signOut(auth);
      setIsLoggedIn(false);
      setShowForm(false);
      setEmail("");
      setPassword("");
      setError("");
    } catch {
      setError("No se pudo cerrar sesion. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn) {
    return (
      <>
        <button
          type="button"
          className="auth-btn auth-btn-logout micro-press"
          onClick={handleLogout}
          disabled={isSubmitting}
          aria-label="Salir"
          title="Cerrar sesión"
        >
          {isSubmitting ? "Saliendo..." : "Salir"}
        </button>

        <section
          className="user-floating-card"
          aria-label="Usuario autenticado"
        >
          <span className="user-floating-label">Sesion activa</span>
          <strong className="user-floating-name">{getUserName()}</strong>
        </section>
      </>
    );
  }

  return (
    <div className="auth-controls">
      <button
        type="button"
        className="auth-btn auth-btn-login micro-press"
        onClick={() => {
          setShowForm((prev) => !prev);
          setError("");
        }}
        disabled={isSubmitting}
        aria-label="Iniciar sesión"
        title="Iniciar sesión"
      >
        Login
      </button>

      {showForm && (
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            className="auth-input"
            placeholder="Correo"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            disabled={isSubmitting}
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            disabled={isSubmitting}
          />
          {error && <p className="auth-error">{error}</p>}
          <button
            type="submit"
            className="auth-submit-btn micro-press"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthControls;
