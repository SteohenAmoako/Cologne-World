import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ShopHeader } from "@/components/shop/shop-header"
import { ProfileContent } from "@/components/profile/profile-content"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  // Get user orders
  const { data: orders } = await supabase
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
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <ShopHeader />
      <ProfileContent user={user} profile={profile} orders={orders || []} />
    </div>
  )
}
