import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getCurrentUser } from "@/lib/session"

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const tenantId = formData.get("tenantId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!tenantId) {
      return NextResponse.json({ error: "No tenant ID provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`tenants/${tenantId}/logo-${Date.now()}.${file.name.split(".").pop()}`, file, {
      access: "public",
    })

    return NextResponse.json({ logoUrl: blob.url })
  } catch (error) {
    console.error("Logo upload failed:", error)
    return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 })
  }
}

