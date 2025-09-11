"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderSuccessProps {
  order: {
    id: number
    customer_email: string
    customer_name: string
    total_amount: number
    status: string
    created_at: string
    shipping_address: string
    shipping_city: string
    shipping_postal_code: string
    order_items: Array<{
      quantity: number
      unit_price: number
      total_price: number
      perfumes: {
        name: string
        image_url: string
        brands: { name: string }
      }
    }>
  }
}

export function OrderSuccess({ order }: OrderSuccessProps) {
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Calculate totals from order items
  const subtotal = order.order_items?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0
  const shippingCost = subtotal >= 75 ? 0 : 9.99
  const taxAmount = subtotal * 0.08
  const calculatedTotal = subtotal + shippingCost + taxAmount

  // Use calculated values or fallback to stored total_amount
  const finalSubtotal = subtotal || 0
  const finalShippingCost = shippingCost
  const finalTaxAmount = taxAmount
  const finalTotal = order.total_amount || calculatedTotal

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <Card className="mb-8 text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase, {order.customer_name}. Your order has been received and is being processed.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span>Order #{order.id}</span>
              <span>•</span>
              <span>{orderDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <span className="text-sm text-gray-600">We'll send you tracking information once your order ships.</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.order_items?.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={item.perfumes?.image_url || "/placeholder.svg"}
                      alt={item.perfumes?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="text-xs mb-1">
                      {item.perfumes?.brands?.name || "Brand"}
                    </Badge>
                    <p className="font-medium text-sm text-gray-900 mb-1">{item.perfumes?.name || "Product"}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Qty: {item.quantity || 0}</span>
                      <span className="font-semibold">${(item.total_price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )) || []}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${finalSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{finalShippingCost === 0 ? "FREE" : `$${finalShippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${finalTaxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.customer_name}</p>
                  <p>{order.shipping_address}</p>
                  <p>
                    {order.shipping_city}, {order.shipping_postal_code}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Order Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">We'll send order updates and tracking information to:</p>
                <p className="font-medium text-sm mt-1">{order.customer_email}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/profile">
            <Button className="bg-rose-600 hover:bg-rose-700">View Order History</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
