import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decryptData, encryptData } from "@/lib/encryption"

export async function GET() {
  const session = cookies().get("session")?.value

  if (!session) {
    return NextResponse.json({ tenants: [] }, { status: 401 })
  }

  try {
    // In a real app, this would fetch tenants from the database
    // For demo purposes, we'll return mock data
    return NextResponse.json({
      tenants: [
        { id: "tenant_1", name: "Acme Inc." },
        { id: "tenant_2", name: "Globex Corporation" },
        { id: "tenant_3", name: "Initech" },
      ],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tenants" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = cookies().get("session")?.value

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // In a real app, this would create a new tenant in the database
    const newTenant = {
      id: "tenant_" + Math.random().toString(36).substring(2, 9),
      name,
    }

    // Update the session with the new tenant
    const sessionData = JSON.parse(decryptData(session))

    cookies().set(
      "session",
      encryptData(
        JSON.stringify({
          ...sessionData,
          tenant: newTenant,
        }),
      ),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    return NextResponse.json({ tenant: newTenant })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tenant" }, { status: 500 })
  }
}

