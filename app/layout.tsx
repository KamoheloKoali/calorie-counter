import type { Metadata } from "next";
import "./globals.css";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { DM_Sans } from "next/font/google";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata = {
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
    url: 'https://yourdomain.com', // Change this to your app’s domain
    siteName: 'Meal Calorie Analyzer',
    images: [
      {
        url: 'https://yourdomain.com/og-image.png', // Update with your Open Graph image URL
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
      </body>
    </html>
  );
}
