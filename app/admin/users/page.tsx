import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminUsersPage() {
	const supabase = await createClient()

	// Fetch users from public.users
	const { data: usersTable } = await supabase
		.from("users")
		.select("id, email, is_admin")
		.order("email")

	// Try to fetch profiles (may be limited by RLS if your admin profile is not flagged is_admin)
	const { data: profiles } = await supabase
		.from("user_profiles")
		.select("id, full_name, is_admin")

	const usersById: Record<string, any> = {}
	;(usersTable || []).forEach((u: any) => {
		usersById[u.id] = { id: u.id, email: u.email, full_name: null, is_admin: !!u.is_admin }
	})
	;(profiles || []).forEach((p: any) => {
		if (usersById[p.id]) {
			usersById[p.id].full_name = p.full_name
			// if users table lacks role, fallback to profile role
			if (usersById[p.id].is_admin === undefined) usersById[p.id].is_admin = !!p.is_admin
		} else {
			usersById[p.id] = { id: p.id, email: null, full_name: p.full_name, is_admin: !!p.is_admin }
		}
	})

	const combined = Object.values(usersById)

	const { data: orders } = await supabase
		.from("orders")
		.select("id, user_id")

	const userToOrders: Record<string, number> = {}
	;(orders || []).forEach((o: any) => {
		userToOrders[o.user_id] = (userToOrders[o.user_id] || 0) + 1
	})

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Users</h1>
					<p className="text-gray-600">View users and their activity</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>All Users ({combined.length})</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b">
										<th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Name</th>
										<th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Email</th>
										<th className="hidden sm:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">User ID</th>
										<th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Orders</th>
										<th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Role</th>
									</tr>
								</thead>
								<tbody>
									{combined.map((u: any) => (
										<tr key={u.id} className="border-b hover:bg-gray-50">
											<td className="py-2 sm:py-3 px-2 sm:px-4">{u.full_name || "—"}</td>
											<td className="py-2 sm:py-3 px-2 sm:px-4">{u.email || "—"}</td>
											<td className="hidden sm:table-cell py-2 sm:py-3 px-2 sm:px-4 text-gray-500">{u.id}</td>
											<td className="py-2 sm:py-3 px-2 sm:px-4">{userToOrders[u.id] || 0}</td>
											<td className="py-2 sm:py-3 px-2 sm:px-4">
												<Badge variant={u.is_admin ? "default" : "secondary"}>{u.is_admin ? "Admin" : "User"}</Badge>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>
		</AdminLayout>
	)
}


