import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminAnalyticsPage() {
	const supabase = await createClient()

	const { data: orders } = await supabase
		.from("orders")
		.select("id, total_amount, status, created_at")
		.order("created_at", { ascending: false })

	const { data: topProducts } = await supabase
		.from("order_items")
		.select("quantity, perfumes(name)")

	const totalRevenue = (orders || [])
		.filter((o: any) => o.status === "completed")
		.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0)

	const totalOrders = (orders || []).length
	const completedOrders = (orders || []).filter((o: any) => o.status === "completed").length

	const productSales: Record<string, number> = {}
	;(topProducts || []).forEach((row: any) => {
		const name = row.perfumes?.name || "Unknown"
		productSales[name] = (productSales[name] || 0) + Number(row.quantity || 0)
	})
	const top5 = Object.entries(productSales)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
					<p className="text-gray-600">Key performance indicators for your store</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Total Revenue</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">GH₵{totalRevenue.toLocaleString()}</p>
							<p className="text-sm text-gray-600">Completed orders</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Total Orders</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">{totalOrders}</p>
							<p className="text-sm text-gray-600">All statuses</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Completed Orders</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">{completedOrders}</p>
							<p className="text-sm text-gray-600">Paid and fulfilled</p>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Top Products</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{top5.map(([name, qty]) => (
								<div key={name} className="border rounded-lg p-4">
									<p className="font-medium text-gray-900">{name}</p>
									<p className="text-sm text-gray-600">{qty} sold</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</AdminLayout>
	)
}


