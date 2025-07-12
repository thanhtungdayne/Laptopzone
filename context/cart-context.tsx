"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth-context";

// Cấu trúc item trong giỏ hàng từ backend
interface CartItem {
  variantId: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string;
  attributes: { name: string; value: string }[];
}

// Kiểu dữ liệu cho context
interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (variantIdId: string, quantity: number) => Promise<void>;
  removeItem: (variantIdId: string) => Promise<void>;
  updateQuantity: (variantIdId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// Context mặc định là null
const CartContext = createContext<CartContextType | null>(null);

// Provider để bao bọc toàn ứng dụng
export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  // Hàm fetch giỏ hàng từ backend
 const fetchCart = async () => {
  if (!user?._id) return;
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart/${user._id}`);
    console.log("📦 Dữ liệu giỏ hàng trả về:", res.data);

    let rawItems: any[] = [];

    if (res.data && res.data.items) {
      rawItems = res.data.items;
      setTotal(res.data.cartTotal || 0);
    } else if (res.data.result && res.data.result.items) {
      rawItems = res.data.result.items;
      setTotal(res.data.result.cartTotal || 0);
    } else {
      console.warn("⚠️ Dữ liệu giỏ hàng không đúng định dạng:", res.data);
      return;
    }

    console.log("🧪 Mapped cart items:", rawItems); // Thêm dòng này
    setItems(rawItems);
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
  }
};



  // Gọi lại khi user thay đổi
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchCart();
    } else {
      setItems([]);
      setTotal(0);
    }
  }, [user, isAuthenticated]);

  // Thêm sản phẩm vào giỏ
  const addItem = async (variantId: string, quantity: number) => {

    if (!user?.id) return;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        userId: user.id,
        variantId,
        quantity,
      });
      await fetchCart(); // cập nhật lại giỏ sau khi thêm
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  // Cập nhật số lượng
  const updateQuantity = async (variantId: string, quantity: number) => {
    if (!user?._id) return;
    console.log("Gửi updateQuantity với:", { userId: user?._id, variantId, quantity });
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
        userId: user._id,
        variantId,
        quantity: Number(quantity),
      });
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  // Xóa 1 sản phẩm
 const removeItem = async (variantId: string) => {
  if (!user?._id) return;
  try {
    console.log("🗑️ Xóa variantId:", variantId);
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove`, {
      data: {
        userId: user._id,   // ✅ đúng field
        variantId: variantId, // ✅ đúng tên field
      },
    });
    await fetchCart();
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
  }
};


  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    if (!user?._id) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear/${user._id}`);
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ items, total, addItem, updateQuantity, removeItem, clearCart, refreshCart: fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook dùng trong component
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
