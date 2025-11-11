import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"



export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { calories, mealType, dietaryRestrictions, preferences, cookingTime, servings } = body

    console.log("[v0] OpenAI API Key exists:", !!process.env.OPENAI_API_KEY)
    console.log("[v0] OpenAI API Key length:", process.env.OPENAI_API_KEY?.length || 0)

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "API key not configured. Please add your OPENAI_API_KEY to the environment variables.",
          instructions: "Get your API key from https://platform.openai.com/api-keys",
        },
        { status: 500 },
      )
    }
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    
    const prompt = `Create a diabetes-friendly ${mealType} recipe with the following requirements:
- Target calories: ${calories} per serving
- Servings: ${servings}
- Maximum cooking time: ${cookingTime} minutes
- Dietary restrictions: ${dietaryRestrictions.join(", ") || "None"}
- Additional preferences: ${preferences || "None"}

Please provide a detailed recipe in JSON format with the following structure:
{
  "title": "Recipe name",
  "description": "Brief description",
  "prepTime": "X minutes",
  "cookTime": "X minutes",
  "servings": "${servings}",
  "calories": "X per serving",
  "carbs": "Xg",
  "protein": "Xg",
  "fat": "Xg",
  "fiber": "Xg",
  "glycemicIndex": "Low/Medium/High",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "nutritionNotes": ["benefit 1", "benefit 2", ...]
}

Focus on diabetes-friendly ingredients with low glycemic index, high fiber, and balanced macronutrients.
Return only valid JSON — no extra explanations or markdown formatting.`

    console.log("[v0] Sending prompt to OpenAI...")

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4o" if you have access
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and chef specializing in diabetes-friendly meals.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    console.log("[v0] OpenAI API response received successfully")

    const recipeText = response.choices?.[0]?.message?.content || "{}"
    let recipe

    try {
      const jsonMatch = recipeText.match(/\{[\s\S]*\}/)
      recipe = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(recipeText)
    } catch (parseError) {
      console.error("[v0] Failed to parse recipe JSON:", parseError)
      recipe = {
        title: "Custom Diabetes-Friendly Recipe",
        description: "A personalized recipe created based on your preferences",
        prepTime: "15 minutes",
        cookTime: cookingTime || "20 minutes",
        servings,
        calories: `${calories} per serving`,
        carbs: "30g",
        protein: "20g",
        fat: "10g",
        fiber: "8g",
        glycemicIndex: "Low",
        ingredients: ["Please check the raw response for ingredients"],
        instructions: ["Please check the raw response for instructions"],
        nutritionNotes: ["Diabetes-friendly recipe", "Balanced macronutrients"],
        rawResponse: recipeText,
      }
    }

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error("[v0] Recipe generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate recipe. Please check your API key and try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
