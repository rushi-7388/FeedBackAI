'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2, Send, AlertCircle } from 'lucide-react'
import { submitFeedback } from '@/lib/actions/feedback'

const ISSUE_TYPES = [
  { value: 'academic', label: 'Academic Concerns' },
  { value: 'facilities', label: 'Facilities & Campus' },
  { value: 'student-life', label: 'Student Life' },
  { value: 'administration', label: 'Administration' },
  { value: 'safety', label: 'Safety & Security' },
  { value: 'other', label: 'Other' },
]

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('')
  const [issueType, setIssueType] = useState('academic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collegeId, setCollegeId] = useState<string | null>(null)

  // Get college ID from query params or use default
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const college = params.get('college') || localStorage.getItem('collegeId')
    if (college) {
      setCollegeId(college)
      localStorage.setItem('collegeId', college)
    } else {
      // Default to first college for demo
      setCollegeId('550e8400-e29b-41d4-a716-446655440001')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedback.trim()) {
      setError('Please enter your feedback')
      return
    }

    if (!collegeId) {
      setError('College information is missing')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitFeedback({
        collegeId,
        category: issueType,
        text: feedback,
        isAnonymous: true,
      })

      if (result.success) {
        setIsSuccess(true)
        setFeedback('')
        setIssueType('academic')

        // Reset after 3 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 3000)
      } else {
        setError(result.error || 'Failed to submit feedback')
      }
    } catch (err) {
      console.error('[v0] Feedback submission error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Share Your Feedback</h1>
            <p className="text-muted-foreground">
              Help us improve by sharing your thoughts. All submissions are anonymous and confidential.
            </p>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <Card className="border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Feedback submitted successfully!
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Thank you for helping us improve. Your feedback is being analyzed by our AI system.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Card className="border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    Error
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Feedback Form */}
          <Card className="border-2 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Issue Type <span className="text-muted-foreground">(Optional)</span>
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a category...</option>
                  {ISSUE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-2">
                <label htmlFor="feedback" className="block text-sm font-medium text-foreground">
                  Your Feedback <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts, concerns, or suggestions..."
                  className="min-h-40 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  {feedback.length} characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setFeedback('')}>
                  Clear
                </Button>
              </div>
            </form>
          </Card>

          {/* Info Box */}
          <Card className="border-primary/20 bg-primary/5 p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Why we collect feedback</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Understand student needs and concerns</li>
                <li>✓ Identify trends and patterns</li>
                <li>✓ Prioritize improvements</li>
                <li>✓ Make data-driven decisions</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
