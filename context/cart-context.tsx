"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
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
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
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
    if (!user?._id || !isAuthenticated) {
      setItems([]);
      setTotal(0);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${user._id}`
      );
      const data = res.data;

      if (!data) {
        console.warn("⚠️ Không có dữ liệu giỏ hàng trả về");
        setItems([]);
        setTotal(0);
        return;
      }

      // Chuẩn hóa dữ liệu từ server
      const cartItems = (data.items || data.result?.items || []).map(
        (item: any) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          productName: item.productName,
          productImage: item.productImage,
          attributes: item.attributes || [],
        })
      );

      setItems(cartItems);
      setTotal(data.cartTotal || data.result?.cartTotal || 0);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setItems([]);
      setTotal(0);
    }
  };

  // Gọi fetchCart khi user thay đổi
  useEffect(() => {
    fetchCart();
  }, [user, isAuthenticated]);

  // Thêm sản phẩm vào giỏ
  const addItem = async (item: CartItem) => {
    if (!user?._id || !isAuthenticated) return;

    try {
      // Cập nhật UI ngay lập tức (optimistic update)
      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (i) => i.variantId === item.variantId
        );
        if (existingItem) {
          return prevItems.map((i) =>
            i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        }
        return [...prevItems, item];
      });
      setTotal((prevTotal) => prevTotal + item.price * item.quantity);

      // Gọi API để thêm sản phẩm
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
        {
          userId: user._id,
          variantId: item.variantId,
          quantity: item.quantity,
        }
      );

      // Đồng bộ lại với server
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      // Hoàn nguyên trạng thái nếu API thất bại
      await fetchCart();
    }
  };

  // Cập nhật số lượng
  const updateQuantity = async (variantId: string, quantity: number) => {
    if (!user?._id || !isAuthenticated) return;

    try {
      // Cập nhật UI ngay lập tức
      setItems((prevItems) => {
        const item = prevItems.find((i) => i.variantId === variantId);
        if (!item) return prevItems;

        const quantityDiff = quantity - item.quantity;
        setTotal((prevTotal) => prevTotal + quantityDiff * item.price);

        return prevItems.map((i) =>
          i.variantId === variantId ? { ...i, quantity } : i
        );
      });

      // Gọi API để cập nhật số lượng
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
        userId: user._id,
        variantId,
        quantity: Number(quantity),
      });

      // Đồng bộ lại với server
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      // Hoàn nguyên trạng thái nếu API thất bại
      await fetchCart();
    }
  };

  // Xóa 1 sản phẩm
  const removeItem = async (variantId: string) => {
    if (!user?._id || !isAuthenticated) return;

    try {
      // Cập nhật UI ngay lập tức
      setItems((prevItems) => {
        const item = prevItems.find((i) => i.variantId === variantId);
        if (item) {
          setTotal((prevTotal) => prevTotal - item.price * item.quantity);
        }
        return prevItems.filter((i) => i.variantId !== variantId);
      });

      // Gọi API để xóa sản phẩm
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove`, {
        data: {
          userId: user._id,
          variantId,
        },
      });

      // Đồng bộ lại với server
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      // Hoàn nguyên trạng thái nếu API thất bại
      await fetchCart();
    }
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    if (!user?._id || !isAuthenticated) return;

    try {
      // Cập nhật UI ngay lập tức
      setItems([]);
      setTotal(0);

      // Gọi API để xóa giỏ hàng
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/clear/${user._id}`
      );

      // Đồng bộ lại với server
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
      // Hoàn nguyên trạng thái nếu API thất bại
      await fetchCart();
    }
  };
  //tải lại giỏ hàng
  const refreshCart = async () => {
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
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
