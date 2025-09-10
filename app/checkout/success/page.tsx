import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrderSuccess } from "@/components/checkout/order-success"
import { ShopHeader } from "@/components/shop/shop-header"

interface SuccessPageProps {
  searchParams: {
    order?: string
  }
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!searchParams.order) {
    redirect("/shop")
  }

  // Get order details
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        perfumes (
          name,
          image_url,
          brands (name)
        )
      )
    `)
    .eq("id", searchParams.order)
    .eq("user_id", user.id)
    .single()

  if (error || !order) {
    redirect("/shop")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <ShopHeader />
      <OrderSuccess order={order} />
    </div>
  )
}
