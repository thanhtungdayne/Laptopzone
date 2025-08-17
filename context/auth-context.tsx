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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        if (savedToken && savedToken !== "undefined") {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });

          const userData = response.data.data;
          if (!userData) {
            throw new Error("Không nhận được dữ liệu người dùng");
          }

          setUser({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
            phone: userData.phone,
            dob: userData.dob,
            address: userData.address,
            status: userData.status,
            role: userData.role,
          });
          setToken(savedToken);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Lỗi xác thực token:", error);
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
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
      const userData = res.data.user;
      const newToken = res.data.token;

      if (!userData || !newToken) {
        throw new Error("Không nhận được dữ liệu người dùng hoặc token");
      }

      setUser({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        phone: userData.phone,
        dob: userData.dob,
        address: userData.address,
        status: userData.status,
        role: userData.role,
      });
      setToken(newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", newToken);

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
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        { name, email, password, repassword, role },
        { validateStatus: status => status >= 200 && status < 300 }
      );
      console.log("Phản hồi từ backend:", res.data, "Mã trạng thái:", res.status);

      const userData = res.data.newUser;
      if (!userData) {
        throw new Error("Không nhận được dữ liệu người dùng từ backend");
      }

      const newUser = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar || undefined,
        phone: userData.phone || undefined,
        dob: userData.dob || undefined,
        address: userData.address || undefined,
        status: userData.status ?? true,
        role: userData.role || 0,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(userData));

      // Backend không trả về token, nên bỏ qua lưu token
      console.warn("Không nhận được token từ backend, tiếp tục với dữ liệu người dùng");

      return { success: true, message: "Đăng ký thành công" };
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      return {
        success: false,
        message: error?.response?.data?.message || `Lỗi đăng ký: ${error.message || "Không thể xử lý yêu cầu"}`,
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
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update/${user.id}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = res.data.data;
      if (!updatedUser) {
        throw new Error("Không nhận được dữ liệu người dùng");
      }

      setUser({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        dob: updatedUser.dob,
        address: updatedUser.address,
        status: updatedUser.status,
        role: updatedUser.role,
      });
      localStorage.setItem("user", JSON.stringify(updatedUser));

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