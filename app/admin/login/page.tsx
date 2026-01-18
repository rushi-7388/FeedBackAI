'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Lock, Mail, AlertCircle } from 'lucide-react'
import { adminLogin } from '@/lib/actions/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@dit.edu.in')
  const [password, setPassword] = useState('demo123')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setIsLoading(true)

    try {
      const result = await adminLogin(email, password)

      if (result.success) {
        router.push('/admin/dashboard')
      } else {
        setError(result.error || 'Invalid credentials')
      }
    } catch (error) {
      console.error('[v0] Login error:', error)
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col">
      {/* Back Button */}
      <div className="container mx-auto max-w-md px-4 py-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-2 p-8">
          {/* Header */}
          <div className="mb-8 space-y-2 text-center">
            <div className="flex justify-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to view and manage feedback
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@college.edu"
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-md bg-secondary/10 p-3">
            <p className="text-xs font-medium text-foreground mb-2">Demo Credentials:</p>
            <p className="text-xs text-muted-foreground">
              Email: <span className="font-mono font-semibold text-foreground">admin@dit.edu.in</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Password: <span className="font-mono font-semibold text-foreground">demo123</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/50">
        <div className="container mx-auto max-w-md px-4 py-4 text-center text-xs text-muted-foreground">
          Only administrators, principals, and HODs can access this portal.
        </div>
      </div>
    </div>
  )
}
