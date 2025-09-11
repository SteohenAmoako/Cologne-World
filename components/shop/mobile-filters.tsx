"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"
import { ShopFilters } from "@/components/shop/shop-filters"

interface Brand { id: number; name: string }
interface PerfumeType { id: number; name: string }

interface MobileFiltersProps {
  brands: Brand[]
  perfumeTypes: PerfumeType[]
  currentFilters: { search?: string; brand?: string; type?: string; sort?: string }
}

export function MobileFilters({ brands, perfumeTypes, currentFilters }: MobileFiltersProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", onEsc)
    return () => document.removeEventListener("keydown", onEsc)
  }, [open])

  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="inline-flex items-center">
        <Filter className="h-4 w-4 mr-2" /> Filters
      </Button>

      {open && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ShopFilters brands={brands} perfumeTypes={perfumeTypes} currentFilters={currentFilters} />
          </div>
        </div>
      )}
    </div>
  )
}
