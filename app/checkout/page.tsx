import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ShopHeader } from "@/components/shop/shop-header"
import { CheckoutContent } from "@/components/checkout/checkout-content"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile for pre-filling forms
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <ShopHeader />
      <CheckoutContent userProfile={profile} />
    </div>
  )
}
