import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ShoppingBag, Star } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-rose-600" />
            <h1 className="text-2xl font-bold text-gray-900">Cologne World</h1>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/shop">
                  <Button variant="ghost">Shop</Button>
                </Link>
                <Link href="/cart">
                  <Button variant="ghost" size="icon">
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline">Profile</Button>
                </Link>
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
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Discover Your Perfect
            <span className="text-rose-600"> Fragrance</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
            Explore our curated collection of luxury perfumes from premium brands. Find your signature scent today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                Shop Now
              </Button>
            </Link>
            {!user && (
              <Link href="/auth/signup">
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Featured Brands</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Pear Potion", "Asad and Yara Mix", "Saheb", "Kamrah", "Enclaire", "Bint Horan"].map((brand) => (
              <Card key={brand} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-rose-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{brand}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Premium Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Authentic fragrances from renowned perfume houses worldwide</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-rose-600" />
                  Easy Shopping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Browse, compare, and purchase your favorite scents with ease</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Expert Curation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Carefully selected fragrances to match every personality and occasion</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-rose-400" />
            <h3 className="text-xl font-bold">Cologne World</h3>
          </div>
          <p className="text-gray-400">Your destination for luxury fragrances</p>
        </div>
      </footer>
    </div>
  )
}
