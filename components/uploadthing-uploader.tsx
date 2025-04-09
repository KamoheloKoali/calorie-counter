"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { UploadDropzone } from "@/lib/uploadthing-client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AnalysisDrawer } from "@/components/analysis-drawer"
import { analyzeUploadedImage } from "@/lib/actions"

interface UploadThingUploaderProps {
  guestId: string
}

export function UploadThingUploader({ guestId }: UploadThingUploaderProps) {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUploadComplete = useCallback(async (res: { url: string }[]) => {
    try {
      if (res && res.length > 0) {
        setUploadedImageUrl(res[0].url)
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError("An error occurred during upload")
    }
  }, [])

  const handleAnalyze = async () => {
    if (!uploadedImageUrl) {
      setError("Please upload an image first")
      return
    }

    try {
      setIsAnalyzing(true)
      setError(null)

      // Analyze the uploaded image
      const result = await analyzeUploadedImage(uploadedImageUrl, prompt, guestId)

      if (result.error) {
        setError(result.error)
        return
      }

      setAnalysisResult(result)
      setIsDrawerOpen(true)

      // Reset form
      setUploadedImageUrl(null)
      setPrompt("")

      // Refresh the page to ensure we have the latest data
      router.refresh()
    } catch (err) {
      console.error("Analysis error:", err)
      setError("An error occurred during analysis. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Upload meal photo</Label>
              <UploadDropzone
                endpoint="mealImageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={(err) => {
                  setError(`Upload error: ${err.message}`)
                }}
                className="ut-button:bg-primary ut-button:ut-uploading:bg-primary/80 ut-label:text-muted-foreground"
              />
              {uploadedImageUrl && <p className="text-sm text-green-600">Image uploaded successfully!</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Additional details (optional)</Label>
              <Textarea
                id="prompt"
                placeholder="Add any details about the meal that might help with analysis..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none"
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button onClick={handleAnalyze} className="w-full" disabled={!uploadedImageUrl || isAnalyzing}>
              {isAnalyzing ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span> Analyzing...
                </span>
              ) : (
                <span>Analyze Calories</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnalysisDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} analysisResult={analysisResult} />
    </>
  )
}
