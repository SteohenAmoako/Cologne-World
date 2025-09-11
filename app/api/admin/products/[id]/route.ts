import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface Params {
  params: { id: string }
}

// UPDATE a product
export async function PUT(request: Request, { params }: Params) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: userRow, error: roleError } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle()

  if (roleError || !userRow?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let payload: any
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const {
    name,
    description,
    price,
    brand_id,
    perfume_type_id,
    image_url,
    stock_quantity,
    is_active = true,
  } = payload || {}

  if (!name || !price || !brand_id || !perfume_type_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const parsedPrice = Number(price)
  const parsedStock = Number(stock_quantity ?? 0)
  if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 })
  }
  if (Number.isNaN(parsedStock) || parsedStock < 0) {
    return NextResponse.json({ error: "Invalid stock_quantity" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("perfumes")
    .update({
      name,
      description: description ?? null,
      price: parsedPrice,
      brand_id,
      perfume_type_id,
      image_url: image_url ?? null,
      stock_quantity: parsedStock,
      is_active,
    })
    .eq("id", params.id)
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

// DELETE a product
export async function DELETE(_request: Request, { params }: Params) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: userRow, error: roleError } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle()

  if (roleError || !userRow?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { error } = await supabase
    .from("perfumes")
    .delete()
    .eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
