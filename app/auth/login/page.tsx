"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const router = useRouter()
	const supabase = createClient()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError("")

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			})

			if (error) {
				setError(error.message)
			} else {
				const userId = data.session?.user?.id
				let isAdmin = false
				if (userId) {
					const { data: userRow } = await supabase
						.from("users")
						.select("is_admin")
						.eq("id", userId)
						.maybeSingle()
					isAdmin = !!userRow?.is_admin
				}

				router.replace(isAdmin ? "/admin" : "/shop")
			}
		} catch (err) {
			setError("An unexpected error occurred")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex items-center justify-center gap-2 mb-2">
						<Sparkles className="h-8 w-8 text-rose-600" />
						<h1 className="text-2xl font-bold text-gray-900">Cologn World</h1>
					</div>
					<CardTitle>Welcome Back</CardTitle>
					<CardDescription>Sign in to your account to continue shopping</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin} className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
									required
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-gray-400" />
									) : (
										<Eye className="h-4 w-4 text-gray-400" />
									)}
								</Button>
							</div>
						</div>

						<Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={loading}>
							{loading ? "Signing in..." : "Sign In"}
						</Button>
					</form>

					<div className="mt-6 text-center text-sm">
						<span className="text-gray-600">Don't have an account? </span>
						<Link href="/auth/signup" className="text-rose-600 hover:text-rose-700 font-medium">
							Sign up
						</Link>
					</div>

					<div className="mt-4 text-center">
						<Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
							← Back to home
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
