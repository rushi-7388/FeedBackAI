export type College = {
  id: string
  name: string
  email: string
  phone: string
  location: string
  created_at: string
}

export type Faculty = {
  id: string
  college_id: string
  name: string
  description: string
  created_at: string
}

export type Department = {
  id: string
  faculty_id: string
  name: string
  hod_name: string
  created_at: string
}

export type Role = {
  id: string
  name: 'student' | 'faculty' | 'hod' | 'principal' | 'admin'
  description: string
}

export type User = {
  id: string
  college_id: string
  email: string
  name: string
  role_id: string
  department_id: string | null
  password_hash: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AIAnalysis = {
  category: string
  priority: 'high' | 'medium' | 'low'
  sentiment: 'positive' | 'neutral' | 'negative'
  summary: string
  language: 'english' | 'hindi' | 'hinglish' | 'other'
  actionable_insight: string
  policy_recommendation: string
}

export type Feedback = {
  id: string
  college_id: string
  user_id: string | null
  category: string
  text: string
  title: string | null
  is_anonymous: boolean
  created_at: string
  updated_at: string
  priority: 'high' | 'medium' | 'low'
  sentiment: 'positive' | 'neutral' | 'negative'
  summary: string | null
  ai_analysis: AIAnalysis | null
  status: 'new' | 'acknowledged' | 'in-progress' | 'resolved'
  assigned_to: string | null
  resolved_at: string | null
}

export type FeedbackResponse = {
  id: string
  feedback_id: string
  respondent_id: string
  response_text: string
  action_taken: string | null
  created_at: string
  updated_at: string
}

export type FeedbackCategory = {
  id: string
  college_id: string
  name: string
  description: string
  created_at: string
}
