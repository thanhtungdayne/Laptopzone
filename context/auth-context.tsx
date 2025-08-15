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
  dob?: string;
  address?: string;
  status?: boolean;
  role: 0 | 1;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
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
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user và token từ localStorage khi mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedUser !== "undefined") {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (savedToken && savedToken !== "undefined") {
          setToken(savedToken);
        }
      }
    } catch (error) {
      console.error("Failed to parse user or token from localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        email,
        password,
      });
      const userData = res.data.user || res.data.data?.user;
      const newToken = res.data.token;

      if (!userData) {
        throw new Error("Không nhận được dữ liệu người dùng");
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      if (newToken) {
        setToken(newToken);
        localStorage.setItem("token", newToken);
      } else {
        console.warn("No token received from server");
      }

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
    role: 0 | 1 = 0
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      console.log("Sending to server:", { name, email, password, repassword, role });
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        name,
        email,
        password,
        repassword,
        role,
      });
      const userData = res.data.user || res.data.data?.user;
      const newToken = res.data.token;

      if (!userData) {
        throw new Error("Không nhận được dữ liệu người dùng");
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      if (newToken) {
        setToken(newToken);
        localStorage.setItem("token", newToken);
      } else {
        console.warn("No token received from server");
      }

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

  const updateUser = async (
    userData: Partial<User>
  ): Promise<{ success: boolean; message: string }> => {
    if (!user || !token) {
      return { success: false, message: "Vui lòng đăng nhập" };
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update/${user.id}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = res.data.user;
      const newToken = res.data.token;

      if (!updatedUser) {
        throw new Error("Không nhận được dữ liệu người dùng");
      }

      // Cập nhật state và localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (newToken) {
        setToken(newToken);
        localStorage.setItem("token", newToken);
      } else {
        console.warn("No token received from server");
      }

      return { success: true, message: "Cập nhật thông tin thành công" };
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout();
        return { success: false, message: "Phiên đăng nhập hết hạn" };
      }
      return {
        success: false,
        message: error?.response?.data?.message || "Lỗi cập nhật thông tin",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 1,
    login,
    logout,
    signup,
    updateUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}