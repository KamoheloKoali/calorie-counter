"use server"

import { revalidatePath } from "next/cache"
import { analyzeImage } from "@/lib/gemini"
import { utapi } from "@/lib/uploadthing"
import { COOKIE_EXPIRATION, GUEST_COOKIE_NAME } from "./constants"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Store uploaded file IDs with their expiration times
type UploadedFile = {
  fileId: string
  guestId: string
  expiresAt: Date
}

// In-memory store for uploaded files (in production, use a database)
let uploadedFiles: UploadedFile[] = []

/**
 * Register an uploaded file with its expiration time
 */
export async function registerUploadedFile(fileUrl: string, guestId: string) {
  try {
    // Extract the file ID from the URL
    // UploadThing URLs look like: https://utfs.io/f/file-id
    const fileId = fileUrl.split("/").pop()

    if (!fileId) {
      throw new Error("Invalid file URL")
    }

    // Calculate expiration time (2 hours from now)
    const expiresAt = new Date(Date.now() + COOKIE_EXPIRATION * 1000)

    // Add to the uploaded files list
    uploadedFiles.push({
      fileId,
      guestId,
      expiresAt,
    })

    // Schedule cleanup for this file
    scheduleFileCleanup(fileId, expiresAt)

    return { success: true }
  } catch (error) {
    console.error("Error registering uploaded file:", error)
    return { success: false, error: "Failed to register uploaded file" }
  }
}

/**
 * Schedule cleanup for a file after its expiration time
 */
function scheduleFileCleanup(fileId: string, expiresAt: Date) {
  const timeUntilExpiration = expiresAt.getTime() - Date.now()

  // Schedule deletion after the expiration time
  setTimeout(async () => {
    try {
      // Delete the file from UploadThing
      await utapi.deleteFiles(fileId)

      // Remove from the uploaded files list
      uploadedFiles = uploadedFiles.filter((file) => file.fileId !== fileId)

      console.log(`File ${fileId} deleted after expiration`)
    } catch (error) {
      console.error(`Error deleting expired file ${fileId}:`, error)
    }
  }, timeUntilExpiration)
}

/**
 * Clean up expired files
 */
export async function cleanupExpiredFiles() {
  const now = new Date()
  const expiredFiles = uploadedFiles.filter((file) => file.expiresAt <= now)

  for (const file of expiredFiles) {
    try {
      // Delete the file from UploadThing
      await utapi.deleteFiles(file.fileId)
      console.log(`Expired file ${file.fileId} deleted`)
    } catch (error) {
      console.error(`Error deleting expired file ${file.fileId}:`, error)
    }
  }

  // Update the uploaded files list
  uploadedFiles = uploadedFiles.filter((file) => file.expiresAt > now)

  return {
    success: true,
    deletedCount: expiredFiles.length,
  }
}

/**
 * Analyze an uploaded image with Gemini
 */
export async function analyzeUploadedImage(imageUrl: string, prompt: string, guestId: string) {
  try {
    // Register the uploaded file for cleanup
    await registerUploadedFile(imageUrl, guestId)

    // Analyze the image with Gemini
    const analysis = await analyzeImage(imageUrl, prompt)

    // Revalidate the homepage
    revalidatePath("/")

    return {
      success: true,
      imageUrl,
      analysis,
    }
  } catch (error) {
    console.error("Error analyzing image:", error)
    return {
      success: false,
      error: "Failed to analyze image",
    }
  }
}

/**
 * Upload image to UploadThing and analyze it with Gemini
 */
export async function uploadImage(file: File, prompt: string, guestId: string) {
  try {
    // Upload the image to UploadThing (replace with your actual upload logic)
    const formData = new FormData()
    formData.append("file", file)

    const uploadResponse = await fetch(`/api/uploadthing?guestId=${guestId}`, {
      method: "POST",
      body: formData,
    })

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status: ${uploadResponse.status}`)
    }

    const uploadData = await uploadResponse.json()

    if (!uploadData || !uploadData[0] || !uploadData[0].url) {
      throw new Error("Invalid upload response")
    }

    const imageUrl = uploadData[0].url

    // Analyze the uploaded image
    return await analyzeUploadedImage(imageUrl, prompt, guestId)
  } catch (error: any) {
    console.error("Error uploading and analyzing image:", error)
    return { error: error.message || "Failed to upload and analyze image" }
  }
}

/**
 * Set the guest cookie and redirect to the homepage
 */
export async function setGuestCookie(guestId: string) {
  // Set cookie with 2-hour expiration
  (await cookies()).set({
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