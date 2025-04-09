import { NextResponse } from "next/server"
import { cleanupExpiredFiles } from "@/lib/actions"

/**
 * Cron job to clean up expired images
 * This should be set to run every hour
 */
export async function GET() {
  try {
    // Clean up expired files
    const result = await cleanupExpiredFiles()

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} expired images`,
    })
  } catch (error) {
    console.error("Error cleaning up expired images:", error)
    return NextResponse.json({ success: false, error: "Failed to clean up expired images" }, { status: 500 })
  }
}

// Set the revalidation time to 0 to ensure the route is always fresh
export const revalidate = 0
