import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

interface SearchParams {
  search?: string
  brand?: string
  type?: string
  sort?: string
}

interface Perfume {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
  brands: { name: string }
  perfume_types: { name: string }
}

export async function ProductGrid({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()

  let query = supabase
    .from("perfumes")
    .select(`
      *,
      brands(name),
      perfume_types(name)
    `)
    .gt("stock_quantity", 0) // Only show in-stock items

  // Apply search filter
  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  // Apply brand filter
  if (searchParams.brand) {
    query = query.eq("brand_id", Number.parseInt(searchParams.brand))
  }

  // Apply type filter
  if (searchParams.type) {
    query = query.eq("perfume_type_id", Number.parseInt(searchParams.type))
  }

  // Apply sorting
  switch (searchParams.sort) {
    case "name_desc":
      query = query.order("name", { ascending: false })
      break
    case "price":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    default:
      query = query.order("name", { ascending: true })
  }

  const { data: perfumes, error } = await query

  if (error) {
    console.error("Error fetching perfumes:", error)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Error loading products. Please try again.</p>
      </div>
    )
  }

  if (!perfumes || perfumes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No perfumes found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {searchParams.search ? `Search results for "${searchParams.search}"` : "All Perfumes"}
        </h2>
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <p className="text-sm sm:text-base text-gray-600">
            {perfumes.length} product{perfumes.length !== 1 ? "s" : ""}
          </p>
          <Button variant="outline" size="sm" className="sm:hidden" id="open-filters">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {perfumes.map((perfume) => (
          <ProductCard key={perfume.id} perfume={perfume as Perfume} />
        ))}
      </div>
    </div>
  )
}
