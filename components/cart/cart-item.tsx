"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

interface CartItemProps {
  item: {
    id: number
    quantity: number
    perfume_id: number
    perfumes: {
      id: number
      name: string
      price: number
      image_url: string
      stock_quantity: number
      brands: { name: string }
    }
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.perfumes.stock_quantity) return

    setIsUpdating(true)
    try {
      await updateQuantity(item.id, newQuantity)
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await removeFromCart(item.id)
    } catch (error) {
      console.error("Error removing item:", error)
      setIsRemoving(false)
    }
  }

  const subtotal = item.quantity * item.perfumes.price

  return (
    <Card className={`${isRemoving ? "opacity-50" : ""} transition-opacity`}> 
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-3 sm:gap-4">
          {/* Product Image */}
          <div className="relative w-20 h-24 sm:w-24 sm:h-32 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={item.perfumes.image_url || "/placeholder.svg"}
              alt={item.perfumes.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant="secondary" className="mb-1">
                  {item.perfumes.brands.name}
                </Badge>
                <Link
                  href={`/shop/product/${item.perfumes.id}`}
                  className="block font-semibold text-gray-900 hover:text-rose-600 transition-colors line-clamp-1"
                >
                  {item.perfumes.name}
                </Link>
                <p className="text-sm sm:text-lg font-bold text-rose-600">GH₵{item.perfumes.price}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={isRemoving}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Qty:</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating}
                  >
                    -
                  </Button>
                  <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={item.quantity >= item.perfumes.stock_quantity || isUpdating}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">GH₵{subtotal.toFixed(2)}</p>
                {item.quantity > 1 && <p className="text-[10px] sm:text-xs text-gray-500">GH₵{item.perfumes.price} each</p>}
              </div>
            </div>

            {item.perfumes.stock_quantity < 10 && (
              <p className="text-[10px] sm:text-xs text-amber-600">Only {item.perfumes.stock_quantity} left in stock</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
