import { COOKIE_EXPIRATION, GUEST_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const guestId = uuidv4();

  ;(await cookies()).set({
    name: GUEST_COOKIE_NAME,
    value: guestId,
    httpOnly: true,
    path: "/",
    maxAge: COOKIE_EXPIRATION,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
  );
}
