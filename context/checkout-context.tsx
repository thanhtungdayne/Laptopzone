"use client";

import type React from "react";
import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import axios from "axios";

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface PaymentInfo {
  paymentMethod?: string;
}

export interface Order {
  id: string; // _id từ MongoDB
  orderCode?: string;
  items: Array<{
    VariantId: string;
    quantity: number;
    name?: string;
    price?: number;
    image?: string;
    attributes?: Array<{ name: string; value: string }>;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    phone: string;
  };
  paymentMethod: "cash" | "momo" | "zalopay";
  totalAmount: number;
  isPaid: boolean;
  status: string;
  createdAt: string;
}

interface CheckoutState {
  currentStep: number;
  shipping: Partial<ShippingInfo>;
  payment: Partial<PaymentInfo>;
  order: Order | null;
  isProcessing: boolean;
  error: string | null;
}

type CheckoutAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_SHIPPING"; payload: Partial<ShippingInfo> }
  | { type: "SET_PAYMENT"; payload: Partial<PaymentInfo> }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ORDER"; payload: Order }
  | { type: "RESET_CHECKOUT" };

interface CheckoutContextType {
  state: CheckoutState;
  dispatch: React.Dispatch<CheckoutAction>;
  placeOrder: (userId: string, items: any[], isPaid?: boolean) => Promise<Order | null>;
  setOrderFromFetch: (order: Order) => void;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_SHIPPING":
      return { ...state, shipping: { ...state.shipping, ...action.payload } };
    case "SET_PAYMENT":
      return { ...state, payment: { ...state.payment, ...action.payload } };
    case "SET_PROCESSING":
      return { ...state, isProcessing: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ORDER":
      return { ...state, order: action.payload, currentStep: 4 };
    case "RESET_CHECKOUT":
      return {
        currentStep: 1,
        shipping: {},
        payment: {},
        order: null,
        isProcessing: false,
        error: null,
      };
    default:
      return state;
  }
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, {
    currentStep: 1,
    shipping: {},
    payment: {},
    order: null,
    isProcessing: false,
    error: null,
  });
  const { items } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();
  // Theo dõi danh sách sản phẩm trước đó
  const prevItemsRef = useRef<any[]>([]);

  // Thiết lập bước và reset khi có sản phẩm mới
  useEffect(() => {
    if (isLoading) return; // Đợi xác thực hoàn tất

    console.log("Kiểm tra giỏ hàng:", { itemsLength: items.length, currentStep: state.currentStep, order: state.order });

    // Kiểm tra xem giỏ hàng có thay đổi không
    const prevItems = prevItemsRef.current;
    const itemsChanged = JSON.stringify(items) !== JSON.stringify(prevItems);

    if (!isAuthenticated || !user) {
      dispatch({ type: "SET_STEP", payload: 1 }); // Chuyển về giỏ hàng hoặc đăng nhập
    } else if (items.length > 0 && itemsChanged && state.currentStep === 4) {
      // Reset về bước 1 khi có sản phẩm mới và đang ở bước 4
      dispatch({ type: "RESET_CHECKOUT" });
    } else if (items.length === 0 && !state.order) {
      dispatch({ type: "SET_STEP", payload: 4 }); // Chuyển đến OrderConfirmation nếu giỏ rỗng và không có đơn hàng
    } else if (state.currentStep === 4 && !state.order) {
      dispatch({ type: "SET_STEP", payload: 1 }); // Chuyển về giỏ hàng nếu không có đơn hàng
    }

    // Cập nhật danh sách sản phẩm trước đó
    prevItemsRef.current = items;
  }, [items, isAuthenticated, isLoading, user, state.currentStep, state.order]);

  // Tự động điền thông tin giao hàng từ dữ liệu người dùng
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    const shippingData: Partial<ShippingInfo> = {
      fullName: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    };

    dispatch({ type: "SET_SHIPPING", payload: shippingData });
  }, [isLoading, isAuthenticated, user]);

  // Hàm để đặt lại đơn hàng từ dữ liệu fetch
  const setOrderFromFetch = (order: Order) => {
    dispatch({ type: "SET_ORDER", payload: order });
  };

  // Hàm xử lý đặt hàng
  const placeOrder = async (userId: string, items: any[], isPaid: boolean = false) => {
    try {
      dispatch({ type: "SET_PROCESSING", payload: true });

      if (!state.shipping.fullName || !state.shipping.address || !state.shipping.phone) {
        dispatch({ type: "SET_ERROR", payload: "Thông tin giao hàng không đầy đủ" });
        return null;
      }

      // Đặt isPaid thành true nếu phương thức thanh toán là zalopay
      const isOrderPaid = state.payment.paymentMethod === "zalopay" ? true : isPaid;
      console.log("isPaid nhận được:", isPaid);
      console.log("paymentMethod:", state.payment.paymentMethod);
      console.log("isOrderPaid:", isOrderPaid);

      const payload = {
        userId,
        items: items.map((item) => ({
          VariantId: item._id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          image: item.image,
          attributes: item.attributes,
        })),
        shippingAddress: {
          fullName: state.shipping.fullName,
          address: state.shipping.address,
          phone: state.shipping.phone,
        },
        paymentMethod: state.payment.paymentMethod || "cash",
        isPaid: isOrderPaid,
      };

      console.log("Gửi payload đến API:", payload);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/place`, payload);
      console.log("Phản hồi API:", response.data);

      const orderData: Order = {
        ...response.data.order,
        id: response.data.order._id || response.data.order.id,
        totalAmount: response.data.order.totalAmount || 0,
        isPaid: response.data.order.isPaid || isOrderPaid,
        createdAt: response.data.order.createdAt || new Date().toISOString(),
        status: response.data.order.status || "pending",
        items: response.data.order.items || [],
        shippingAddress: response.data.order.shippingAddress || {
          fullName: state.shipping.fullName,
          address: state.shipping.address,
          phone: state.shipping.phone,
        },
        paymentMethod: response.data.order.paymentMethod || "cash",
      };

      if (!orderData.id) {
        throw new Error("Dữ liệu đơn hàng thiếu trường id hoặc _id");
      }

      dispatch({ type: "SET_ORDER", payload: orderData });
      console.log("Đơn hàng đã được gửi:", orderData);

      return orderData;
    } catch (error: any) {
      console.error("Lỗi khi đặt hàng:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error?.response?.data?.message || "Lỗi đặt hàng",
      });
      return null;
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  };

  return (
    <CheckoutContext.Provider value={{ state, dispatch, placeOrder, setOrderFromFetch }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout phải được sử dụng trong CheckoutProvider");
  }
  return context;
}