"use server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

/**
 * Create a prompt for Gemini to analyze a food image
 */
function createFoodAnalysisPrompt(userPrompt = "") {
  let basePrompt = `
    You are a nutrition expert. Analyze the meal in this image and provide a detailed breakdown of its ingredients along with the approximate calorie count for each. Return a summary with the total estimated calories and nutritional details.
  `

  if (userPrompt) {
    basePrompt += `\n\nAdditional context from the user: ${userPrompt}`
  }

  return basePrompt
}

/**
 * Parse the Gemini response into a structured format
 */
function parseGeminiResponse(text: string) {
  // Extract ingredients and their calorie counts
  const ingredients: { name: string; calories: string; details?: string }[] = []
  let totalCalories = "Unknown"
  let nutritionalInfo = ""
  let additionalNotes = ""

  // Extract total calories (common formats)
  const totalCaloriesMatch = text.match(
    /total\s*(?:estimated)?\s*calories?:?\s*(?:approximately|approx\.?|about|~)?\s*(\d{1,4}(?:[,-]\d{3})*(?:\.\d+)?)\s*(?:kcal|calories)/i,
  )
  if (totalCaloriesMatch) {
    totalCalories = `${totalCaloriesMatch[1]} kcal`
  }

  // Extract ingredients with calories
  const lines = text.split("\n")
  for (const line of lines) {
    // Look for lines with ingredient and calorie information
    const ingredientMatch = line.match(
      /^[-*•]?\s*([^:]+)(?::|\s-\s|\s–\s)?\s*(?:approximately|approx\.?|about|~)?\s*(\d{1,4}(?:\.\d+)?)\s*(?:kcal|calories)/i,
    )
    if (ingredientMatch) {
      const name = ingredientMatch[1].trim()
      const calories = `${ingredientMatch[2]} kcal`
      ingredients.push({ name, calories })
    }
  }

  // Extract nutritional information section
  const nutritionalInfoMatch = text.match(
    /nutritional\s*(?:information|breakdown|profile|content):(.*?)(?:\n\n|\n[A-Z]|$)/is,
  )
  if (nutritionalInfoMatch) {
    nutritionalInfo = nutritionalInfoMatch[1].trim()
  }

  // Extract any additional notes
  const additionalNotesMatch = text.match(/(?:additional\s*notes|note|disclaimer):(.*?)(?:\n\n|$)/is)
  if (additionalNotesMatch) {
    additionalNotes = additionalNotesMatch[1].trim()
  }

  return {
    totalCalories,
    ingredients,
    nutritionalInfo,
    additionalNotes,
    rawText: text,
  }
}

/**
 * Analyze a food image using Gemini
 */
export async function analyzeImage(imageUrl: string, userPrompt = "") {
  try {
    // Create the prompt for Gemini
    const prompt = createFoodAnalysisPrompt(userPrompt)

    // Fetch the image as a blob
    const imageResponse = await fetch(imageUrl).then((response) => response.arrayBuffer());
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

    const response = result.response
    const text = response.text()

    // Parse the response
    const parsedResponse = parseGeminiResponse(text)
    console.log(parsedResponse)

    return parsedResponse
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error)
    throw new Error("Failed to analyze image")
  }
}
