'use server'

import { getSupabaseServer } from '@/lib/supabase/server'
import { analyzeFeedback } from '@/lib/ai-analysis'
import { cookies } from 'next/headers'

export async function submitFeedback(formData: {
  collegeId: string
  category: string
  text: string
  isAnonymous?: boolean
  title?: string
}) {
  try {
    const supabase = await getSupabaseServer()

    const analysis = analyzeFeedback(formData.text, formData.category)

    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          college_id: formData.collegeId,
          category: analysis.category,
          text: formData.text,
          title: formData.title || formData.text.substring(0, 100),
          is_anonymous: formData.isAnonymous !== false,
          priority: analysis.priority,
          sentiment: analysis.sentiment,
          summary: analysis.summary,
          ai_analysis: {
            ...analysis,
          },
          status: 'new',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[v0] Feedback submission error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[v0] Feedback submission failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getFeedbackForAdmin(adminToken: string) {
  try {
    const supabase = await getSupabaseServer()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')
    
    let collegeId = '550e8400-e29b-41d4-a716-446655440001'
    
    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie.value)
        if (session.collegeId) {
          collegeId = session.collegeId
        }
      } catch (e) {
        console.log('[v0] Failed to parse session cookie')
      }
    }

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('college_id', collegeId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Fetch feedback error:', error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('[v0] Fetch feedback failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    }
  }
}

export async function getFeedbackByCollege(collegeId: string) {
  try {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('college_id', collegeId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Fetch feedback error:', error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('[v0] Fetch feedback failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    }
  }
}

export async function updateFeedbackStatus(
  feedbackId: string,
  status: string,
  responseText?: string
) {
  try {
    const supabase = await getSupabaseServer()

    // Update feedback status
    const { error: updateError } = await supabase
      .from('feedback')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', feedbackId)

    if (updateError) {
      console.error('[v0] Status update error:', updateError)
      return { success: false, error: updateError.message }
    }

    // Add response if provided
    if (responseText) {
      const { error: responseError } = await supabase
        .from('feedback_responses')
        .insert([
          {
            feedback_id: feedbackId,
            response_text: responseText,
            created_at: new Date().toISOString(),
          },
        ])

      if (responseError) {
        console.error('[v0] Response insertion error:', responseError)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[v0] Feedback update failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
