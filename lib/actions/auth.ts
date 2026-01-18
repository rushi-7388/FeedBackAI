'use server'

import { getSupabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function adminLogin(email: string, password: string) {
  try {
    const supabase = await getSupabaseServer()

    // Get user by email and verify role
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          password_hash,
          full_name,
          role_id,
          college_id,
          roles:role_id(name)
        `)
        .eq('email', email)
        .maybeSingle()

    if (userError || !user) {
      console.log('[v0] User lookup failed:', userError)
      return { success: false, error: 'Invalid credentials' }
    }

    // Verify role (must be admin, principal, or hod)
    const roleData = user.roles as any
    const roleName = Array.isArray(roleData) ? roleData[0]?.name : roleData?.name
    
    const isAdminRole = ['admin', 'principal', 'hod'].includes(roleName)

    if (!isAdminRole) {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // For demo purposes, accept password matching demo123
    // In production, use bcrypt to verify password_hash
    if (password !== 'demo123') {
      return { success: false, error: 'Invalid credentials' }
    }

    // Store auth token in localStorage (client-side handled)
    const token = `admin_${Date.now()}_${user.id}`
    
    const cookieStore = await cookies()
      cookieStore.set('admin_session', JSON.stringify({
        userId: user.id,
        collegeId: user.college_id,
        email: user.email,
        name: user.full_name,
        role: roleName,
        token,
      }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: roleName,
          collegeId: user.college_id,
        },
      }
  } catch (error) {
    console.error('[v0] Admin login error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    }
  }
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) {
      return { session: null, isAdmin: false }
    }

    const session = JSON.parse(sessionCookie.value)
    return { session, isAdmin: true }
  } catch (error) {
    console.error('[v0] Get session error:', error)
    return { session: null, isAdmin: false }
  }
}

export async function adminLogout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    return { success: true }
  } catch (error) {
    console.error('[v0] Logout error:', error)
    return { success: false }
  }
}
