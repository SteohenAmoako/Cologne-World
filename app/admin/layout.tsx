import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect("/auth/login")
	}

	const { data: userRow } = await supabase
		.from("users")
		.select("is_admin")
		.eq("id", user.id)
		.maybeSingle()

	if (!userRow?.is_admin) {
		redirect("/shop")
	}

	return <>{children}</>
}


