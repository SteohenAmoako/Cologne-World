"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { CheckoutForm } from "./checkout-form"
import { CheckoutSummary } from "./checkout-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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

function maskKey(key: string) {
  if (!key) return "";
  const trimmed = key.trim();
  if (trimmed.length <= 10) return "**********";
  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}

export function CheckoutContent({ userProfile }: CheckoutContentProps) {
  const { cartItems, cartTotal, cartCount, loading } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // No need to load Paystack script here; CheckoutForm handles it

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 sm:w-1/3"></div>
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

  const createOrder = async (formData: any, status: "pending" | "completed") => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        payment_method: "paystack",
        status,
        items: cartItems.map((item) => ({
          perfume_id: item.perfume_id,
          quantity: item.quantity,
          price: item.perfumes.price,
        })),
      }),
    })
    
    const data = await response.json()
    if (!response.ok) {
      console.error("Order creation failed:", data)
      throw new Error(data?.error || "Order creation failed")
    }
    return data.order
  }

  const handlePaymentSuccess = async (response: any, formData: any) => {
    try {
      const order = await createOrder({ ...formData, paystack_ref: response?.reference }, "completed")
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed and payment confirmed.",
        variant: "default",
      })
      router.push(`/checkout/success?order=${order.id}`)
    } catch (err: any) {
      console.error("Order creation error:", err)
      toast({
        title: "Payment Successful, Order Issue",
        description: "Payment was successful but order creation failed. Please contact support with reference: " + (response?.reference || "unknown"),
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentError = async () => {
    try {
      // Create a pending order so the user can retry later
      const order = await createOrder({}, "pending")
      toast({
        title: "Payment Cancelled",
        description: "Your order has been saved as pending. You can complete payment later.",
        variant: "default",
      })
      router.push(`/checkout/success?order=${order.id}`)
    } catch (err: any) {
      console.error("Order creation error:", err)
      toast({
        title: "Order Creation Failed",
        description: "Unable to create your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
        <Link href="/cart" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
        <span className="text-gray-600 text-sm sm:text-base">({cartCount} items)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
        <CheckoutForm
          userProfile={userProfile}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          amount={Math.round(cartTotal * 100)} // Pesewas
          paystackPublicKey={(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "").trim()}
          isProcessing={isProcessing}
        />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  )
}
