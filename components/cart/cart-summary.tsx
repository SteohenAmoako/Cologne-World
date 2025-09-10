"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Truck, Shield } from "lucide-react"
import Link from "next/link"

export function CartSummary() {
  const { cartItems, cartTotal, cartCount } = useCart()

  const subtotal = cartTotal
  const shipping = cartTotal >= 75 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({cartCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
              {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <Link href="/checkout" className="block">
          <Button className="w-full bg-rose-600 hover:bg-rose-700 text-lg py-6">Proceed to Checkout</Button>
        </Link>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-green-600" />
            <span>{shipping === 0 ? "Free shipping included!" : `Free shipping on orders over $75`}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span>Secure checkout guaranteed</span>
          </div>
        </div>

        <Separator />

        <Link href="/shop">
          <Button variant="outline" className="w-full bg-transparent">
            Continue Shopping
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
