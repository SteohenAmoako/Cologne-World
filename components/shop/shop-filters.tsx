"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface Brand {
  id: number
  name: string
}

interface PerfumeType {
  id: number
  name: string
}

interface ShopFiltersProps {
  brands: Brand[]
  perfumeTypes: PerfumeType[]
  currentFilters: {
    search?: string
    brand?: string
    type?: string
    sort?: string
  }
}

export function ShopFilters({ brands, perfumeTypes, currentFilters }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/shop?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push("/shop")
  }

  const hasActiveFilters = currentFilters.brand || currentFilters.type || currentFilters.search

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentFilters.search && (
              <div className="flex items-center gap-2">
                <span className="text-sm bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                  Search: {currentFilters.search}
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateFilters("search", null)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            {currentFilters.brand && (
              <div className="flex items-center gap-2">
                <span className="text-sm bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                  Brand: {brands.find((b) => b.id.toString() === currentFilters.brand)?.name}
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateFilters("brand", null)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            {currentFilters.type && (
              <div className="flex items-center gap-2">
                <span className="text-sm bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                  Type: {perfumeTypes.find((t) => t.id.toString() === currentFilters.type)?.name}
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateFilters("type", null)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentFilters.sort || "name"} onValueChange={(value) => updateFilters("sort", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
              <SelectItem value="price">Price Low-High</SelectItem>
              <SelectItem value="price_desc">Price High-Low</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Brand Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Brand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={currentFilters.brand === brand.id.toString()}
                onCheckedChange={(checked) => {
                  updateFilters("brand", checked ? brand.id.toString() : null)
                }}
              />
              <Label htmlFor={`brand-${brand.id}`} className="text-sm font-normal">
                {brand.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Type Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {perfumeTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type.id}`}
                checked={currentFilters.type === type.id.toString()}
                onCheckedChange={(checked) => {
                  updateFilters("type", checked ? type.id.toString() : null)
                }}
              />
              <Label htmlFor={`type-${type.id}`} className="text-sm font-normal">
                {type.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
