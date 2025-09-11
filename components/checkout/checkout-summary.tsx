"use client"

import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function CheckoutSummary() {
  const { cartItems, cartTotal, cartCount } = useCart()

  const subtotal = cartTotal
  const shipping = cartTotal >= 75 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary ({cartCount} items)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded">
                <Image
                  src={item.perfumes.image_url || "/placeholder.svg"}
                  alt={item.perfumes.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="text-xs mb-1">
                      {item.perfumes.brands.name}
                    </Badge>
                    <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.perfumes.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">GH₵{(item.quantity * item.perfumes.price).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>GH₵{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
              {shipping === 0 ? "FREE" : `GH₵${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>GH₵{tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>GH₵{total.toFixed(2)}</span>
        </div>

        {shipping === 0 && <div className="text-sm text-green-600 font-medium">🎉 You saved GH₵9.99 on shipping!</div>}
      </CardContent>
    </Card>
  )
}
