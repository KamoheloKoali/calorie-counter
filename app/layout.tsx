import type { Metadata } from "next";
import "./globals.css";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Meal Calorie Analyzer',
  description:
    'Analyze your meal by uploading an image and receiving a detailed nutritional breakdown including calorie estimates and macronutrients.',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons8-food-bar-30.png',
  },
  openGraph: {
    title: 'Meal Calorie Analyzer',
    description:
      'Upload a meal photo and get a detailed nutritional analysis including calorie range, ingredient breakdown and macronutrient details.',
    url: 'https://calorie-counter-sand.vercel.app', // Change this to your app’s domain
    siteName: 'Meal Calorie Analyzer',
    images: [
      {
        url: 'https://7amlok8wz8.ufs.sh/f/InZPXqSP6Sj43KTWoYG8HEnpeVlcyR8ZTAuWfDIjgiMrkCxU', // Update with your Open Graph image URL
        width: 800,
        height: 600,
        alt: 'Meal Calorie Analyzer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@YourTwitterHandle', // Update with your Twitter username
    creator: '@YourTwitterHandle',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={font.className}
      >
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
