"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Laptop } from "@/types/product"

interface WishlistState {
  items: Laptop[]
}

type WishlistAction = { type: "ADD_ITEM"; payload: Laptop } | { type: "REMOVE_ITEM"; payload: number }

const WishlistContext = createContext<{
  state: WishlistState
  dispatch: React.Dispatch<WishlistAction>
} | null>(null)

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find((item) => item.id === action.payload.id)
      if (exists) return state

      return {
        items: [...state.items, action.payload],
      }
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((item) => item.id !== action.payload),
      }
    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] })

  return <WishlistContext.Provider value={{ state, dispatch }}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
