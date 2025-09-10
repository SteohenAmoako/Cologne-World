import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
	let res = NextResponse.next()

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return req.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
					res = NextResponse.next()
					cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
				},
			},
		},
	)

	await supabase.auth.refreshSession()
	const {
		data: { session },
	} = await supabase.auth.getSession()

	const pathname = req.nextUrl.pathname
	const isAuthRoute = pathname.startsWith("/auth")
	const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin")

	// Redirect authenticated users away from auth pages
	if (session && isAuthRoute) {
		const url = req.nextUrl.clone()
		url.pathname = "/shop"
		return NextResponse.redirect(url)
	}

	// Require auth for admin routes
	if (isAdminRoute) {
		if (!session) {
			const url = req.nextUrl.clone()
			url.pathname = "/auth/login"
			return NextResponse.redirect(url)
		}

		// Check admin role from public.users table
		const { data: userRow, error } = await supabase
			.from("users")
			.select("is_admin")
			.eq("id", session.user.id)
			.maybeSingle()

		if (error || !userRow?.is_admin) {
			const url = req.nextUrl.clone()
			url.pathname = "/shop"
			return NextResponse.redirect(url)
		}
	}

	return res
}

export const config = {
	matcher: ["/admin/:path*", "/api/admin/:path*", "/auth/:path*"],
}
