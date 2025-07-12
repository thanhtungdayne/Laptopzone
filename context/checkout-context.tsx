"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  billingAddress: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  sameAsShipping: boolean
}

export interface Order {
  id: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }>
  shipping: ShippingInfo
  payment: Omit<PaymentInfo, "cardNumber" | "cvv"> & { cardLast4: string }
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered"
  createdAt: string
  estimatedDelivery: string
}

interface CheckoutState {
  currentStep: number
  shipping: Partial<ShippingInfo>
  payment: Partial<PaymentInfo>
  order: Order | null
  isProcessing: boolean
  error: string | null
}

type CheckoutAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_SHIPPING"; payload: Partial<ShippingInfo> }
  | { type: "SET_PAYMENT"; payload: Partial<PaymentInfo> }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ORDER"; payload: Order }
  | { type: "RESET_CHECKOUT" }

const CheckoutContext = createContext<{
  state: CheckoutState
  dispatch: React.Dispatch<CheckoutAction>
} | null>(null)

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload }
    case "SET_SHIPPING":
      return { ...state, shipping: { ...state.shipping, ...action.payload } }
    case "SET_PAYMENT":
      return { ...state, payment: { ...state.payment, ...action.payload } }
    case "SET_PROCESSING":
      return { ...state, isProcessing: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_ORDER":
      return { ...state, order: action.payload, currentStep: 4 }
    case "RESET_CHECKOUT":
      return {
        currentStep: 1,
        shipping: {},
        payment: {},
        order: null,
        isProcessing: false,
        error: null,
      }
    default:
      return state
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
  })

  return <CheckoutContext.Provider value={{ state, dispatch }}>{children}</CheckoutContext.Provider>
}

export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
}
