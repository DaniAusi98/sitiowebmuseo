import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../lib/auth";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================
  // RESTAURAR SESIÓN
  // ==========================
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Si el token no existe o expiró, limpiar sesión
        if (!authService.isAuthenticated()) {
          authService.logout();
          setUser(null);
          return;
        }

        // Intentar obtener el usuario del localStorage
        let currentUser = authService.getUser();

        // Si no está en localStorage, pedirlo al backend
        if (!currentUser) {
          currentUser = await authService.getCurrentUser();
        }

        setUser(currentUser);
      } catch (error) {
        console.error("Error restaurando sesión:", error);

        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ==========================
  // LOGIN
  // ==========================
  const login = async (email, password) => {
    const result = await authService.login(email, password);

    setUser(result.user);

    return result;
  };

  // ==========================
  // REGISTER
  // ==========================
  const register = async (userData) => {
    return await authService.register(userData);
  };

  // ==========================
  // LOGOUT
  // ==========================
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
