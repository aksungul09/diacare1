import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      calories,
      mealType,
      dietaryRestrictions = [],
      preferences = "",
      cookingTime = 30,
      servings = 1,
      bmr,
      dailyCalories,
    } = body

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OpenAI API key not configured.",
          instructions: "Add your OPENAI_API_KEY to the environment variables.",
        },
        { status: 500 },
      )
    }

    const openai = new OpenAI({ apiKey })

    // 🧠 Enhanced, smarter diabetes nutrition prompt
    const prompt = `
You are a certified nutritionist and professional chef specializing in diabetes management.
Generate a personalized ${mealType} recipe for someone with diabetes.

Here’s the user’s data:
- Basal Metabolic Rate (BMR): ${bmr || "unknown"}
- Daily Calorie Needs: ${dailyCalories || "unknown"}
- Target Calories per Serving: ${calories || "not specified"}
- Servings: ${servings}
- Max Cooking Time: ${cookingTime} minutes
- Dietary Restrictions: ${dietaryRestrictions.join(", ") || "None"}
- Preferences: ${preferences || "None"}

Requirements:
- Use low-glycemic ingredients only.
- Balance macronutrients: moderate carbs, lean proteins, healthy fats.
- Estimate realistic nutrition data (calories, carbs, protein, fat, fiber) based on portion size.
- Avoid sugary sauces or refined carbs.
- Include at least one nutrition tip for diabetes care.

Return **only valid JSON** strictly in this format:
{
  "title": "Recipe name",
  "description": "Short summary of the dish",
  "prepTime": "X minutes",
  "cookTime": "X minutes",
  "servings": "${servings}",
  "calories": "X kcal per serving",
  "carbs": "X g",
  "protein": "X g",
  "fat": "X g",
  "fiber": "X g",
  "glycemicIndex": "Low/Medium/High",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "nutritionNotes": ["tip 1", "tip 2", ...]
}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional nutritionist generating diabetes-friendly recipes. Respond only with JSON. Never include explanations or text outside JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.65,
      max_tokens: 1200,
    })

    const recipeText = response.choices[0]?.message?.content || "{}"
    let recipe

    try {
      // Extract and safely parse JSON from model response
      const jsonMatch = recipeText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        recipe = JSON.parse(jsonMatch[0])
      } else {
        recipe = JSON.parse(recipeText)
      }
    } catch (error) {
      console.error("[Recipe Parse Error]", error)
      recipe = {
        title: "Custom Diabetes-Friendly Recipe",
        description: "A personalized diabetes-safe recipe (AI output unreadable).",
        prepTime: "Data unavailable – check AI response",
        cookTime: "Data unavailable – check AI response",
        servings,
        calories: "Data unavailable – check AI response",
        carbs: "Data unavailable – check AI response",
        protein: "Data unavailable – check AI response",
        fat: "Data unavailable – check AI response",
        fiber: "Data unavailable – check AI response",
        glycemicIndex: "Unknown",
        ingredients: ["Could not retrieve ingredients – please retry"],
        instructions: ["Could not retrieve instructions – please retry"],
        nutritionNotes: ["AI output unreadable", "Please try again"],
        rawResponse: recipeText,
      }
    }

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error("[Recipe generation error]", error)
    return NextResponse.json(
      {
        error: "Failed to generate recipe. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
