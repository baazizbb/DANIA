import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearToken, getStoredToken, isTokenExpired, saveToken } from "./token";

interface LoginResponse {
  token?: string;
  accessToken?: string;
}

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL ?? "http://localhost:3000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
    } else {
      clearToken();
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Identifiants invalides.");
    }

    const data = (await response.json()) as LoginResponse;
    const jwt = data.token ?? data.accessToken;

    if (!jwt) {
      throw new Error("Aucun token JWT retourne par le serveur.");
    }

    saveToken(jwt);
    setToken(jwt);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error("Impossible de creer le compte.");
    }

    const data = (await response.json()) as LoginResponse;
    const jwt = data.token ?? data.accessToken;

    if (!jwt) {
      throw new Error("Compte cree mais token JWT manquant.");
    }

    saveToken(jwt);
    setToken(jwt);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Impossible d'envoyer le mail de reinitialisation.");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      register,
      requestPasswordReset,
      logout,
    }),
    [token, isLoading, login, register, requestPasswordReset, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit etre utilise dans AuthProvider.");
  }

  return context;
}
