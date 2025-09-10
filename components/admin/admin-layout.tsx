"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/auth/logout-button"
import { LayoutDashboard, Package, ShoppingCart, Users, Menu, X, Sparkles, BarChart3, Tags } from "lucide-react"

interface AdminLayoutProps {
	children: React.ReactNode
}

const navigation = [
	{ name: "Overview", href: "/admin", icon: LayoutDashboard },
	{ name: "Orders", href: "/admin/orders", icon: ShoppingCart },
	{ name: "Products", href: "/admin/products", icon: Package },
	{ name: "Brands", href: "/admin/brands", icon: Tags },
	{ name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
	{ name: "Users", href: "/admin/users", icon: Users },
]

export function AdminLayout({ children }: AdminLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const pathname = usePathname()

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div className="fixed inset-0 z-40 lg:hidden">
					<div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
					<div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
						<div className="absolute top-0 right-0 -mr-12 pt-2">
							<Button variant="ghost" size="icon" className="text-white" onClick={() => setSidebarOpen(false)}>
								<X className="h-6 w-6" />
							</Button>
						</div>
						<SidebarContent pathname={pathname} />
					</div>
				</div>
			)}

			{/* Desktop sidebar */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
				<SidebarContent pathname={pathname} />
			</div>

			{/* Main content */}
			<div className="lg:pl-64">
				{/* Top bar */}
				<div className="sticky top-0 z-10 bg-white shadow-sm border-b">
					<div className="flex h-16 items-center justify-between lg:justify-end px-4 sm:px-6 lg:px-8">
						<Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
							<Menu className="h-6 w-6" />
						</Button>

						<div className="flex items-center gap-4 ml-auto">
							<Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
								View Store
							</Link>
							<LogoutButton variant="outline" size="sm" />
						</div>
					</div>
				</div>

				{/* Page content */}
				<main className="p-4 sm:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	)
}

function SidebarContent({ pathname }: { pathname: string }) {
	return (
		<div className="flex flex-1 flex-col bg-white border-r">
			{/* Logo */}
			<div className="flex h-16 items-center px-6 border-b">
				<div className="flex items-center gap-2">
					<Sparkles className="h-8 w-8 text-rose-600" />
					<div>
						<h1 className="text-lg font-bold text-gray-900">Perfume Palace</h1>
						<p className="text-xs text-gray-500">Admin Dashboard</p>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-4 py-6 space-y-1">
				{navigation.map((item) => {
					const isActive = pathname === item.href
					return (
						<Link
							key={item.name}
							href={item.href}
							className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
								isActive
									? "bg-rose-50 text-rose-700 border-r-2 border-rose-600"
									: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
							}`}
						>
							<item.icon className="h-5 w-5" />
							{item.name}
						</Link>
					)
				})}
			</nav>
		</div>
	)
}
