"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: "admin" | "user";
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
    password: string
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
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test credentials for admin
    if (email === "admin" && password === "1234678") {
      const userData = {
        id: "1",
        name: "Admin User",
        email: "admin@laptopstore.com",
        avatar: "https://i.pravatar.cc/100",
        phone: "+84 123 456 789",
        role: "admin" as const,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoading(false);

      return { success: true, message: "Admin login successful!" };
    }
    // Test credentials for regular user
    else if (email === "user" && password === "123456") {
      const userData = {
        id: "2",
        name: "Regular User",
        email: "user@example.com",
        avatar: "https://i.pravatar.cc/100",
        phone: "+84 987 654 321",
        role: "user" as const,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoading(false);

      return { success: true, message: "Login successful!" };
    } else {
      setIsLoading(false);
      return {
        success: false,
        message:
          'Invalid credentials. Use "admin"/"1234678" for admin or "user"/"123456" for regular user',
      };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if email already exists (simple check)
    if (email === "admin@laptopstore.com" || email === "user@example.com") {
      setIsLoading(false);
      return { success: false, message: "Email already exists" };
    }

    // Create new user (default role is 'user')
    const userData = {
      id: Date.now().toString(),
      name,
      email,
      avatar: "https://i.pravatar.cc/100",
      phone: "", // Default empty phone for new users
      role: "user" as const, // New users default to 'user' role
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoading(false);

    return { success: true, message: "Account created successfully!" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    logout,
    signup,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
