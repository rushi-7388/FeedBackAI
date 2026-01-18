'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LogOut, BarChart3, MessageSquare, Loader } from 'lucide-react'
import { getFeedbackForAdmin } from '@/lib/actions/feedback'
import type { Feedback } from '@/lib/types'
import FeedbackTable from '@/components/admin/feedback-table'
import DashboardStats from '@/components/admin/dashboard-stats'

export default function AdminDashboard() {
  const router = useRouter()
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([])
  const [filteredData, setFilteredData] = useState<Feedback[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {} as Record<string, number>,
    byPriority: { high: 0, medium: 0, low: 0 },
    bySentiment: { positive: 0, neutral: 0, negative: 0 },
  })

  // Check auth and load data on mount
  useEffect(() => {
    const loadAdminData = async () => {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
        return
      }

      try {
        const result = await getFeedbackForAdmin(token)
        
        if (!result.success) {
          setError(result.error || 'Failed to load feedback')
          console.log('[v0] Admin data load error:', result.error)
          return
        }

        const data = result.data || []
        setFeedbackData(data)
        setFilteredData(data)

        // Calculate stats
        const categoryCount: Record<string, number> = {}
        const priorityCount = { high: 0, medium: 0, low: 0 }
        const sentimentCount = { positive: 0, neutral: 0, negative: 0 }

        data.forEach((item) => {
          categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
          if (item.priority in priorityCount) {
            priorityCount[item.priority as keyof typeof priorityCount]++
          }
          if (item.sentiment in sentimentCount) {
            sentimentCount[item.sentiment as keyof typeof sentimentCount]++
          }
        })

        setStats({
          total: data.length,
          byCategory: categoryCount,
          byPriority: priorityCount,
          bySentiment: sentimentCount,
        })
      } catch (err) {
        console.error('[v0] Dashboard load error:', err)
        setError('An error occurred while loading feedback')
      } finally {
        setIsLoading(false)
      }
    }

    loadAdminData()
  }, [router])

  // Apply filters
  useEffect(() => {
    let filtered = feedbackData

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    if (selectedPriority) {
      filtered = filtered.filter((item) => item.priority === selectedPriority)
    }

    setFilteredData(filtered)
  }, [searchTerm, selectedCategory, selectedPriority, feedbackData])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/')
  }

  const categories = Object.keys(stats.byCategory || {})

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="rounded bg-primary p-2">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Feedback Analytics</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {isLoading && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <Loader className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading feedback data...</p>
            </div>
          </div>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
            <div className="flex gap-3">
              <MessageSquare className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">Error loading dashboard</h3>
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {!isLoading && !error && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <DashboardStats stats={stats} />

            {/* Filters & Search */}
            <Card className="border-2 p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Filters</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Search */}
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>

                {/* Priority Filter */}
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                {/* Clear Filters */}
                {(searchTerm || selectedCategory || selectedPriority) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('')
                      setSelectedPriority('')
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>

            {/* Feedback Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Feedback Submissions
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({filteredData.length} of {feedbackData.length})
                  </span>
                </h2>
              </div>
              <FeedbackTable data={filteredData} />
            </div>

            {/* Empty State */}
            {filteredData.length === 0 && (
              <Card className="border-2 border-dashed p-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="font-semibold text-foreground mb-1">No feedback found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or check back later for new submissions.
                </p>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
