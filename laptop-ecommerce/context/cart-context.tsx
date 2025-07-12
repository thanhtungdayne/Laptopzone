"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { CartItem, Laptop } from "@/types/product"

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Laptop }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.laptop.id === action.payload.id)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.laptop.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.laptop.price * item.quantity, 0),
        }
      }

      const newItems = [...state.items, { laptop: action.payload, quantity: 1 }]
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.laptop.price * item.quantity, 0),
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.laptop.id !== action.payload)
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.laptop.price * item.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) => (item.laptop.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0)

      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.laptop.price * item.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return { items: [], total: 0 }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
