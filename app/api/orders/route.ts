import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      email,
      full_name,
      phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      billing_same_as_shipping,
      billing_address,
      billing_city,
      billing_state,
      billing_postal_code,
      billing_country,
      payment_method,
      items,
    } = body

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.price, 0)
    const shipping = subtotal >= 75 ? 0 : 9.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        email,
        full_name,
        phone,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,
        billing_address: billing_same_as_shipping ? shipping_address : billing_address,
        billing_city: billing_same_as_shipping ? shipping_city : billing_city,
        billing_state: billing_same_as_shipping ? shipping_state : billing_state,
        billing_postal_code: billing_same_as_shipping ? shipping_postal_code : billing_postal_code,
        billing_country: billing_same_as_shipping ? shipping_country : billing_country,
        payment_method,
        subtotal,
        shipping_cost: shipping,
        tax_amount: tax,
        total_amount: total,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      perfume_id: item.perfume_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // Clear user's cart
    const { error: cartError } = await supabase.from("cart_items").delete().eq("user_id", user.id)

    if (cartError) {
      console.error("Error clearing cart:", cartError)
      // Don't fail the order if cart clearing fails
    }

    // Update stock quantities
    for (const item of items) {
      await supabase.rpc("decrement_stock", {
        perfume_id: item.perfume_id,
        quantity: item.quantity,
      })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
