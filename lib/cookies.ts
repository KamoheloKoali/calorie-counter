"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GUEST_COOKIE_NAME, COOKIE_EXPIRATION } from './constants';

/**
 * Get the guest ID from cookies
 */


export async function getGuestId() {
  const cookieStore = await cookies()
  const guestIdCookie = cookieStore.get(GUEST_COOKIE_NAME)
  return guestIdCookie?.value
}


