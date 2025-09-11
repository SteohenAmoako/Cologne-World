"use client"

import { useIsAdmin } from "@/hooks/useIsAdmin"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, ShoppingCart, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NavHeader() {
  const [session, setSession] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClientComponentClient()
  const isAdmin = useIsAdmin(session)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [supabase.auth])

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-black hover:text-gray-700 transition-colors">
          Perfume Palace
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/shop" className="text-gray-700 hover:text-black transition-colors">
            Shop
          </Link>
          <Link 
            href="/cart" 
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart
          </Link>
          {session ? (
            <>
              <Link 
                href="/profile" 
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
              <Button
                onClick={() => supabase.auth.signOut()}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right Side - Icons */}
        <div className="md:hidden flex items-center gap-3">
          {/* Cart Icon */}
          <Link 
            href="/cart" 
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="h-6 w-6 text-gray-700" />
          </Link>
          
          {/* Profile Icon - only show if logged in */}
          {session && (
            <Link 
              href="/profile" 
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <User className="h-6 w-6 text-gray-700" />
            </Link>
          )}
          
          {/* Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link 
              href="/shop" 
              className="block py-2 text-gray-700 hover:text-black transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
            
            <Link 
              href="/cart" 
              className="flex items-center gap-3 py-2 text-gray-700 hover:text-black transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
            </Link>
            
            {session ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-black transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block bg-black text-white px-4 py-3 rounded-md hover:bg-gray-800 transition-colors text-center font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="pt-2 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      supabase.auth.signOut()
                      setMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}