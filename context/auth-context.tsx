"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: 0 | 1;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  signup: (
    name: string,
    email: string,
    password: string,
    repassword: string
  ) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on mount
useEffect(() => {
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    localStorage.removeItem("user");
  }
}, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });
      const userData = res.data.user;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, message: "Đăng nhập thành công" };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Lỗi đăng nhập",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    repassword: string,
    role: 0 | 1 = 0 // Default role is 0 (user)
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      console.log("Sending to server:", { name, email, password, repassword ,role});
      const res = await axios.post("http://localhost:5000/users/register", {
        name,
        email,
        password,
        repassword,
        role,
      });
      const userData = res.data.user;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, message: "Đăng ký thành công" };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Lỗi đăng ký",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 1,
    login,
    logout,
    signup,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
