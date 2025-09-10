"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LogoutButton } from "@/components/auth/logout-button"
import { useCart } from "@/contexts/cart-context"
import { Sparkles, ShoppingBag, Search } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export function ShopHeader() {
	const [user, setUser] = useState<User | null>(null)
	const [isAdmin, setIsAdmin] = useState(false)
	const [searchQuery, setSearchQuery] = useState("")
	const router = useRouter()
	const supabase = createClient()
	const { cartCount } = useCart()

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser()
			setUser(user)

			if (user?.id) {
				const { data: userRow } = await supabase
					.from("users")
					.select("is_admin")
					.eq("id", user.id)
					.maybeSingle()
				setIsAdmin(!!userRow?.is_admin)
			} else {
				setIsAdmin(false)
			}
		}
		getUser()
	}, [supabase])

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		const params = new URLSearchParams()
		if (searchQuery.trim()) {
			params.set("search", searchQuery.trim())
		}
		router.push(`/shop?${params.toString()}`)
	}

	return (
		<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between gap-4">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 flex-shrink-0">
						<Sparkles className="h-8 w-8 text-rose-600" />
						<h1 className="text-2xl font-bold text-gray-900">Perfume Palace</h1>
					</Link>

					{/* Search Bar */}
					<form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								type="text"
								placeholder="Search perfumes..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
					</form>

					{/* Navigation */}
					<nav className="flex items-center gap-2 flex-shrink-0">
						{user ? (
							<>
								{isAdmin && (
									<Link href="/admin">
										<Button variant="outline" size="sm">Admin Dashboard</Button>
									</Link>
								)}
								<Link href="/cart">
									<Button variant="ghost" size="icon" className="relative">
										<ShoppingBag className="h-5 w-5" />
										{cartCount > 0 && (
											<Badge
												variant="destructive"
												className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-rose-600"
											>
												{cartCount}
											</Badge>
										)}
									</Button>
								</Link>
								<Link href="/profile">
									<Button variant="ghost" size="icon">
										{(user as any).avatar_url ? (
											<img
												src={(user as any).avatar_url || "/placeholder.svg"}
												alt="User Avatar"
												className="h-5 w-5 rounded-full"
											/>
										) : (
											<span className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center">U</span>
										)}
									</Button>
								</Link>
								<LogoutButton />
							</>
						) : (
							<>
								<Link href="/auth/login">
									<Button variant="ghost">Login</Button>
								</Link>
								<Link href="/auth/signup">
									<Button>Sign Up</Button>
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	)
}
