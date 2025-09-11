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
  metadataBase: new URL((process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim()),
  openGraph: {
    title: "Perfume Palace - Luxury Fragrances",
    description:
      "Discover premium perfumes from top brands including Pear Potion, Asad and Yara Mix, Saheb, and more",
    url: "/",
    siteName: "Perfume Palace",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Perfume Palace preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfume Palace - Luxury Fragrances",
    description:
      "Discover premium perfumes from top brands including Pear Potion, Asad and Yara Mix, Saheb, and more",
    images: ["/placeholder.jpg"],
  },
  icons: {
    icon: "/placeholder-logo.svg",
    shortcut: "/placeholder-logo.svg",
    apple: "/placeholder-logo.svg",
  },
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
