"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authService from "@/services/authService";
import { RegisterDTO, LoginDTO, ResetPasswordDTO } from "@/types/auth";
import { User } from "@/types/user";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  register: (data: RegisterDTO) => Promise<User>;
  login: (data: LoginDTO) => Promise<User>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<User | null>;
  requestResetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (data: ResetPasswordDTO) => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await authService.refreshTokens();

      if (data?.user) {
        setUser(data.user);
        return data.user;
      }

      setUser(null);
      return null;
    } catch (err: any) {
      setUser(null);
      setError(err.message || "Failed to refresh session");
      return null;
    } finally {
      setInitialized(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const register = useCallback(async (data: RegisterDTO) => {
    setLoading(true);
    setError(null);

    try {
      const createdUser = await authService.register(data);
      setUser(createdUser);
      return createdUser;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginDTO) => {
    setLoading(true);
    setError(null);

    try {
      const { user: loggedUser } = await authService.login(data);
      setUser(loggedUser);
      return loggedUser;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
    } catch (err: any) {
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const requestResetPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      await authService.requestResetPassword(email);
    } catch (err: any) {
      setError(err.message || "Request reset password failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmResetPassword = useCallback(async (data: ResetPasswordDTO) => {
    setLoading(true);
    setError(null);

    try {
      await authService.confirmResetPassword(data);
    } catch (err: any) {
      setError(err.message || "Password reset confirmation failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      initialized,
      loading,
      error,
      register,
      login,
      logout,
      refreshSession,
      requestResetPassword,
      confirmResetPassword,
      setUser,
    }),
    [
      user,
      initialized,
      loading,
      error,
      register,
      login,
      logout,
      refreshSession,
      requestResetPassword,
      confirmResetPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within AuthProvider");

  return context;
}
