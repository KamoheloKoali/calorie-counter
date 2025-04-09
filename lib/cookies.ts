import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Cookie name for guest ID
export const GUEST_COOKIE_NAME = "calorie-analyzer-guest-id"

// Cookie expiration time (2 hours in seconds)
export const COOKIE_EXPIRATION = 60 * 60 * 2

/**
 * Get the guest ID from cookies
 */
export function getGuestId(cookieStore = cookies()) {
  const guestIdCookie = cookieStore.get(GUEST_COOKIE_NAME)
  return guestIdCookie?.value
}

/**
 * Set the guest cookie and redirect to the homepage
 */
export function setGuestCookie(guestId: string) {
  // Set cookie with 2-hour expiration
  cookies().set({
    name: GUEST_COOKIE_NAME,
    value: guestId,
    httpOnly: true,
    path: "/",
    maxAge: COOKIE_EXPIRATION,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  // Redirect to homepage to apply the cookie
  redirect("/")
}
