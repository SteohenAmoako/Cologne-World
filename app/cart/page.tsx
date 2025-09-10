import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ShopHeader } from "@/components/shop/shop-header"
import { CartContent } from "@/components/cart/cart-content"

export default async function CartPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <ShopHeader />
      <CartContent />
    </div>
  )
}
