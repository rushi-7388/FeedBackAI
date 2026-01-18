'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogOut, BarChart3, MessageSquare, Loader, Sparkles } from 'lucide-react'
import { getFeedbackForAdmin } from '@/lib/actions/feedback'
import type { Feedback } from '@/lib/types'
import FeedbackTable from '@/components/admin/feedback-table'
import DashboardStats from '@/components/admin/dashboard-stats'
import DepartmentLeaderboard from '@/components/admin/department-leaderboard'

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
            {/* AI Smart Summary (Unique Feature) */}
            <Card className="p-6 border-2 border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-24 w-24 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary hover:bg-primary/90">AI Strategic Summary</Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary">Vernacular Support Enabled</Badge>
                </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Campus Health Overview</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Critical Action Items
                      </h3>
                      <ul className="space-y-2">
                        {feedbackData.filter(f => f.priority === 'high' && f.status === 'new').slice(0, 3).map((item, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="font-bold text-primary">•</span>
                            <span>{item.ai_analysis?.actionable_insight || item.summary}</span>
                          </li>
                        ))}
                        {feedbackData.filter(f => f.priority === 'high' && f.status === 'new').length === 0 && (
                          <li className="text-sm italic text-muted-foreground">No critical items detected.</li>
                        )}
                      </ul>
                    </div>
                    <div className="space-y-3 border-l border-primary/10 pl-6">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Positive Trends
                      </h3>
                      <div className="space-y-2">
                        {feedbackData.filter(f => f.sentiment === 'positive').length > 0 ? (
                          <p className="text-sm italic">
                            "{feedbackData.filter(f => f.sentiment === 'positive')[0].ai_analysis?.policy_recommendation || 'Students are showing positive engagement with recent campus initiatives.'}"
                          </p>
                        ) : (
                          <p className="text-sm italic text-muted-foreground">Monitoring campus sentiment trends...</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          AI Analysis: {stats.bySentiment.positive} positive vs {stats.bySentiment.negative} negative reports.
                        </p>
                      </div>
                    </div>
                  </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <DashboardStats stats={stats} />

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Leaderboard */}
              <div className="lg:col-span-1">
                <DepartmentLeaderboard />
              </div>

              {/* Right Column: Filters & Table */}
              <div className="lg:col-span-2 space-y-8">
                {/* Filters & Search */}
                <Card className="border-2 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Filter Analysis</h2>
                    <div className="flex gap-2">
                      {/* Vernacular Filter - Mock for UI */}
                      <Badge variant="secondary" className="cursor-pointer hover:bg-muted">All Languages</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">Hindi/Hinglish</Badge>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Search */}
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Search feedback content or AI summaries..."
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
                  </div>
                </Card>

                {/* Feedback Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      Submission Stream
                      <Badge variant="outline" className="font-normal">
                        {filteredData.length} entries
                      </Badge>
                    </h2>
                  </div>
                  <FeedbackTable data={filteredData} />
                </div>
              </div>
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
