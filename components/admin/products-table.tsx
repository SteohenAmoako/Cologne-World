"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock_quantity: number
  image_url: string
  brands: { id: string | number; name: string }
  perfume_types: { id: string | number; name: string }
}

interface Brand {
  id: string | number
  name: string
}

interface PerfumeType {
  id: string | number
  name: string
}

interface ProductsTableProps {
  products: Product[]
  brands: Brand[]
  perfumeTypes: PerfumeType[]
}

export function ProductsTable({ products, brands, perfumeTypes }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    brand_id: "",
    perfume_type_id: "",
    image_url: "",
    stock_quantity: "",
    is_active: true,
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const previewUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile)
    }
    return form.image_url || ""
  }, [selectedFile, form.image_url])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brands.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      brand_id: "",
      perfume_type_id: "",
      image_url: "",
      stock_quantity: "",
      is_active: true,
    })
    setSelectedFile(null)
    setError(null)
    setFileError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setFileError(null)
    try {
      let finalImageUrl: string | null = null

      // If a file is chosen, convert to data URL (same approach as URL upload)
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop()?.toLowerCase() || "jpg"
        const allowed = ["jpg", "jpeg", "png", "webp"]
        if (!allowed.includes(fileExt)) {
          throw new Error("Unsupported image type. Use JPG, PNG, or WEBP.")
        }
        
        // Convert file to data URL - no bucket needed, just like URL upload
        const reader = new FileReader()
        finalImageUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error("Failed to read file"))
          reader.readAsDataURL(selectedFile)
        })
      } else if (form.image_url.trim()) {
        // If user pasted a URL, use it directly (no bucket upload needed)
        finalImageUrl = form.image_url.trim()
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          price: Number(form.price),
          brand_id: form.brand_id,
          perfume_type_id: form.perfume_type_id,
          image_url: finalImageUrl,
          stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : 0,
          is_active: form.is_active,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to add product")
      }
      setOpen(false)
      resetForm()
      router.refresh()
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("upload")) {
        setFileError(err.message)
      } else {
        setError(err.message || "Error adding product")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price?.toString() || "",
      brand_id: typeof product.brands === "object" 
        ? product.brands.id?.toString() || "" 
        : product.brands?.toString() || "",
      perfume_type_id: typeof product.perfume_types === "object" 
        ? product.perfume_types.id?.toString() || "" 
        : product.perfume_types?.toString() || "",
      image_url: product.image_url || "",
      stock_quantity: product.stock_quantity?.toString() || "",
      is_active: true,
    })
  
    setSelectedFile(null)
    setEditOpen(true)
  }
  

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    
    setSaving(true)
    setError(null)
    setFileError(null)
    try {
      let finalImageUrl: string | null = editingProduct.image_url

      // If a file is chosen, convert to data URL
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop()?.toLowerCase() || "jpg"
        const allowed = ["jpg", "jpeg", "png", "webp"]
        if (!allowed.includes(fileExt)) {
          throw new Error("Unsupported image type. Use JPG, PNG, or WEBP.")
        }
        
        const reader = new FileReader()
        finalImageUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error("Failed to read file"))
          reader.readAsDataURL(selectedFile)
        })
      } else if (form.image_url.trim()) {
        finalImageUrl = form.image_url.trim()
      }

      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          price: Number(form.price),
          brand_id: form.brand_id,
          perfume_type_id: form.perfume_type_id,
          image_url: finalImageUrl,
          stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : 0,
          is_active: form.is_active,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update product")
      }
      setEditOpen(false)
      setEditingProduct(null)
      resetForm()
      router.refresh()
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("upload")) {
        setFileError(err.message)
      } else {
        setError(err.message || "Error updating product")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (product: Product) => {
    setDeletingProduct(product)
    setDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return
    
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete product")
      }
      setDeleteOpen(false)
      setDeletingProduct(null)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Error deleting product")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Actions */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="text-sm text-red-600">{error}</div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input id="stock" type="number" min="0" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Brand</Label>
                      <Select value={String(form.brand_id)} onValueChange={(v) => setForm({ ...form, brand_id: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((b) => (
                            <SelectItem key={String(b.id)} value={String(b.id)}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Perfume Type</Label>
                      <Select value={String(form.perfume_type_id)} onValueChange={(v) => setForm({ ...form, perfume_type_id: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {perfumeTypes.map((t) => (
                            <SelectItem key={String(t.id)} value={String(t.id)}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageFile">Product Image</Label>
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        setSelectedFile(file)
                      }}
                    />
                    {fileError && <div className="text-sm text-red-600">{fileError}</div>}
                    {previewUrl && (
                      <div className="mt-2">
                        <div className="relative w-24 h-32 overflow-hidden rounded border">
                          <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                        </div>
                        {!selectedFile && (
                          <div className="text-xs text-gray-500 mt-1">Using existing URL preview</div>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">You can also paste an image URL:</div>
                    <Input
                      placeholder="https://..."
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving} className="bg-rose-600 hover:bg-rose-700">
                      {saving ? "Adding..." : "Add Product"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Product</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Brand</th>
                  <th className="hidden md:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Type</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Price</th>
                  <th className="hidden sm:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Stock</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 sm:w-12 sm:h-16 flex-shrink-0 overflow-hidden rounded">
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-xs sm:text-sm">{product.name}</p>
                          <p className="hidden sm:block text-xs text-gray-600 line-clamp-2">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <Badge variant="secondary">{product.brands.name}</Badge>
                    </td>
                    <td className="hidden md:table-cell py-2 sm:py-3 px-2 sm:px-4">
                      <Badge variant="outline">{product.perfume_types.name}</Badge>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 font-semibold">GH₵{product.price}</td>
                    <td className="hidden sm:table-cell py-2 sm:py-3 px-2 sm:px-4">
                      <Badge variant={product.stock_quantity < 10 ? "destructive" : "default"}>
                        {product.stock_quantity}
                      </Badge>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(product)}
                          disabled={saving}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(product)}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input 
                id="edit-description" 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input 
                  id="edit-price" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  value={form.price} 
                  onChange={(e) => setForm({ ...form, price: e.target.value })} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock Quantity</Label>
                <Input 
                  id="edit-stock" 
                  type="number" 
                  min="0" 
                  value={form.stock_quantity} 
                  onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select value={String(form.brand_id)} onValueChange={(v) => setForm({ ...form, brand_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={String(b.id)} value={String(b.id)}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Perfume Type</Label>
                <Select value={String(form.perfume_type_id)} onValueChange={(v) => setForm({ ...form, perfume_type_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {perfumeTypes.map((t) => (
                      <SelectItem key={String(t.id)} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-imageFile">Product Image</Label>
              <Input
                id="edit-imageFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setSelectedFile(file)
                }}
              />
              {fileError && <div className="text-sm text-red-600">{fileError}</div>}
              {previewUrl && (
                <div className="mt-2">
                  <div className="relative w-24 h-32 overflow-hidden rounded border">
                    <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                  {!selectedFile && (
                    <div className="text-xs text-gray-500 mt-1">Using existing image</div>
                  )}
                </div>
              )}
              <div className="text-xs text-gray-500">You can also paste an image URL:</div>
              <Input
                placeholder="https://..."
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-rose-600 hover:bg-rose-700">
                {saving ? "Updating..." : "Update Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            <p className="text-gray-600">
              Are you sure you want to delete <strong>{deletingProduct?.name}</strong>? 
              This action cannot be undone.
            </p>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDeleteConfirm}
                disabled={saving}
              >
                {saving ? "Deleting..." : "Delete Product"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
