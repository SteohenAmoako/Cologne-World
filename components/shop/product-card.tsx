"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { ShoppingBag, Star, Check } from "lucide-react"

interface Perfume {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
  brands: { name: string }
  perfume_types: { name: string }
}

interface ProductCardProps {
  perfume: Perfume
}

export function ProductCard({ perfume }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)
    try {
      await addToCart(perfume.id)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={perfume.image_url || "/placeholder.svg"}
          alt={perfume.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            {perfume.brands.name}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/90">
            {perfume.perfume_types.name}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{perfume.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{perfume.description}</p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <Star className="h-4 w-4 fill-gray-200 text-gray-200" />
              <span className="text-xs text-gray-500 ml-1">(4.0)</span>
            </div>
            <p className="text-lg font-bold text-rose-600">GH₵{perfume.price}</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Link href={`/shop/product/${perfume.id}`} className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                View Details
              </Button>
            </Link>
            <Button
              size="icon"
              className={`${justAdded ? "bg-green-600 hover:bg-green-700" : "bg-rose-600 hover:bg-rose-700"} transition-colors`}
              onClick={handleAddToCart}
              disabled={isAdding || perfume.stock_quantity === 0}
            >
              {justAdded ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            </Button>
          </div>

          {perfume.stock_quantity < 10 && perfume.stock_quantity > 0 && (
            <p className="text-xs text-amber-600 font-medium">Only {perfume.stock_quantity} left in stock!</p>
          )}
          {perfume.stock_quantity === 0 && <p className="text-xs text-red-600 font-medium">Out of stock</p>}
        </div>
      </CardContent>
    </Card>
  )
}
