// context/checkout-context.tsx
"use client";

import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";
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
  paymentMethod: "cash" | "momo";
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

// ✅ Interface cho Context
interface CheckoutContextType {
  state: CheckoutState;
  dispatch: React.Dispatch<CheckoutAction>;
  placeOrder: (userId: string, items: any[]) => Promise<Order | null>;
  setOrderFromFetch: (order: Order) => void;
}

// ✅ Tạo context với kiểu đầy đủ
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

  // ✅ Hàm để đặt lại order từ dữ liệu fetch
  const setOrderFromFetch = (order: Order) => {
    dispatch({ type: "SET_ORDER", payload: order });
  };

  // ✅ Hàm xử lý đặt hàng
  const placeOrder = async (userId: string, items: any[]) => {
    try {
      dispatch({ type: "SET_PROCESSING", payload: true });

      if (!state.shipping.fullName || !state.shipping.address || !state.shipping.phone) {
        dispatch({ type: "SET_ERROR", payload: "Thông tin giao hàng không đầy đủ" });
        return null;
      }

      const payload = {
        userId,
        items,
        shippingAddress: {
          fullName: state.shipping.fullName,
          address: state.shipping.address,
          phone: state.shipping.phone,
        },
        paymentMethod: state.payment.paymentMethod || "cash",
      };

      console.log("Sending payload to API:", payload);
      const response = await axios.post("http://localhost:5000/order/place", payload);
      console.log("API response:", response.data);

      const orderData: Order = {
        ...response.data.order,
        id: response.data.order._id || response.data.order.id,
        totalAmount: response.data.order.totalAmount || 0,
        isPaid: response.data.order.isPaid || false,
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
      console.log("Order dispatched:", orderData);
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
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
