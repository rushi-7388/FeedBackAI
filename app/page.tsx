'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Brain, BarChart3, Lock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded bg-primary p-2">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">FeedbackAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/feedback">
              <Button variant="ghost" size="sm">
                Submit Feedback
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="sm">Admin Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto max-w-5xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Hero Text */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                Transform Student Feedback into Actionable Insights
              </h1>
              <p className="text-pretty text-lg text-muted-foreground">
                Harness the power of AI to understand, categorize, and prioritize student concerns. Make data-driven decisions that improve the campus experience.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/feedback" className="w-full sm:w-auto">
                <Button size="lg" className="w-full">
                  Submit Feedback <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/admin/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  Admin Portal
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              ✓ Anonymous submissions · ✓ Real-time analysis · ✓ No login required
            </p>
          </div>

          {/* Right: Features Preview */}
          <div className="space-y-4">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
              <div className="flex gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic categorization and sentiment analysis
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 p-6">
              <div className="flex gap-4">
                <div className="rounded-lg bg-accent/10 p-3">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Smart Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualize trends and prioritize issues
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
              <div className="flex gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Secure & Private</h3>
                  <p className="text-sm text-muted-foreground">
                    Anonymous feedback ensures honest responses
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary/5">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-lg bg-gradient-to-r from-primary to-secondary p-8 text-center text-primary-foreground lg:p-12">
            <h2 className="mb-3 text-2xl font-bold">Ready to improve your campus?</h2>
            <p className="mb-6 text-primary-foreground/90">
              Start collecting meaningful feedback today
            </p>
            <Link href="/feedback">
              <Button size="lg" variant="secondary">
                Submit Your First Feedback <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              AI-Powered Student Feedback & Issue Analyzer · Built for Modern Universities
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
