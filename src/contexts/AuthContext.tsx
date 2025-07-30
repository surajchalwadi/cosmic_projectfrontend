import React, { useState, useEffect, createContext, ReactNode } from "react";
import { authAPI } from "@/utils/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "super-admin" | "manager" | "technician";
  lastLogin?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// API Utils - inline for now
const apiUtils = {
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },
  
  getCurrentUserFromSession: (): User | null => {
    try {
      const userStr = sessionStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing session user:", error);
      return null;
    }
  },
  
  clearAuth: () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("currentUser");
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          // No token, check session storage as fallback
          const sessionUser = apiUtils.getCurrentUserFromSession();
          if (sessionUser) {
            setUser(sessionUser);
          }
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        try {
          const data = await authAPI.getCurrentUser();
          
          if (data.status === "success" && data.data?.user) {
            setUser(data.data.user);
            // Update session storage
            sessionStorage.setItem("currentUser", JSON.stringify(data.data.user));
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          // Token might be expired or invalid
          console.warn(`Auth verification failed:`, error);
          
          // Clear auth and try session fallback
          apiUtils.clearAuth();
          const sessionUser = apiUtils.getCurrentUserFromSession();
          if (sessionUser) {
            setUser(sessionUser);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        
        // Fallback to session data
        const sessionUser = apiUtils.getCurrentUserFromSession();
        if (sessionUser) {
          console.log("Using session fallback for user data");
          setUser(sessionUser);
        } else {
          // Clear everything if no session data
          apiUtils.clearAuth();
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: string,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const data = await authAPI.login(email.trim().toLowerCase(), password, role);

      if (data.status === "success") {
        if (data.data?.token && data.data?.user) {
          localStorage.setItem("token", data.data.token);
          setUser(data.data.user);
          sessionStorage.setItem("currentUser", JSON.stringify(data.data.user));
          return true;
        } else {
          console.error("Login response missing required data:", data);
          return false;
        }
      } else {
        console.error("Login failed:", data.message || "Unknown error");
        return false;
      }
    } catch (error) {
      console.error("Login request failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Try to logout on backend, but don't fail if it doesn't work
        await authAPI.logout().catch(error => {
          console.warn("Backend logout failed:", error);
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      apiUtils.clearAuth();
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;