"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

/**
 * Create a prompt for Gemini to analyze a food image
 */
function createFoodAnalysisPrompt(userPrompt = "") {
  const structure = {
    mealAnalysis: {
      description: "A description of the overall meal.",
      ingredients: [
        {
          ingredient: "Ingredient name (string)",
          estimatedCalories: "A number representing calorie estimate",
          estimatedQuantity: "A string representing the estimated quantity",
          notes: "Additional details about the ingredient (string, optional)",
        },
      ],
      totalEstimatedCalories: "A string representing the total calorie range (e.g., '650-830')",
      overallAssessment: "Summary of nutritional considerations",
    },
  };

  let basePrompt = `
  You are a nutrition expert. Analyze the meal in the image and provide a detailed breakdown of its ingredients along with the approximate calorie count for each ingredient. Return ONLY valid JSON with EXACTLY the following format (do not change any property names, do not add extra keys, and do not include any additional text): ${structure} 
  Ensure that:
1. The top-level object contains a single property "mealAnalysis".
2. Within "mealAnalysis", use exactly the property names: "description", "ingredients", "totalEstimatedCalories", and "overallAssessment".
3. The "ingredients" array should contain objects with the properties: "ingredient", "estimatedQuantity", "estimatedCalories", and "notes".
4. The property "totalEstimatedCalories" for each ingredient MUST be a string specifying a range (e.g., "200-250") with no additional text like "kcal" or units.
4. Do not include any markdown code fences (i.e. no backticks) or any text besides the JSON.`;

  if (userPrompt) {
    basePrompt += `\n\nAdditional context from the user: ${userPrompt}`;
  }

  return basePrompt;
}

/**
 * Parse the Gemini response into a structured format
 */
interface Ingredient {
  name: string;
  calories: string;
  details?: string;
}

interface ParsedGeminiResponse {
  ingredients: Ingredient[];
  totalCalories: string;
  nutritionalInfo: string;
  additionalNotes: string;
}

function parseGeminiResponse(text: string): ParsedGeminiResponse {
  // Remove markdown code fences (``` or ```json)
  const jsonText = text
    .replace(/^```(json)?\s*/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(jsonText);

    // Validate that mealAnalysis exists
    const mealAnalysis = parsed.mealAnalysis;
    if (!mealAnalysis) {
      throw new Error("Missing 'mealAnalysis' field in JSON.");
    }

    // Map each ingredient from Gemini's ingredients array
    const ingredients: Ingredient[] = (mealAnalysis.ingredients || []).map(
      (item: any) => ({
        name: item.name || item.ingredient,
        calories:
          typeof item.estimatedCalories === "number"
            ? `${item.estimatedCalories} calories`
            : `${item.estimatedCalories} calories`,
        details: item.notes || "",
      })
    );

    // Process total estimated calories
    const totalCalories = mealAnalysis.totalEstimatedCalories
      ? `${mealAnalysis.totalEstimatedCalories} calories`
      : "Unknown";

    // Use overallAssessment as nutritional information, and description as additional notes.
    const nutritionalInfo = mealAnalysis.overallAssessment || "";
    const additionalNotes = mealAnalysis.description || "";

    return { ingredients, totalCalories, nutritionalInfo, additionalNotes };
  } catch (err) {
    console.error("Error parsing Gemini response:", err);
    return {
      ingredients: [],
      totalCalories: "Unknown",
      nutritionalInfo: "",
      additionalNotes: "could not parse response from gemini",
    };
  }
}

/**
 * Analyze a food image using Gemini
 */
export async function analyzeImage(imageUrl: string, userPrompt = "") {
  try {
    // Create the prompt for Gemini
    const prompt = createFoodAnalysisPrompt(userPrompt);

    // Fetch the image as a blob
    const imageResponse = await fetch(imageUrl).then((response) =>
      response.arrayBuffer()
    );
    // const imageBlob = await imageResponse.blob()

    // // Convert blob to base64
    // const imageBase64 = await new Promise<string>((resolve) => {
    //   const reader = new FileReader()
    //   reader.onloadend = () => resolve(reader.result as string)
    //   reader.readAsDataURL(imageBlob)
    // })

    // // Extract the base64 data (remove the data:image/jpeg;base64, part)
    // const base64Data = imageBase64.split(",")[1]

    // // Call Gemini API with the image
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // const result = await model.generateContent([
    //   prompt,
    //   {
    //     inlineData: {
    //       mimeType: imageBlob.type,
    //       data: base64Data,
    //     },
    //   },
    // ])

    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(imageResponse).toString("base64"),
          mimeType: "image/jpeg",
        },
      },
      prompt,
    ]);

    const response = result.response;
    const text = response.text();
    console.log("raw: ", text);

    // Parse the response
    const parsedResponse = parseGeminiResponse(text);
    console.log(parsedResponse);

    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("Failed to analyze image");
  }
}
