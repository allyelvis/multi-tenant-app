import { cookies } from "next/headers"
import { decryptData } from "./encryption"

export async function getCurrentUser() {
  const session = cookies().get("session")?.value

  if (!session) {
    return null
  }

  try {
    const { user } = JSON.parse(decryptData(session))
    return user
  } catch (error) {
    return null
  }
}

