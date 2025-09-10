"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface CartItem {
  id: number
  quantity: number
  perfume_id: number
  perfumes: {
    id: number
    name: string
    price: number
    image_url: string
    stock_quantity: number
    brands: { name: string }
  }
}

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  loading: boolean
  addToCart: (perfumeId: number, quantity?: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.perfumes.price, 0)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await refreshCart()
      } else {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const refreshCart = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/cart")
      const data = await response.json()

      if (response.ok) {
        setCartItems(data.cartItems || [])
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (perfumeId: number, quantity = 1) => {
    if (!user) return

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ perfume_id: perfumeId, quantity }),
      })

      if (response.ok) {
        await refreshCart()
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      if (response.ok) {
        await refreshCart()
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const removeFromCart = async (itemId: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await refreshCart()
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
