import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, AuthState } from "../types/user";
import { authService } from "../services/auth.service";
import { api } from "../services/api";

interface AuthContextType extends AuthState {
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      api.setToken(token);
      const response = await authService.me();
      const usuario = response.usuario;

      const user: User = {
        id: usuario.id_usuario.toString(),
        name: usuario.nombre,
        email: usuario.correo,
        role: usuario.rol.toLowerCase() as any,
        department: usuario.area,
        area: usuario.area,
        id_area: usuario.id_area,
      };

      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      api.clearToken();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const login = useCallback(async (correo: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const resultado = await authService.login(correo, password);
      api.setToken(resultado.token);

      const user: User = {
        id: resultado.usuario.id_usuario.toString(),
        name: resultado.usuario.nombre,
        email: resultado.usuario.correo,
        role: resultado.usuario.rol.toLowerCase() as any,
        department: resultado.usuario.area,
        area: resultado.usuario.area,
        id_area: resultado.usuario.id_area,
      };

      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Login failed";
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: errorMsg,
      });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
