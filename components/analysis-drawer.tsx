"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { X } from "lucide-react";

interface AnalysisDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  analysisResult: any;
}

export function AnalysisDrawer({
  isOpen,
  setIsOpen,
  analysisResult,
}: AnalysisDrawerProps) {
  const [formattedResult, setFormattedResult] = useState<any>(null);

  useEffect(() => {
    if (analysisResult) {
      try {
        // Format the analysis result for display
        const formatted = formatAnalysisResult(analysisResult);
        setFormattedResult(formatted);
      } catch (error) {
        console.error("Error formatting analysis result:", error);
      }
    }
  }, [analysisResult]);

  if (!analysisResult && isOpen) return toast.error("No analysis available");

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="max-h-[90vh] mb-4">
        <DrawerHeader>
          <DrawerTitle className="text-2xl flex justify-between">
            Meal Analysis Results
            <DrawerClose asChild>
              <Button className="cursor-pointer" size="icon">
                <X className="h- w-5" />
              </Button>
            </DrawerClose>
          </DrawerTitle>
          <DrawerDescription>
            Nutritional breakdown and calorie estimate for your meal
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="px-4 py-2 max-h-[40vh] lg:max-h-full ">
          {formattedResult ? (
            <div className="space-y-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Total Calories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {formattedResult.totalCalories}
                  </p>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                <div className="space-y-3">
                  {formattedResult.ingredients.map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.details && (
                            <p className="text-sm text-muted-foreground">
                              {item.details}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">{item.calories}</Badge>
                      </div>
                    )
                  )}
                </div>
              </div>

              {formattedResult.nutritionalInfo && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Nutritional Information
                  </h3>
                  <p className="text-sm">{formattedResult.nutritionalInfo}</p>
                </div>
              )}

              {/* {formattedResult.additionalNotes && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
                  <p className="text-sm">{formattedResult.additionalNotes}</p>
                </div>
              )} */}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p>Processing analysis results...</p>
            </div>
          )}
        </ScrollArea>

        <DrawerFooter className="border">
          <DrawerClose asChild>
            <Button className="cursor-pointer ">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function formatAnalysisResult(result: any) {
  // Extract the analysis from the Gemini response
  const analysis = result.analysis || {};

  // Format the result for display
  return {
    totalCalories: analysis.totalCalories || "N/A",
    ingredients: analysis.ingredients || [],
    nutritionalInfo: analysis.nutritionalInfo || null,
    additionalNotes: analysis.additionalNotes || null,
  };
}
