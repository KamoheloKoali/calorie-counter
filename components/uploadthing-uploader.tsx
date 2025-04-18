"use client";

import { analyzeUploadedImage } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { AnalysisDrawer } from "./analysis-drawer";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

interface UploadThingUploaderProps {
  guestId: string;
}

export default function UploadThingUploader({
  guestId,
}: UploadThingUploaderProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = useCallback(async (res: { url: string }[]) => {
    try {
      if (res && res.length > 0) {
        setUploadedImageUrl(res[0].url);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("An error occurred during upload");
    }
  }, []);

  const handleAnalyze = async () => {
    if (!uploadedImageUrl) {
      setError("Please upload an image first");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Analyze the uploaded image
      const result = await analyzeUploadedImage(
        uploadedImageUrl,
        prompt,
        guestId
      );

      if (result.error) {
        setError(result.error);
        return;
      }

      // console.log("result: ", result);

      setAnalysisResult(result);
      setIsDrawerOpen(true);

      // Reset form
      // setUploadedImageUrl(null);
      setPrompt("");

      // Refresh the page to ensure we have the latest data
      // router.refresh();
    } catch (err) {
      console.error("Analysis error:", err);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  // console.log("imageUrl: ", uploadedImageUrl);

  return (
    <>
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              {uploadedImageUrl ? (
                <>
                  <div className="w-full flex justify-center">
                    <Image
                      src={uploadedImageUrl || "/placeholder.svg"}
                      style={{ objectFit: "cover" }}
                      height={300}
                      width={400}
                      alt="uploaded image"
                      className="rounded-md"
                      placeholder="blur"
                      blurDataURL="/placeholder.svg"
                    />
                  </div>
                  {/* <p className="text-sm text-green-600">
                  Image uploaded successfully!
                </p> */}
                  <Button
                    onClick={() => setUploadedImageUrl(null)}
                    className="cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    Remove Image
                  </Button>
                </>
              ) : (
                <>
                  {" "}
                  <Label>Upload meal photo</Label>
                  <UploadDropzone
                    endpoint="mealImageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={(err: any) => {
                      setError(`Upload error: ${err.message}`);
                    }}
                    className="ut-button:bg-red-500 ut-button:ut-uploading:bg-red-500/80 ut-label:text-muted-foreground"
                  />
                </>
              )}
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

            <Button
              onClick={handleAnalyze}
              className="w-full cursor-pointer"
              disabled={!uploadedImageUrl || isAnalyzing}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span> Analyzing...
                </span>
              ) : (
                <span>Analyze Calories</span>
              )}
            </Button>
            {analysisResult && (
              <Button
                onClick={()=> setIsDrawerOpen(true)}
                className="w-full cursor-pointer"
                variant="outline"
              >
                  <span>Show Analysis</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AnalysisDrawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        analysisResult={analysisResult}
      />
    </>
  );
}
