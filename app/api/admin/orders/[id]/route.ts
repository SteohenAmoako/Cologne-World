import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface Params {
  params: { id: string }
}

// GET a single order
export async function GET(_req: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("orders").select("*").eq("id", params.id).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// UPDATE an order
export async function PUT(req: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { status } = await req.json()

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", params.id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE an order
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("orders").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
