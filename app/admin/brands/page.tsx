import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminBrandsPage() {
	const supabase = await createClient()

	const { data: brands, error: brandsError } = await supabase
		.from("brands")
		.select("id, name, description, logo_url, created_at")
		.order("name")

	const { data: perfumes, error: perfumesError } = await supabase
		.from("perfumes")
		.select("id, brand_id")

	const brandIdToCount: Record<string, number> = {}
	;(perfumes || []).forEach((p: any) => {
		brandIdToCount[p.brand_id] = (brandIdToCount[p.brand_id] || 0) + 1
	})

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Brands</h1>
					<p className="text-gray-600">Manage brands and view product counts</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>All Brands ({brands?.length || 0})</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
							{(brands || []).map((b: any) => (
								<div key={b.id} className="border rounded-lg p-4 bg-white flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{b.name}</h3>
										<Badge variant="secondary">{brandIdToCount[b.id] || 0} products</Badge>
									</div>
									<p className="text-sm text-gray-600 line-clamp-3">{b.description || "No description"}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</AdminLayout>
	)
}


