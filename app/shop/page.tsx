import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/shop/product-grid"
import { ShopHeader } from "@/components/shop/shop-header"
import { ShopFilters } from "@/components/shop/shop-filters"
import { MobileFilters } from "@/components/shop/mobile-filters"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchParams {
  search?: string
  brand?: string
  type?: string
  sort?: string
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()

  // Get brands and perfume types for filters
  const [brandsResult, typesResult] = await Promise.all([
    supabase.from("brands").select("*").order("name"),
    supabase.from("perfume_types").select("*").order("name"),
  ])

  const brands = brandsResult.data || []
  const perfumeTypes = typesResult.data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <ShopHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filters Button & Drawer */}
        <div className="lg:hidden mb-4">
          <MobileFilters brands={brands} perfumeTypes={perfumeTypes} currentFilters={searchParams} />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <ShopFilters brands={brands} perfumeTypes={perfumeTypes} currentFilters={searchParams} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}
