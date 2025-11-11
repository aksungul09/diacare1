import type React from "react"
import type { Metadata } from "next"
import { Inter, Work_Sans } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "react-hot-toast"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Diacare - Diabetes Diet Management",
  description:
    "AI-powered diabetes diet management app that creates personalized recipes based on your dietary restrictions and calorie needs.",
  generator: "DiaCare",
  keywords: ["diabetes", "diet", "nutrition", "AI", "recipes", "health"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} ${workSans.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Toaster position="top-right" />
        </Suspense>
      </body>
    </html>
  )
}
