'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Feedback } from '@/lib/types'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FeedbackTableProps {
  data: Feedback[]
}

export default function FeedbackTable({ data }: FeedbackTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      academic: { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
      facilities: { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
      'student-life': { bg: 'bg-purple-50 dark:bg-purple-950', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
      administration: { bg: 'bg-slate-50 dark:bg-slate-900', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-800' },
      safety: { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' },
      other: { bg: 'bg-gray-50 dark:bg-gray-900', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-800' },
    }
    return colors[category] || colors.other
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground'
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
      case 'neutral':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-2 overflow-x-auto">
      {/* Table Header - Desktop */}
      <div className="hidden md:grid gap-4 md:grid-cols-12 bg-muted/50 p-4 rounded-t-lg font-semibold text-sm text-muted-foreground border-b border-border">
        <div className="md:col-span-3">Feedback</div>
        <div className="md:col-span-2">Category</div>
        <div className="md:col-span-2">Priority</div>
        <div className="md:col-span-2">Sentiment</div>
        <div className="md:col-span-3">Date</div>
      </div>

      {/* Table Rows */}
      {data.map((item) => {
        const isExpanded = expandedId === item.id
        const categoryColors = getCategoryBadgeColor(item.category)

        return (
          <div key={item.id} className="border border-border rounded-lg overflow-hidden">
            {/* Row Content */}
            <div
              className="grid gap-4 md:grid-cols-12 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
            >
              {/* Feedback Text (Mobile: full width, Desktop: col-span-3) */}
              <div className="md:col-span-3">
                <p className="text-sm font-medium text-foreground line-clamp-2">{item.summary || item.text.substring(0, 100)}</p>
                <p className="text-xs text-muted-foreground mt-1 md:hidden">Click to expand</p>
              </div>

              {/* Category (Mobile: inline, Desktop: col-span-2) */}
              <div className="md:col-span-2">
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium border ${categoryColors.border} ${categoryColors.bg} ${categoryColors.text}`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('-', ' ')}
                </div>
              </div>

              {/* Priority (Mobile: inline, Desktop: col-span-2) */}
              <div className="md:col-span-2">
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPriorityBadgeColor(item.priority)}`}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </div>
              </div>

              {/* Sentiment (Mobile: inline, Desktop: col-span-2) */}
              <div className="md:col-span-2">
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSentimentBadgeColor(item.sentiment)}`}>
                  {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                </div>
              </div>

              {/* Date (Mobile: hidden, Desktop: col-span-3) */}
              <div className="hidden md:flex md:col-span-3 items-center justify-between">
                <span className="text-xs text-muted-foreground">{formatDate(new Date(item.created_at))}</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-border bg-muted/30 p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase">Full Feedback</h4>
                    <p className="text-sm text-foreground mt-2 whitespace-pre-wrap">{item.text}</p>
                  </div>
                  {item.summary && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">AI Summary</h4>
                      <p className="text-sm text-foreground mt-2">{item.summary}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="text-sm font-medium text-foreground">{formatDate(new Date(item.created_at))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-medium text-foreground capitalize">{item.status}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Feedback ID</p>
                      <p className="text-sm font-mono text-foreground">{item.id.substring(0, 8)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
