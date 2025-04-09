import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import { UploadThingUploader } from "@/components/uploadthing-uploader"
import { getGuestId, setGuestCookie } from "@/lib/cookies"

export default async function Home() {
  const cookieStore = cookies()
  const guestId = getGuestId(cookieStore)

  // If no guest ID exists, create one and redirect to set the cookie
  if (!guestId) {
    const newGuestId = uuidv4()
    return setGuestCookie(newGuestId)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-3xl items-center justify-between text-sm lg:flex">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">Meal Calorie Analyzer</h1>
          <p className="text-center mb-8 text-muted-foreground">
            Upload a photo of your meal to get an estimated calorie count and nutritional breakdown
          </p>

          <UploadThingUploader guestId={guestId} />
        </div>
      </div>
    </main>
  )
}
