
import UploadThingUploader from "@/components/uploadthing-uploader";
import { getGuestId } from "@/lib/cookies";
import { redirect } from "next/navigation";


export default async function Home() {
  const guestId = await getGuestId()

  // If no guest ID exists, create one and redirect to set the cookie
  if (!guestId) {
    redirect("/api/set-guest-cookie")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 ">
      <div className="z-10 w-full md:max-w-3xl items-center justify-between text-sm lg:flex">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">Meal Calorie Analyzer</h1>
          <p className="text-center mb-8 text-muted-foreground">
            Upload a photo of your meal to get an estimated calorie count and nutritional breakdown
          </p>

          <UploadThingUploader guestId={guestId} />
        </div>
      </div>
    </main>
  );
}
