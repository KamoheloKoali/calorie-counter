"use server"

import { cookies } from "next/headers"
import { GUEST_COOKIE_NAME } from "./constants"

/**
 * Get the guest ID from cookies
 */


export async function getGuestId() {
  const cookieStore = await cookies()
  const guestIdCookie = cookieStore.get(GUEST_COOKIE_NAME)
  return guestIdCookie?.value
}

