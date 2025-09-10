"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { CheckoutForm } from "./checkout-form"
import { CheckoutSummary } from "./checkout-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  full_name?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

interface CheckoutContentProps {
  userProfile: UserProfile | null
}

export function CheckoutContent({ userProfile }: CheckoutContentProps) {
  const { cartItems, cartTotal, cartCount, loading } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out</p>
            <Link href="/shop">
              <Button className="bg-rose-600 hover:bg-rose-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleOrderSubmit = async (formData: any) => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: cartItems.map((item) => ({
            perfume_id: item.perfume_id,
            quantity: item.quantity,
            price: item.perfumes.price,
          })),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/checkout/success?order=${data.order.id}`)
      } else {
        throw new Error(data.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Failed to process order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <span className="text-gray-600">({cartCount} items)</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm userProfile={userProfile} onSubmit={handleOrderSubmit} isProcessing={isProcessing} />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  )
}
