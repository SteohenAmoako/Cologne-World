"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { ArrowLeft, ShoppingBag, Heart, Share2, Star, Truck, Shield, RotateCcw, Check } from "lucide-react"

interface Perfume {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
  brands: { name: string; description: string }
  perfume_types: { name: string; description: string }
}

interface ProductDetailsProps {
  perfume: Perfume
}

export function ProductDetails({ perfume }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart(perfume.id, quantity)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 3000)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <Link href="/shop" className="hover:text-gray-900 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
        <span>/</span>
        <span>{perfume.brands.name}</span>
        <span>/</span>
        <span className="text-gray-900">{perfume.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={perfume.image_url || "/placeholder.svg"}
              alt={perfume.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {perfume.brands.name}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{perfume.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.0) • 127 reviews</span>
            </div>
            <p className="text-3xl font-bold text-rose-600 mb-4">GH₵{perfume.price}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{perfume.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-1">Type</h4>
              <p className="text-sm text-gray-600">{perfume.perfume_types.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-1">Stock</h4>
              <p className="text-sm text-gray-600">
                {perfume.stock_quantity > 0 ? `${perfume.stock_quantity} available` : "Out of stock"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(perfume.stock_quantity, quantity + 1))}
                  disabled={quantity >= perfume.stock_quantity}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={perfume.stock_quantity === 0 || isAdding}
                className={`flex-1 ${justAdded ? "bg-green-600 hover:bg-green-700" : "bg-rose-600 hover:bg-rose-700"} transition-colors`}
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlist}
                className={isWishlisted ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-green-600" />
              <span>Free shipping on orders over GH₵75</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>100% authentic guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="h-5 w-5 text-purple-600" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Info */}
      <Card className="mt-12">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-3">About {perfume.brands.name}</h3>
          <p className="text-gray-600 leading-relaxed">{perfume.brands.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
