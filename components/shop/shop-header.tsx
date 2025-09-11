"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LogoutButton } from "@/components/auth/logout-button"
import { useCart } from "@/contexts/cart-context"
import { Sparkles, ShoppingCart, Search, User as UserIcon } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export function ShopHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const { cartCount } = useCart()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
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

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set("search", searchQuery.trim())
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Sparkles className="h-8 w-8 text-rose-600" strokeWidth={2} />
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Cologne World</h1>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" strokeWidth={2} />
            <Input
              type="text"
              placeholder="Search perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2 text-sm rounded-lg border-gray-200 focus:ring-rose-500 focus:border-rose-500 transition-colors"
            />
          </div>
        </form>

        {/* Inline Nav */}
        <nav className="flex items-center gap-3">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full transition-colors duration-200">
              <ShoppingCart className="h-6 w-6 text-gray-600" strokeWidth={2} />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-medium bg-rose-600 text-white rounded-full"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="relative" ref={profileRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setProfileOpen((v) => !v)}
                className="hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                {user && (user as any).avatar_url ? (
                  <img
                    src={(user as any).avatar_url || "/placeholder.svg"}
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                ) : (
                  <span className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-medium text-gray-600 border border-gray-200 shadow-sm">
                    <UserIcon className="h-5 w-5" strokeWidth={2} />
                  </span>
                )}
              </Button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-lg border border-gray-100 bg-white shadow-xl p-2 z-50 transition-all duration-200 ease-in-out transform origin-top-right scale-95 opacity-0 animate-[dropdown_0.2s_ease-out_forwards]">
                  <Link
                    href="/profile"
                    className="block text-sm px-4 py-2 hover:bg-gray-50 rounded-md text-gray-700 font-medium transition-colors duration-150"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block text-sm px-4 py-2 hover:bg-gray-50 rounded-md text-gray-700 font-medium transition-colors duration-150"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="px-2 py-1 border-t border-gray-100">
                    <LogoutButton
                      variant="ghost"
                      size="sm"
                      className="w-full text-left text-sm px-4 py-2 hover:bg-gray-50 rounded-md text-gray-700 font-medium transition-colors duration-150"
                    />
                  </div>
                </div>
              )}
              <style jsx>{`
                @keyframes dropdown {
                  to {
                    opacity: 1;
                    scale: 1;
                  }
                }
              `}</style>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors duration-150"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}