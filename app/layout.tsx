import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Perfume Palace - Luxury Fragrances",
  description: "Discover premium perfumes from top brands including Pear Potion, Asad and Yara Mix, Saheb, and more",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <CartProvider>
          <Suspense fallback={null}>
            <div className="min-h-screen">
              <main>
                {children}
              </main>
            </div>
          </Suspense>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
