import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { getGuestId } from "@/lib/cookies";
import { cookies } from "next/headers";

// Create a new UploadThing instance
export const uploadthing = createUploadthing();

// Create a new UploadThing API instance for server-side operations
export const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_SECRET,
  fetch: globalThis.fetch,
});

// Define the file router
export const ourFileRouter = {
  // Define an uploader for meal images
  mealImageUploader: uploadthing({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set the middleware to run before the upload
    .middleware(async () => {
      // Get the guest ID from cookies
      const guestId = getGuestId();

      // Check if the user has a guest ID
      if (!guestId) {
        throw new UploadThingError("Unauthorized");
      }

      // Return the guest ID to be used in the onUploadComplete callback
      return { guestId };
    })
    // Define what happens after the upload is complete
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for guestId:", metadata.guestId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      const guestId = await metadata.guestId;

      return {
        uploadedBy: guestId ?? null, // ensure it's JSON-safe (not `undefined`)
      };
    }),
} satisfies FileRouter;

// Export type for client-side usage
export type OurFileRouter = typeof ourFileRouter;
