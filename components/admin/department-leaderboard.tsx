'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface DepartmentStats {
  name: string
  score: number // 0-100 based on sentiment
  trend: 'up' | 'down' | 'stable'
  totalFeedback: number
  tip: string
}

const MOCK_DEPARTMENTS: DepartmentStats[] = [
  {
    name: 'Computer Science',
    score: 85,
    trend: 'up',
    totalFeedback: 124,
    tip: 'Students highly appreciate the new lab facilities. Consider expanding weekend access.'
  },
  {
    name: 'Mechanical Engineering',
    score: 62,
    trend: 'down',
    totalFeedback: 89,
    tip: 'Several complaints about workshop equipment. AI recommends an immediate safety audit.'
  },
  {
    name: 'Electrical Engineering',
    score: 74,
    trend: 'stable',
    totalFeedback: 56,
    tip: 'Feedback suggests elective courses are popular but materials are hard to find.'
  },
  {
    name: 'Civil Engineering',
    score: 45,
    trend: 'down',
    totalFeedback: 42,
    tip: 'Urgent: High volume of negative sentiment regarding internship placement support.'
  }
]

export default function DepartmentLeaderboard() {
  return (
    <Card className="p-6 border-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            AI Departmental Leaderboard
          </h2>
          <p className="text-sm text-muted-foreground">Performance based on AI Sentiment Analysis</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          Updated Live
        </Badge>
      </div>

      <div className="space-y-6">
        {MOCK_DEPARTMENTS.sort((a, b) => b.score - a.score).map((dept, index) => (
          <div key={dept.name} className="relative">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${index === 0 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                  #{index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-sm">{dept.name}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {dept.totalFeedback} Feedback analyzed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  {dept.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {dept.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                  <span className="text-sm font-bold">{dept.score}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Satisfaction</p>
              </div>
            </div>
            
            <Progress value={dept.score} className="h-2" />
            
            <div className="mt-3 bg-muted/50 rounded-lg p-3 border border-border flex gap-3">
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/80 italic leading-relaxed">
                <span className="font-bold text-amber-600 dark:text-amber-400 not-italic">Smart Tip: </span>
                {dept.tip}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
