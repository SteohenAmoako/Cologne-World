import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, DollarSign, TrendingUp, Clock } from "lucide-react"

export async function AdminOverview() {
  const supabase = await createClient()

  // Get statistics
  const [ordersResult, productsResult, usersResult, recentOrdersResult] = await Promise.all([
    supabase.from("orders").select("total_amount, status, created_at"),
    supabase.from("perfumes").select("id, stock_quantity"),
    supabase.from("user_profiles").select("id"),
    supabase
      .from("orders")
      .select(`
        id,
        full_name,
        total_amount,
        status,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const orders = ordersResult.data || []
  const products = productsResult.data || []
  const users = usersResult.data || []
  const recentOrders = recentOrdersResult.data || []

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const lowStockProducts = products.filter((product) => product.stock_quantity < 10).length
  const totalProducts = products.length

  // Calculate this month's revenue
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthRevenue = orders
    .filter((order) => {
      const orderDate = new Date(order.created_at)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })
    .reduce((sum, order) => sum + order.total_amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your perfume shop admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GH₵{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GH₵{thisMonthRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Revenue this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">{pendingOrders} pending orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">{lowStockProducts} low stock items</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.full_name}</p>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">GH₵{order.total_amount.toFixed(2)}</p>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products
                .filter((product) => product.stock_quantity < 10)
                .slice(0, 5)
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Product #{product.id}</p>
                      <p className="text-xs text-gray-500">Stock running low</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {product.stock_quantity} left
                    </Badge>
                  </div>
                ))}
              {lowStockProducts === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">All products are well stocked!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
