"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { debounce } from "lodash";

interface CartItem {
  variantId: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string;
  attributes: { name: string; value: string }[];
}

interface CartContextType {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const userId = useMemo(() => user?.id, [user]);

  const fetchCart = useCallback(async () => {
    console.log("fetchCart - Bắt đầu:", { isAuthenticated, userId });
    if (!isAuthenticated || !userId) {
      console.log("fetchCart - Chưa đăng nhập, đặt giỏ hàng rỗng");
      setItems([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("fetchCart - Không tìm thấy token");
        throw new Error("Không tìm thấy token");
      }

      console.log("fetchCart - Gửi yêu cầu API:", { url: `${API_URL}/cart/${userId}` });
      const res = await axios.get(`${API_URL}/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("fetchCart - Phản hồi API:", res.data, res.status);
      const data = res.data;

      if (!data.result || !Array.isArray(data.result.items)) {
        throw new Error(data?.message || "Dữ liệu giỏ hàng không hợp lệ");
      }

      const cartItems = data.result.items.map((item: any) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        productName: item.productName,
        productImage: item.productImage,
        attributes: item.attributes || [],
      }));

      setItems(cartItems);
      setTotal(data.result.cartTotal || 0);
    } catch (error: any) {
      console.error("fetchCart - Lỗi:", error.response?.status, error.response?.data || error.message);
      setItems([]);
      setTotal(0);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải giỏ hàng",
        variant: "destructive",
      });
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast({
          title: "Phiên hết hạn",
          description: "Vui lòng đăng nhập lại.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, isAuthenticated, toast]);

  useEffect(() => {
    console.log("useEffect - Kiểm tra fetchCart:", { isAuthenticated, userId });
    if (isAuthenticated && userId) {
      fetchCart();
    } else {
      setItems([]);
      setTotal(0);
    }
  }, [userId, isAuthenticated, fetchCart]);

  const addItem = useCallback(
    async (item: CartItem) => {
      console.log("addItem - Bắt đầu:", { isAuthenticated, userId });
      if (!isAuthenticated || !userId) {
        console.log("addItem - Chưa đăng nhập, thoát sớm:", { isAuthenticated, userId });
        toast({
          title: "Hãy đăng nhập",
          description: "Hãy đăng nhập để mua hàng.",
          variant: "destructive",
        });
        return;
      }

      if (isLoading) {
        console.log("addItem - Đang xử lý, thoát sớm");
        return;
      }

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("addItem - Không tìm thấy token");
          throw new Error("Không tìm thấy token");
        }

        const payload = {
          userId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          productName: item.productName,
          productImage: item.productImage,
          attributes: item.attributes,
        };

        console.log("addItem - Gửi yêu cầu API:", { url: `${API_URL}/cart/add`, payload });
        const res = await axios.post(`${API_URL}/cart/add`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("addItem - Phản hồi API:", res.data, res.status);

        if (res.status !== 200 && res.status !== 201) {
          throw new Error(res.data?.message || "Không thể thêm sản phẩm vào giỏ hàng");
        }

        await fetchCart();
        console.log("addItem - Hiển thị thông báo thành công");
        toast({
          title: "Thành công",
          description: "Sản phẩm đã được thêm vào giỏ hàng!",
        });
      } catch (error: any) {
        console.error("addItem - Lỗi:", error.response?.status, error.response?.data || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          toast({
            title: "Phiên hết hạn",
            description: "Vui lòng đăng nhập lại.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Lỗi",
            description: error.response?.data?.message || error.message || "Không thể thêm sản phẩm",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [userId, isAuthenticated, fetchCart, toast, isLoading]
  );

  const updateQuantity = useCallback(
    async (variantId: string, quantity: number) => {
      console.log("updateQuantity - Bắt đầu:", { variantId, quantity, isAuthenticated, userId });
      if (!isAuthenticated || !userId) {
        console.log("updateQuantity - Chưa đăng nhập, thoát sớm");
        toast({
          title: "Hãy đăng nhập",
          description: "Hãy đăng nhập để mua hàng.",
          variant: "destructive",
        });
        return;
      }

      if (isLoading) {
        console.log("updateQuantity - Đang xử lý, thoát sớm");
        return;
      }

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("updateQuantity - Không tìm thấy token");
          throw new Error("Không tìm thấy token");
        }

        const payload = { userId, variantId, quantity: Number(quantity) };
        console.log("updateQuantity - Gửi yêu cầu API:", { url: `${API_URL}/cart/update`, payload });
        const res = await axios.put(`${API_URL}/cart/update`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("updateQuantity - Phản hồi API:", res.data, res.status);

        if (res.status !== 200) {
          throw new Error(res.data?.message || "Không thể cập nhật số lượng");
        }

        await fetchCart();
        console.log("updateQuantity - Cập nhật thành công");
      } catch (error: any) {
        console.error("updateQuantity - Lỗi:", error.response?.status, error.response?.data || error.message);
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || error.message || "Không thể cập nhật số lượng",
          variant: "destructive",
        });
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          toast({
            title: "Phiên hết hạn",
            description: "Vui lòng đăng nhập lại.",
            variant: "destructive",
          });
        }
        await fetchCart();
      } finally {
        setIsLoading(false);
      }
    },
    [userId, isAuthenticated, fetchCart, toast, isLoading]
  );

  const debouncedUpdateQuantity = useCallback(debounce(updateQuantity, 300), [updateQuantity]);

  const removeItem = useCallback(
    async (variantId: string) => {
      console.log("removeItem - Bắt đầu:", { variantId, isAuthenticated, userId });
      if (!isAuthenticated || !userId) {
        console.log("removeItem - Chưa đăng nhập, thoát sớm");
        toast({
          title: "Hãy đăng nhập",
          description: "Hãy đăng nhập để mua hàng.",
          variant: "destructive",
        });
        return;
      }

      if (isLoading) {
        console.log("removeItem - Đang xử lý, thoát sớm");
        return;
      }

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("removeItem - Không tìm thấy token");
          throw new Error("Không tìm thấy token");
        }

        const payload = { userId, variantId };
        console.log("removeItem - Gửi yêu cầu API:", { url: `${API_URL}/cart/remove`, payload });
        const res = await axios.delete(`${API_URL}/cart/remove`, {
          headers: { Authorization: `Bearer ${token}` },
          data: payload,
        });

        console.log("removeItem - Phản hồi API:", res.data, res.status);

        if (res.status !== 200 && res.status !== 204) {
          throw new Error(res.data?.message || "Không thể xóa sản phẩm");
        }

        await fetchCart();
        console.log("removeItem - Hiển thị thông báo thành công");
        toast({
          title: "Thành công",
          description: "Sản phẩm đã được xóa khỏi giỏ hàng!",
        });
      } catch (error: any) {
        console.error("removeItem - Lỗi:", error.response?.status, error.response?.data || error.message);
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || error.message || "Không thể xóa sản phẩm",
          variant: "destructive",
        });
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          toast({
            title: "Phiên hết hạn",
            description: "Vui lòng đăng nhập lại.",
            variant: "destructive",
          });
        }
        await fetchCart();
      } finally {
        setIsLoading(false);
      }
    },
    [userId, isAuthenticated, fetchCart, toast, isLoading]
  );

  const clearCart = useCallback(
    async () => {
      console.log("clearCart - Bắt đầu:", { isAuthenticated, userId });
      if (!isAuthenticated || !userId) {
        console.log("clearCart - Chưa đăng nhập, thoát sớm");
        toast({
          title: "Hãy đăng nhập",
          description: "Hãy đăng nhập để mua hàng.",
          variant: "destructive",
        });
        return;
      }

      if (isLoading) {
        console.log("clearCart - Đang xử lý, thoát sớm");
        return;
      }

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("clearCart - Không tìm thấy token");
          throw new Error("Không tìm thấy token");
        }

        console.log("clearCart - Gửi yêu cầu API:", { url: `${API_URL}/cart/clear/${userId}` });
        const res = await axios.delete(`${API_URL}/cart/clear/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("clearCart - Phản hồi API:", res.data, res.status);

        if (res.status !== 200 && res.status !== 204) {
          throw new Error(res.data?.message || "Không thể xóa giỏ hàng");
        }

        await fetchCart();
        console.log("clearCart - Hiển thị thông báo thành công");
        toast({
          title: "Thành công",
          description: "Giỏ hàng đã được xóa!",
        });
      } catch (error: any) {
        console.error("clearCart - Lỗi:", error.response?.status, error.response?.data || error.message);
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || error.message || "Không thể xóa giỏ hàng",
          variant: "destructive",
        });
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          toast({
            title: "Phiên hết hạn",
            description: "Vui lòng đăng nhập lại.",
            variant: "destructive",
          });
        }
        await fetchCart();
      } finally {
        setIsLoading(false);
      }
    },
    [userId, isAuthenticated, fetchCart, toast, isLoading]
  );

  const value = useMemo(
    () => ({
      items,
      total,
      isLoading,
      addItem,
      updateQuantity: debouncedUpdateQuantity,
      removeItem,
      clearCart,
      fetchCart,
    }),
    [items, total, isLoading, addItem, debouncedUpdateQuantity, removeItem, clearCart, fetchCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}