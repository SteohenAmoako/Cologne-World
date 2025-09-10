"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Truck, MapPin, User } from "lucide-react"

interface UserProfile {
  full_name?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

interface CheckoutFormProps {
  userProfile: UserProfile | null
  onSubmit: (data: any) => void
  isProcessing: boolean
}

export function CheckoutForm({ userProfile, onSubmit, isProcessing }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    // Customer Info
    email: "",
    full_name: userProfile?.full_name || "",
    phone: userProfile?.phone || "",

    // Shipping Address
    shipping_address: userProfile?.address || "",
    shipping_city: userProfile?.city || "",
    shipping_state: userProfile?.state || "",
    shipping_postal_code: userProfile?.postal_code || "",
    shipping_country: userProfile?.country || "United States",

    // Billing Address
    billing_same_as_shipping: true,
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_postal_code: "",
    billing_country: "United States",

    // Payment
    payment_method: "credit_card",
    card_number: "",
    card_expiry: "",
    card_cvc: "",
    card_name: "",
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shipping_address">Street Address *</Label>
            <Input
              id="shipping_address"
              type="text"
              value={formData.shipping_address}
              onChange={(e) => handleInputChange("shipping_address", e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shipping_city">City *</Label>
              <Input
                id="shipping_city"
                type="text"
                value={formData.shipping_city}
                onChange={(e) => handleInputChange("shipping_city", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="shipping_state">State *</Label>
              <Input
                id="shipping_state"
                type="text"
                value={formData.shipping_state}
                onChange={(e) => handleInputChange("shipping_state", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="shipping_postal_code">ZIP Code *</Label>
              <Input
                id="shipping_postal_code"
                type="text"
                value={formData.shipping_postal_code}
                onChange={(e) => handleInputChange("shipping_postal_code", e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Billing Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="billing_same"
              checked={formData.billing_same_as_shipping}
              onCheckedChange={(checked) => handleInputChange("billing_same_as_shipping", checked as boolean)}
            />
            <Label htmlFor="billing_same">Same as shipping address</Label>
          </div>

          {!formData.billing_same_as_shipping && (
            <>
              <div>
                <Label htmlFor="billing_address">Street Address *</Label>
                <Input
                  id="billing_address"
                  type="text"
                  value={formData.billing_address}
                  onChange={(e) => handleInputChange("billing_address", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billing_city">City *</Label>
                  <Input
                    id="billing_city"
                    type="text"
                    value={formData.billing_city}
                    onChange={(e) => handleInputChange("billing_city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing_state">State *</Label>
                  <Input
                    id="billing_state"
                    type="text"
                    value={formData.billing_state}
                    onChange={(e) => handleInputChange("billing_state", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing_postal_code">ZIP Code *</Label>
                  <Input
                    id="billing_postal_code"
                    type="text"
                    value={formData.billing_postal_code}
                    onChange={(e) => handleInputChange("billing_postal_code", e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.payment_method}
            onValueChange={(value) => handleInputChange("payment_method", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card">Credit Card</Label>
            </div>
          </RadioGroup>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="card_name">Name on Card *</Label>
              <Input
                id="card_name"
                type="text"
                value={formData.card_name}
                onChange={(e) => handleInputChange("card_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="card_number">Card Number *</Label>
              <Input
                id="card_number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.card_number}
                onChange={(e) => handleInputChange("card_number", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card_expiry">Expiry Date *</Label>
                <Input
                  id="card_expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={formData.card_expiry}
                  onChange={(e) => handleInputChange("card_expiry", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="card_cvc">CVC *</Label>
                <Input
                  id="card_cvc"
                  type="text"
                  placeholder="123"
                  value={formData.card_cvc}
                  onChange={(e) => handleInputChange("card_cvc", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-lg py-6" disabled={isProcessing}>
        {isProcessing ? "Processing Order..." : "Complete Order"}
      </Button>
    </form>
  )
}
