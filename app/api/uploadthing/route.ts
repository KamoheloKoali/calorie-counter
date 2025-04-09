import { createNextRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "@/lib/uploadthing"

// Create and export the route handler
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
})
