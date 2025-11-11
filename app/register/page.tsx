"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import Confetti from "react-confetti"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
    activityLevel: "",
  })
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  // 🎉 Handle confetti size on resize
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1️⃣ Create user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, username: form.username },
        },
      })

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes("already registered")) {
          toast("This email is already registered. Redirecting to login...", { icon: "ℹ️" })
          setTimeout(() => router.push("/login"), 2500)
        } else toast.error(signUpError.message)
        return
      }

      const user = data?.user
      if (!user) {
        toast.error("Unexpected: No user data returned. Try again.")
        return
      }

      // 2️⃣ Wait for Supabase to initialize the session
      await new Promise((res) => setTimeout(res, 800))

      // 3️⃣ Insert or update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            username: form.username,
            name: form.name,
            email: form.email,
            phone: form.phone,
            age: form.age,
            weight: form.weight,
            height: form.height,
            sex: form.sex,
            activitylevel: form.activitylevel,
          },
          { onConflict: "id" }
        )

      if (profileError) {
        console.error("Profile insert error:", profileError)
        toast.error("Could not save your profile. Please try again.")
        return
      }

      // 4️⃣ Optional welcome email (Edge Function)
      try {
        await fetch("https://dzwewqwcotfqwcidtsyy.supabase.co/functions/v1/super-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, name: form.name }),
        })
      } catch {
        console.warn("Welcome email skipped (Edge Function not deployed).")
      }

      // 5️⃣ Success
      setShowConfetti(true)
      toast.success("🎉 Welcome to DiaCare! Your account was created successfully.")
      setTimeout(() => {
        setShowConfetti(false)
        router.push("/dashboard")
      }, 3000)
    } catch (err: any) {
      console.error("Registration error:", err)
      toast.error(err?.message || "Unexpected error during registration.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={300}
          gravity={0.25}
          wind={0.01}
          recycle={false}
        />
      )}

      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        </div>
      )}

      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white relative z-10">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Create Your DiaCare Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Username</Label>
              <Input name="username" value={form.username} onChange={handleInputChange} required />
            </div>

            <div>
              <Label>Full Name</Label>
              <Input name="name" value={form.name} onChange={handleInputChange} required />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" name="email" value={form.email} onChange={handleInputChange} required />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="+998 90 123 45 67"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age</Label>
                <Input name="age" type="number" value={form.age} onChange={handleInputChange} required />
              </div>

              {/* 🧍 Sex Dropdown (now visible) */}
              <div>
                <Label>Sex</Label>
                <Select
                  value={form.sex}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, sex: value }))}>
                  <SelectTrigger className="border border-gray-300 bg-white text-gray-800 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none z-20">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white shadow-md border border-gray-200">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Weight (kg)</Label>
                <Input name="weight" type="number" value={form.weight} onChange={handleInputChange} required />
              </div>
              <div>
                <Label>Height (cm)</Label>
                <Input name="height" type="number" value={form.height} onChange={handleInputChange} required />
              </div>
            </div>

            {/* 🏃 Activity Level (now visible + corrected name) */}
            <div>
              <Label>Activity Level</Label>
              <Select
                value={form.activityLevel}
                onValueChange={(value) => setForm((prev) => ({ ...prev, activityLevel: value }))}>
                <SelectTrigger className="border border-gray-300 bg-white text-gray-800 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none z-20">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white shadow-md border border-gray-200">
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (1–3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3–5 days/week)</SelectItem>
                  <SelectItem value="active">Active (6–7 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (hard exercise/job)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-medium hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
