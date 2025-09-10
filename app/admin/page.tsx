import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminOverview } from "@/components/admin/admin-overview"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin (you can implement proper role checking)
  // For now, we'll allow any authenticated user to access admin
  // In production, you'd check user roles from the database

  return (
    <AdminLayout>
      <AdminOverview />
    </AdminLayout>
  )
}
