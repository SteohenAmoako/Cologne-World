import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        quantity,
        unit_price,
        total_price,
        perfumes (name, brands (name))
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <OrdersTable orders={orders || []} />
      </div>
    </AdminLayout>
  )
}
