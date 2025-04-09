import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/lib/uploadthing"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";


export const metadata: Metadata = {
  title: "Meal Calorie Analyzer",
  description: "Upload a photo of your meal to get an estimated calorie count",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
      <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        {children}</body>
    </html>
  )
}
