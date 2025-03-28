import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decryptData } from "@/lib/encryption"

export async function GET() {
  const session = cookies().get("session")?.value

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const { user } = JSON.parse(decryptData(session))
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}

