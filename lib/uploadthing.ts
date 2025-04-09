import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UTApi } from "uploadthing/server"
import { getGuestId } from "@/lib/cookies"
import { cookies } from "next/headers"

// Create a new UploadThing instance
export const uploadthing = createUploadthing()

// Create a new UploadThing API instance for server-side operations
export const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_SECRET,
  fetch: globalThis.fetch,
})

// Define the file router
export const ourFileRouter = {
  // Define an uploader for meal images
  mealImageUploader: uploadthing({ image: { maxFileSize: "5MB" } })
    // Set the middleware to run before the upload
    .middleware(async () => {
      // Get the guest ID from cookies
      const guestId = getGuestId(cookies())

      // Check if the user has a guest ID
      if (!guestId) {
        throw new Error("Unauthorized: No guest ID found")
      }

      // Return the guest ID to be used in the onUploadComplete callback
      return { guestId }
    })
    // Define what happens after the upload is complete
    .onUploadComplete(async ({ metadata, file }) => {
      // Return the file URL and metadata
      return { uploadedBy: metadata.guestId, url: file.url }
    }),
} satisfies FileRouter

// Export type for client-side usage
export type OurFileRouter = typeof ourFileRouter
