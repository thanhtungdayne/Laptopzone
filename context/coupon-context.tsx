"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface Coupon {
  code: string
  type: "percentage" | "fixed"
  value: number
  description: string
  minOrder?: number
  maxDiscount?: number
}

interface CouponState {
  appliedCoupon: Coupon | null
  discount: number
  error: string | null
  isValidating: boolean
}

type CouponAction =
  | { type: "APPLY_COUPON"; payload: Coupon }
  | { type: "REMOVE_COUPON" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_VALIDATING"; payload: boolean }
  | { type: "CLEAR_ERROR" }

// Mock coupons for demo
const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    description: "10% off your first order",
    minOrder: 100,
  },
  {
    code: "SAVE50",
    type: "fixed",
    value: 50,
    description: "$50 off orders over $500",
    minOrder: 500,
  },
  {
    code: "LAPTOP20",
    type: "percentage",
    value: 20,
    description: "20% off laptops",
    minOrder: 200,
    maxDiscount: 300,
  },
]

const CouponContext = createContext<{
  state: CouponState
  dispatch: React.Dispatch<CouponAction>
  validateCoupon: (code: string, orderTotal: number) => Promise<void>
} | null>(null)

function couponReducer(state: CouponState, action: CouponAction): CouponState {
  switch (action.type) {
    case "APPLY_COUPON":
      return {
        ...state,
        appliedCoupon: action.payload,
        error: null,
        isValidating: false,
      }
    case "REMOVE_COUPON":
      return {
        ...state,
        appliedCoupon: null,
        discount: 0,
        error: null,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isValidating: false,
      }
    case "SET_VALIDATING":
      return {
        ...state,
        isValidating: action.payload,
        error: null,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export function CouponProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(couponReducer, {
    appliedCoupon: null,
    discount: 0,
    error: null,
    isValidating: false,
  })

  const validateCoupon = async (code: string, orderTotal: number) => {
    dispatch({ type: "SET_VALIDATING", payload: true })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const coupon = AVAILABLE_COUPONS.find((c) => c.code.toLowerCase() === code.toLowerCase())

    if (!coupon) {
      dispatch({ type: "SET_ERROR", payload: "Invalid coupon code" })
      return
    }

    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      dispatch({
        type: "SET_ERROR",
        payload: `Minimum order of $${coupon.minOrder} required for this coupon`,
      })
      return
    }

    dispatch({ type: "APPLY_COUPON", payload: coupon })
  }

  return <CouponContext.Provider value={{ state, dispatch, validateCoupon }}>{children}</CouponContext.Provider>
}

export function useCoupon() {
  const context = useContext(CouponContext)
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider")
  }
  return context
}

export function calculateDiscount(coupon: Coupon | null, subtotal: number): number {
  if (!coupon) return 0

  if (coupon.type === "percentage") {
    const discount = (subtotal * coupon.value) / 100
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
  }

  return coupon.value
}
