/**
 * Mock Feedback Data
 * In production, this would be fetched from Firestore
 */

export interface FeedbackItem {
  id: string
  text: string
  category: string
  priority: 'high' | 'medium' | 'low'
  sentiment: 'positive' | 'neutral' | 'negative'
  summary: string
  createdAt: Date
}

const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    text: 'The library is amazing! Great resources and the new study rooms are incredible.',
    category: 'facilities',
    priority: 'low',
    sentiment: 'positive',
    summary: 'The library is amazing! Great resources and the new study rooms...',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    text: 'Urgent: The heating system in the science building is broken. It\'s freezing in all the labs and classrooms. This is affecting our ability to study and work safely.',
    category: 'facilities',
    priority: 'high',
    sentiment: 'negative',
    summary: 'Urgent: The heating system in the science building is broken. It\'s...',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: '3',
    text: 'Registration process is confusing and outdated. The online portal keeps crashing during peak hours. Please modernize it.',
    category: 'administration',
    priority: 'medium',
    sentiment: 'negative',
    summary: 'Registration process is confusing and outdated. The online portal...',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: '4',
    text: 'The new campus coffee shop is fantastic! Great coffee and the barista is friendly.',
    category: 'student-life',
    priority: 'low',
    sentiment: 'positive',
    summary: 'The new campus coffee shop is fantastic! Great coffee and the...',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: '5',
    text: 'Safety concern: The parking lot near the east entrance has poor lighting at night. I feel unsafe walking there after evening classes.',
    category: 'safety',
    priority: 'high',
    sentiment: 'negative',
    summary: 'Safety concern: The parking lot near the east entrance has poor...',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: '6',
    text: 'My chemistry professor is great but the lab equipment is outdated and sometimes doesn\'t work properly. We need new instruments.',
    category: 'academic',
    priority: 'medium',
    sentiment: 'neutral',
    summary: 'My chemistry professor is great but the lab equipment is outdated...',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
  },
  {
    id: '7',
    text: 'The student health center is closed on weekends when many students need it most. Can we extend weekend hours?',
    category: 'student-life',
    priority: 'medium',
    sentiment: 'negative',
    summary: 'The student health center is closed on weekends when many...',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '8',
    text: 'Excellent job on the new dining hall renovations! The food quality has improved significantly.',
    category: 'facilities',
    priority: 'low',
    sentiment: 'positive',
    summary: 'Excellent job on the new dining hall renovations! The food...',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
  },
]

export function getMockFeedback(): FeedbackItem[] {
  return mockFeedback.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getMockFeedbackById(id: string): FeedbackItem | undefined {
  return mockFeedback.find((item) => item.id === id)
}

export function getMockFeedbackStats() {
  const total = mockFeedback.length
  const byCategory = mockFeedback.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const byPriority = {
    high: mockFeedback.filter((item) => item.priority === 'high').length,
    medium: mockFeedback.filter((item) => item.priority === 'medium').length,
    low: mockFeedback.filter((item) => item.priority === 'low').length,
  }

  const bySentiment = {
    positive: mockFeedback.filter((item) => item.sentiment === 'positive').length,
    neutral: mockFeedback.filter((item) => item.sentiment === 'neutral').length,
    negative: mockFeedback.filter((item) => item.sentiment === 'negative').length,
  }

  return { total, byCategory, byPriority, bySentiment }
}
