"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import toast from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1) Quick check in `profiles` table (works if you create profile on signup)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", form.email)
        .maybeSingle()

      if (profileError) {
        console.error("profiles select error:", profileError)
        // show the real message instead of vague "something went wrong"
        toast.error(profileError.message || "Error checking account existence.")
        setLoading(false)
        return
      }

      let userExists = !!profileData

      // 2) If no profile row yet, try RPC that checks `auth.users`
      if (!userExists) {
        try {
          const { data: rpcResult, error: rpcError } = await supabase.rpc("check_user_exists", {
            email_input: form.email,
          })

          if (rpcError) {
            // surface RPC error (so you can debug/create the function)
            console.error("RPC check_user_exists error:", rpcError)
            toast.error(rpcError.message || "Error verifying account existence (RPC).")
            setLoading(false)
            return
          }

          // rpcResult expected to be boolean true/false
          userExists = !!rpcResult
        } catch (rpcCatchErr: any) {
          console.error("RPC exception:", rpcCatchErr)
          toast.error("Error verifying account existence. Check server logs.")
          setLoading(false)
          return
        }
      }

      // 3) If no account — be explicit and redirect to register
      if (!userExists) {
        toast("No account found with that email. Redirecting to registration...", { icon: "ℹ️" })
        setTimeout(() => router.push("/register"), 2000)
        setLoading(false)
        return
      }

      // 4) Try signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (signInError) {
        // give a clear message for wrong password
        const msg = signInError.message.toLowerCase()
        if (msg.includes("invalid login credentials") || msg.includes("invalid")) {
          toast.error("Incorrect password. Please try again or reset your password.")
        } else {
          toast.error(signInError.message)
        }
        setLoading(false)
        return
      }

      // 5) Success
      toast.success("Welcome back 👋")
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Unexpected login error:", err)
      toast.error(err?.message || "Unexpected error during login.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!form.email) {
      toast.error("Please enter your email first.")
      return
    }

    setResetting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("📩 Password reset email sent! Check your inbox.")
    }
    setResetting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Welcome Back to DiaCare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="flex items-center justify-between text-sm mt-2">
              <Link href="/register" className="text-blue-600 hover:underline">
                Create an account
              </Link>
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-blue-600 hover:underline disabled:opacity-50"
                disabled={resetting}
              >
                {resetting ? "Sending..." : "Forgot password?"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
