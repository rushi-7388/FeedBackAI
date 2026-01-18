'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle, TrendingUp, MessageSquare, Zap } from 'lucide-react'

interface DashboardStatsProps {
  stats: {
    total: number
    byCategory: Record<string, number>
    byPriority: { high: number; medium: number; low: number }
    bySentiment: { positive: number; neutral: number; negative: number }
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const highPriorityCount = stats.byPriority.high
  const negativeCount = stats.bySentiment.negative

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Total Feedback */}
      <Card className="border-2 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Feedback</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>

      {/* High Priority */}
      <Card
        className={`border-2 p-6 ${highPriorityCount > 0 ? 'border-destructive/30 bg-destructive/5' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">High Priority</p>
            <p className="text-2xl font-bold text-foreground">{highPriorityCount}</p>
            {highPriorityCount > 0 && (
              <p className="text-xs text-destructive mt-1">Needs attention</p>
            )}
          </div>
          <div className={`rounded-lg p-3 ${highPriorityCount > 0 ? 'bg-destructive/10' : 'bg-primary/10'}`}>
            <AlertCircle className={`h-6 w-6 ${highPriorityCount > 0 ? 'text-destructive' : 'text-primary'}`} />
          </div>
        </div>
      </Card>

      {/* Negative Sentiment */}
      <Card
        className={`border-2 p-6 ${negativeCount > 0 ? 'border-destructive/30 bg-destructive/5' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Negative Sentiment</p>
            <p className="text-2xl font-bold text-foreground">{negativeCount}</p>
            {stats.total > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((negativeCount / stats.total) * 100)}% of feedback
              </p>
            )}
          </div>
          <div className={`rounded-lg p-3 ${negativeCount > 0 ? 'bg-destructive/10' : 'bg-primary/10'}`}>
            <TrendingUp className={`h-6 w-6 ${negativeCount > 0 ? 'text-destructive' : 'text-primary'}`} />
          </div>
        </div>
      </Card>

      {/* Positive Sentiment */}
      <Card className="border-2 p-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Positive Feedback</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.bySentiment.positive}
            </p>
            {stats.total > 0 && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {Math.round((stats.bySentiment.positive / stats.total) * 100)}% of feedback
              </p>
            )}
          </div>
          <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
            <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>
    </div>
  )
}
