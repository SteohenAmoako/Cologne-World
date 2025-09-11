"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Truck, MapPin, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Paystack TypeScript declarations
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string
        email: string
        amount: number
        currency?: string
        ref?: string
        callback: (response: any) => void
        onClose: () => void
        metadata?: any
      }) => {
        openIframe: () => void
      }
    }
  }
}

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
  onPaymentSuccess?: (response: any, formData: any) => void
  onPaymentError?: (error: any) => void
  amount: number // Amount in pesewas (e.g., 1000 = ₵10.00)
  paystackPublicKey: string
  isProcessing?: boolean
}

export function CheckoutForm({ 
  userProfile, 
  onPaymentSuccess, 
  onPaymentError,
  amount,
  paystackPublicKey,
  isProcessing = false 
}: CheckoutFormProps) {
  const { toast } = useToast()
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
    shipping_country: userProfile?.country || "Ghana",

    // Billing Address
    billing_same_as_shipping: true,
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_postal_code: "",
    billing_country: "Ghana",
  })

  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false)
  const [processing, setProcessing] = useState(isProcessing)

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => setIsPaystackLoaded(true)
    script.onerror = () => {
      console.error('Failed to load Paystack script')
      onPaymentError?.('Failed to load payment processor')
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [onPaymentError])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateTransactionRef = () => {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const validateForm = () => {
    const requiredFields = [
      'email', 'full_name', 'shipping_address', 'shipping_city', 
      'shipping_state', 'shipping_postal_code'
    ]

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        alert(`Please fill in the ${field.replace('_', ' ')} field`)
        return false
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address')
      return false
    }

    return true
  }

  const handlePaystackPayment = () => {
    if (!isPaystackLoaded) {
      toast({
        title: "Payment Not Ready",
        description: "Payment processor is loading. Please try again in a moment.",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      return
    }

    setProcessing(true)

    const billingData = formData.billing_same_as_shipping ? {
      billing_address: formData.shipping_address,
      billing_city: formData.shipping_city,
      billing_state: formData.shipping_state,
      billing_postal_code: formData.shipping_postal_code,
      billing_country: formData.shipping_country,
    } : {
      billing_address: formData.billing_address,
      billing_city: formData.billing_city,
      billing_state: formData.billing_state,
      billing_postal_code: formData.billing_postal_code,
      billing_country: formData.billing_country,
    }

    const paymentData = {
      key: paystackPublicKey,
      email: formData.email,
      amount: amount, // Amount in pesewas
      currency: 'GHS',
      ref: generateTransactionRef(),
      callback: (response: any) => {
        setProcessing(false)
        console.log('Payment successful:', response)
        onPaymentSuccess?.(response, { ...formData, ...billingData })
      },
      onClose: () => {
        setProcessing(false)
        console.log('Payment popup closed')
      },
      metadata: {
        custom_fields: [
          {
            display_name: 'Full Name',
            variable_name: 'full_name',
            value: formData.full_name
          },
          {
            display_name: 'Phone',
            variable_name: 'phone',
            value: formData.phone
          },
          {
            display_name: 'Shipping Address',
            variable_name: 'shipping_address',
            value: `${formData.shipping_address}, ${formData.shipping_city}, ${formData.shipping_state} ${formData.shipping_postal_code}`
          }
        ]
      }
    }

    try {
      const handler = window.PaystackPop.setup(paymentData)
      handler.openIframe()
    } catch (error) {
      setProcessing(false)
      console.error('Paystack error:', error)
      toast({
        title: "Payment Failed",
        description: "Payment initialization failed. Please try again.",
        variant: "destructive",
      })
      onPaymentError?.(error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handlePaystackPayment()
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

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-rose-600 hover:bg-rose-700 text-lg py-6" 
        disabled={processing || !isPaystackLoaded}
      >
        {processing ? "Processing Payment..." : 
         !isPaystackLoaded ? "Loading Payment..." : 
         "Pay Now"}
      </Button>
    </form>
  )
}