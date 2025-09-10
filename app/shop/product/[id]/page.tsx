import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductDetails } from "@/components/shop/product-details"
import { ShopHeader } from "@/components/shop/shop-header"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()

  const { data: perfume, error } = await supabase
    .from("perfumes")
    .select(`
      *,
      brands(name, description),
      perfume_types(name, description)
    `)
    .eq("id", params.id)
    .single()

  if (error || !perfume) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <ShopHeader />
      <ProductDetails perfume={perfume} />
    </div>
  )
}
