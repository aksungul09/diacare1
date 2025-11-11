import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">💙</span>
            <h1 className="text-2xl font-serif font-bold text-foreground">DiaCare</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
              Why DiaCare
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
              How It Works
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
              Our Story
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-md hover:-translate-y-0.5">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-md hover:-translate-y-0.5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 transition-all duration-300 hover:scale-105">
            AI-Powered Diabetes Management
          </Badge>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-balance mb-6 leading-tight transition-all duration-300 hover:scale-105">
            Take Control of Your
            <span className="text-primary"> Diabetes Diet</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed max-w-2xl mx-auto transition-all duration-300 hover:scale-102">
            Get personalized, AI-generated recipes tailored to your dietary restrictions, calorie needs, and diabetes
            management goals. Make healthy eating simple and delicious.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-0.5">
                Start Your Journey
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-0.5">
                Explore Features
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6 transition-all duration-300 hover:scale-102">
            Free to start • No credit card required • Trusted by hundreds
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4 transition-all duration-300 hover:scale-105">
              Discover What Makes DiaCare Different
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance transition-all duration-300 hover:scale-102">
              Comprehensive tools designed specifically for diabetes management and healthy living
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">👨‍🍳</span>
                <CardTitle className="text-xl">AI Recipe Generation</CardTitle>
                <CardDescription>
                  Get personalized recipes based on your dietary restrictions, preferences, and calorie goals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">📅</span>
                <CardTitle className="text-xl">Meal Planning</CardTitle>
                <CardDescription>
                  Plan your meals in advance with our intelligent scheduling system that considers your lifestyle
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">🛡️</span>
                <CardTitle className="text-xl">Diabetes-Safe</CardTitle>
                <CardDescription>
                  All recipes are carefully crafted to support healthy blood sugar levels and diabetes management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">👥</span>
                <CardTitle className="text-xl">Dietary Restrictions</CardTitle>
                <CardDescription>
                  Support for vegetarian, vegan, gluten-free, and other dietary needs without compromising taste
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">⚡</span>
                <CardTitle className="text-xl">Smart Nutrition</CardTitle>
                <CardDescription>
                  Automatic calorie counting and nutritional analysis to keep you on track with your health goals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">💙</span>
                <CardTitle className="text-xl">Health Tracking</CardTitle>
                <CardDescription>
                  Monitor your progress and see how your dietary choices impact your overall health and wellbeing
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4 transition-all duration-300 hover:scale-105">Simple Steps to Better Health</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance transition-all duration-300 hover:scale-102">
              Getting started with Diacare is easy and takes just a few minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Set Your Profile</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tell us about your dietary restrictions, calorie goals, and health preferences
              </p>
            </div>

            <div className="text-center transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Get AI Recipes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI generates personalized recipes that match your exact needs and taste preferences
              </p>
            </div>

            <div className="text-center transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Cook & Track</h3>
              <p className="text-muted-foreground leading-relaxed">
                Follow the recipes and track your progress as you build healthier eating habits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-serif font-bold mb-6 text-balance transition-all duration-300 hover:scale-105">
            Ready to Transform Your Diabetes Management?
          </h2>
          <p className="text-xl mb-8 opacity-90 text-balance leading-relaxed transition-all duration-300 hover:scale-102">
            Join hundreds of people who are already living healthier lives with Diacare's personalized approach to
            diabetes-friendly nutrition.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-0.5">
              Start Free Today
            </Button>
          </Link>
          <p className="text-sm mt-6 opacity-75 transition-all duration-300 hover:scale-102">
            No commitment required • Cancel anytime • Your health data stays private
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-gradient-to-t from-muted/30 to-background">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 mb-4 md:mb-0 transition-all duration-300 hover:scale-105">
            <span className="text-2xl animate-pulse">💙</span>
            <span className="text-lg font-serif font-semibold tracking-wide">DiaCare</span>
          </div>

          {/* Contact Button */}
          <a href="mailto:diacare-support@gmail.com" target="_blank" rel="noopener noreferrer">
            <button
              className="relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold 
              text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg 
              transition-all duration-300 hover:shadow-blue-300/50 hover:-translate-y-1 hover:scale-105 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ✉️ Contact Us
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 transition-opacity duration-300 hover:opacity-30"></span>
            </button>
          </a>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground transition-all duration-300 hover:scale-102">
          <p> © 2025 DiaCare. All rights reserved. Made with 💙 for your health.</p>
        </div>
      </footer>
    </div>
  )
}
