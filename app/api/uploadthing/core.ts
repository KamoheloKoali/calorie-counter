import { getGuestId } from "@/lib/cookies";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  mealImageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "128MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Get the guest ID from cookies
      const guestId = getGuestId();

      // Check if the user has a guest ID
      if (!guestId) {
        throw new UploadThingError("Unauthorized");
      }

      // Return the guest ID to be used in the onUploadComplete callback
      return { guestId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for guestId:", metadata.guestId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      const guestId = await metadata.guestId;

      return {
        uploadedBy: guestId ?? null, // ensure it's JSON-safe (not `undefined`)
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
