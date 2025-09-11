"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface OrderHistoryProps {
  orders: any[]
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set())

  const toggleOrderExpansion = (orderId: number) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Start shopping to see your order history here</p>
          <Link href="/shop">
            <Button className="bg-rose-600 hover:bg-rose-700">Start Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order History ({orders.length} orders)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrders.has(order.id)
          const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })

          return (
            <Card key={order.id} className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">{orderDate}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        order.status === "completed" || order.status === "delivered"
                          ? "default"
                          : order.status === "pending"
                            ? "secondary"
                            : order.status === "cancelled"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <span className="font-bold text-lg">GH₵{order.total_amount.toFixed(2)}</span>
                    <Button variant="ghost" size="sm" onClick={() => toggleOrderExpansion(order.id)}>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>{order.order_items.length} items</span>
                  <span>•</span>
                  <span>
                    Shipped to {order.shipping_city}, {order.shipping_state}
                  </span>
                </div>

                {/* Order Items Preview */}
                <div className="flex gap-2 mb-4">
                  {order.order_items.slice(0, 3).map((item: any, index: number) => (
                    <div key={index} className="relative w-12 h-16 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={item.perfumes.image_url || "/placeholder.svg"}
                        alt={item.perfumes.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {order.order_items.length > 3 && (
                    <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-600">
                      +{order.order_items.length - 3}
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <h4 className="font-semibold">Order Items</h4>
                      {order.order_items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded">
                            <Image
                              src={item.perfumes.image_url || "/placeholder.svg"}
                              alt={item.perfumes.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Badge variant="secondary" className="text-xs mb-1">
                              {item.perfumes.brands.name}
                            </Badge>
                            <p className="font-medium text-sm">{item.perfumes.name}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                              <span className="font-semibold">GH₵{(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Separator />

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Shipping Address</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{order.full_name}</p>
                            <p>{order.shipping_address}</p>
                            <p>
                              {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Order Summary</h4>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>GH₵{order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>{order.shipping_cost === 0 ? "FREE" : `GH₵${order.shipping_cost.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax</span>
                              <span>GH₵{order.tax_amount.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold">
                              <span>Total</span>
                              <span>GH₵{order.total_amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )
}
