import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, phone, address, city, state, postal_code, country } = body

    // Check if profile exists
    const { data: existingProfile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          full_name,
          phone,
          address,
          city,
          state,
          postal_code,
          country,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ profile: data[0] })
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from("user_profiles")
        .insert({
          user_id: user.id,
          full_name,
          phone,
          address,
          city,
          state,
          postal_code,
          country,
        })
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ profile: data[0] })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
