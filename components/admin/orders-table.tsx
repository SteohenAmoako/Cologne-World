"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface OrdersTableProps {
  orders: any[]
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders || [])

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error("Failed to update order")

      const updated = await res.json()
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
    } catch (err) {
      console.error("❌ Error updating order:", err)
    }
  }

  return (
    <Card className="shadow-md">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Items</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const itemNames = (order.order_items || [])
                  .map((it: any) => it.perfumes?.name)
                  .filter(Boolean)
                return (
                <tr key={order.id} className="border-b">
                  <td className="p-2">{order.id}</td>
                  <td className="p-2">{order.customer_name}</td>
                    <td className="p-2">{itemNames.length ? itemNames.join(", ") : `${order.order_items?.length || 0} items`}</td>
                    <td className="p-2">GH₵{Number(order.total_amount || 0).toFixed(2)}</td>
                  <td className="p-2">{order.status}</td>
                  <td className="p-2">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, "completed")}
                    >
                      Mark Completed
                    </Button>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
