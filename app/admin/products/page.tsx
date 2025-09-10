import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ProductsTable } from "@/components/admin/products-table"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const [productsResult, brandsResult, typesResult] = await Promise.all([
    supabase
      .from("perfumes")
      .select(`
        *,
        brands (name),
        perfume_types (name)
      `)
      .order("name"),
    supabase.from("brands").select("*").order("name"),
    supabase.from("perfume_types").select("*").order("name"),
  ])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600">Manage your perfume inventory</p>
        </div>
        <ProductsTable
          products={productsResult.data || []}
          brands={brandsResult.data || []}
          perfumeTypes={typesResult.data || []}
        />
      </div>
    </AdminLayout>
  )
}
