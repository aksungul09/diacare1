"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, ChefHat, Clock, Users, Zap, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function GenerateRecipePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null)
  const [formData, setFormData] = useState({
    calories: "",
    mealType: "",
    dietaryRestrictions: [] as string[],
    preferences: "",
    cookingTime: "",
    servings: "2",
  })

  const handleDietaryRestrictionChange = (restriction: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restriction],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        dietaryRestrictions: prev.dietaryRestrictions.filter((r) => r !== restriction),
      }))
    }
  }

  const handleGenerateRecipe = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate recipe")
      }

      const data = await response.json()
      setGeneratedRecipe(data.recipe)
    } catch (error) {
      console.error("Error generating recipe:", error)
      alert("Failed to generate recipe. Please check your API key and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-lg font-serif font-semibold">Diacare</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-primary" />
              Generate AI Recipe
            </h1>
            <p className="text-muted-foreground text-lg">
              Tell us your preferences and we'll create a personalized, diabetes-friendly recipe just for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recipe Form */}
            <Card>
              <CardHeader>
                <CardTitle>Recipe Preferences</CardTitle>
                <CardDescription>Customize your recipe based on your dietary needs and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calories">Target Calories</Label>
                    <Input
                      id="calories"
                      placeholder="e.g., 400"
                      value={formData.calories}
                      onChange={(e) => setFormData((prev) => ({ ...prev, calories: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Select
                      value={formData.servings}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, servings: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 serving</SelectItem>
                        <SelectItem value="2">2 servings</SelectItem>
                        <SelectItem value="4">4 servings</SelectItem>
                        <SelectItem value="6">6 servings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mealType">Meal Type</Label>
                    <Select
                      value={formData.mealType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, mealType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cookingTime">Max Cooking Time</Label>
                    <Select
                      value={formData.cookingTime}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, cookingTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Vegetarian",
                      "Vegan",
                      "Gluten-free",
                      "Dairy-free",
                      "Low-carb",
                      "Keto",
                      "Mediterranean",
                      "Heart-healthy",
                    ].map((restriction) => (
                      <div key={restriction} className="flex items-center space-x-2">
                        <Checkbox
                          id={restriction}
                          checked={formData.dietaryRestrictions.includes(restriction)}
                          onCheckedChange={(checked) => handleDietaryRestrictionChange(restriction, checked as boolean)}
                        />
                        <Label htmlFor={restriction} className="text-sm">
                          {restriction}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferences">Additional Preferences</Label>
                  <Textarea
                    id="preferences"
                    placeholder="Any specific ingredients you love or want to avoid? Cooking methods you prefer?"
                    value={formData.preferences}
                    onChange={(e) => setFormData((prev) => ({ ...prev, preferences: e.target.value }))}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleGenerateRecipe}
                  disabled={isGenerating || !formData.calories || !formData.mealType}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Recipe...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Recipe
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Recipe */}
            <div className="space-y-6">
              {isGenerating && (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Creating Your Perfect Recipe</h3>
                      <p className="text-muted-foreground">
                        Our AI is analyzing your preferences and generating a diabetes-friendly recipe...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {generatedRecipe && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{generatedRecipe.title}</CardTitle>
                        <CardDescription className="text-base">{generatedRecipe.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        {generatedRecipe.glycemicIndex} GI
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {generatedRecipe.prepTime} prep + {generatedRecipe.cookTime} cook
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {generatedRecipe.servings} servings
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Nutrition Info */}
                    <div>
                      <h4 className="font-semibold mb-3">Nutrition per serving</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-primary">{generatedRecipe.calories}</div>
                          <div className="text-xs text-muted-foreground">Calories</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold">{generatedRecipe.carbs}</div>
                          <div className="text-xs text-muted-foreground">Carbs</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold">{generatedRecipe.protein}</div>
                          <div className="text-xs text-muted-foreground">Protein</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold">{generatedRecipe.fiber}</div>
                          <div className="text-xs text-muted-foreground">Fiber</div>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                      <h4 className="font-semibold mb-3">Ingredients</h4>
                      <ul className="space-y-2">
                        {generatedRecipe.ingredients.map((ingredient: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h4 className="font-semibold mb-3">Instructions</h4>
                      <ol className="space-y-3">
                        {generatedRecipe.instructions.map((instruction: string, index: number) => (
                          <li key={index} className="flex gap-3 text-sm">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="leading-relaxed">{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Health Notes */}
                    <div>
                      <h4 className="font-semibold mb-3">Health Benefits</h4>
                      <ul className="space-y-2">
                        {generatedRecipe.nutritionNotes.map((note: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1">Save Recipe</Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Add to Meal Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!generatedRecipe && !isGenerating && (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                      <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Fill out your preferences and click "Generate Recipe" to get started!</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
