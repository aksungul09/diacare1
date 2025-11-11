"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, ChefHat, Calendar, TrendingUp, Target, Clock, Plus, BookOpen } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

// --- Helper Functions ---
function calculateBMR(sex: string, weight: number, height: number, age: number) {
  return sex === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>({
    username: "",
    name: "",
    email: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
  })

  const [savedRecipes, setSavedRecipes] = useState<any[]>([])
  const [mealPlan, setMealPlan] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.error("Session error:", sessionError.message)
        setLoading(false)
        return
      }

      if (!session) {
        console.log("No user logged in")
        setLoading(false)
        return
      }

      // Fetch user profile from "profiles" table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (profileError) console.error("Profile fetch error:", profileError.message)
      else setUser(profileData)

      // Fetch saved recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", session.user.id)

      if (recipesError) console.error("Recipes fetch error:", recipesError.message)
      else setSavedRecipes(recipesData || [])

      // Fetch meal plan
      const { data: mealPlanData, error: mealPlanError } = await supabase
        .from("meal_plan")
        .select("*")
        .eq("user_id", session.user.id)

      if (mealPlanError) console.error("Meal Plan fetch error:", mealPlanError.message)
      else setMealPlan(mealPlanData || [])

      setLoading(false)
    }

    fetchData()
  }, [])

  // Health goals calculation
  const bmr =
    user.weight && user.height && user.age
      ? calculateBMR(user.sex, +user.weight, +user.height, +user.age)
      : 0
  const dailyCalories = Math.round(bmr * 1.55)
  const todayCalories = mealPlan.reduce((total, r) => total + (+r.calories || 0), 0)

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-serif font-bold text-foreground">DiaCare</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-primary font-medium">Dashboard</Link>
            <Link href="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">Recipes</Link>
            <Link href="/meal-plan" className="text-muted-foreground hover:text-foreground transition-colors">Meal Plan</Link>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">Settings</Button>
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              {user.name ? user.name[0] : "U"}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground text-lg">Manage your diabetes-friendly meals and track your progress.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/recipe-generation">
            <Button size="lg" className="h-16 text-left justify-start gap-3 w-full">
              <Plus className="h-5 w-7" />
              <div>
                <div className="font-semibold">Generate Recipe</div>
                <div className="text-sm opacity-100">Get AI-powered suggestions</div>
              </div>
            </Button>
          </Link>

          <Link href="/meal-plan">
            <Button variant="outline" size="lg" className="h-16 text-left justify-start gap-3 bg-transparent w-full">
              <Calendar className="h-5 w-5" />
              <div>
                <div className="font-semibold">Plan Meals</div>
                <div className="text-sm text-muted-foreground">Schedule your week</div>
              </div>
            </Button>
          </Link>

          <Link href="/recipes-library">
            <Button variant="outline" size="lg" className="h-16 text-left justify-start gap-3 bg-transparent w-full">
              <BookOpen className="h-5 w-5" />
              <div>
                <div className="font-semibold">Recipe Library</div>
                <div className="text-sm text-muted-foreground">Browse saved recipes</div>
              </div>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Recipes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" /> Recent Recipes
                </CardTitle>
                <CardDescription>Your latest saved meal suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedRecipes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No saved recipes yet. Generate one!</p>
                  ) : (
                    savedRecipes.map((recipe, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <ChefHat className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{recipe.title}</h4>
                          <p className="text-sm text-muted-foreground">{recipe.calories} calories • {recipe.glycemicIndex} GI</p>
                          <div className="flex gap-2 mt-2">
                            {recipe.tags?.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View Recipe</Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Health Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Daily Calories</span>
                    <span className="text-muted-foreground">{todayCalories} / {dailyCalories}</span>
                  </div>
                  <Progress value={Math.min(100, (todayCalories / dailyCalories) * 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Recipes Saved</span>
                    <Badge variant="secondary">{savedRecipes.length} this week</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Meals Planned</span>
                    <Badge variant="secondary">{mealPlan.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Goal Achievement</span>
                    <Badge variant="secondary">{Math.min(100, (todayCalories / dailyCalories) * 100)}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Upcoming Meals</CardTitle>
              </CardHeader>
              <CardContent>
                {mealPlan.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <p>No upcoming meals</p>
                    <Link href="/recipe-generation">
                      <Button size="sm">Generate Recipe</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mealPlan.map((meal, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{meal.mealType}</div>
                          <div className="text-xs text-muted-foreground">{meal.title}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{meal.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
