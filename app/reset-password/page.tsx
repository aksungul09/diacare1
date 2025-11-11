"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("✅ Password reset successful! Please log in again.")
      setTimeout(() => router.push("/login"), 2000)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Reset Your Password 🔐
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <p className="text-center text-sm mt-2 text-gray-500">
              Remembered your password?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Go to Login
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
