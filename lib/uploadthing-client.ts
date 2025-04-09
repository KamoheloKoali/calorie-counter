"use client"

import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"

// Generate the UploadThing components for client-side usage
export const { useUploadThing, uploadFiles, UploadButton, UploadDropzone, Uploader } =
  generateReactHelpers<OurFileRouter>()
