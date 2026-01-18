'use server'

import { getSupabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function adminLogin(email: string, password: string) {
  try {
    const supabase = await getSupabaseServer()

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
      console.log('User lookup failed:', userError)
      return { success: false, error: 'Invalid credentials' }
    }

    const roleData = user.roles as any
    const roleName = Array.isArray(roleData) ? roleData[0]?.name : roleData?.name
    
    const isAdminRole = ['admin', 'principal', 'hod'].includes(roleName)

    if (!isAdminRole) {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    let passwordValid = false
    if (user.password_hash?.startsWith('$2')) {
      passwordValid = await bcrypt.compare(password, user.password_hash)
    } else {
      passwordValid = password === user.password_hash
    }

    if (!passwordValid) {
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
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: roleName,
          collegeId: user.college_id,
        },
      }
  } catch (error) {
    console.error('Admin login error:', error)
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
    console.error('Get session error:', error)
    return { session: null, isAdmin: false }
  }
}

export async function adminLogout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false }
  }
}

export async function registerUser(data: {
  email: string
  password: string
  fullName: string
  collegeId: string
  role?: string
}) {
  try {
    const supabase = await getSupabaseServer()

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .maybeSingle()

    if (existingUser) {
      return { success: false, error: 'Email already registered' }
    }

    const { data: role } = await supabase
      .from('roles')
      .select('id')
      .eq('name', data.role || 'student')
      .single()

    if (!role) {
      return { success: false, error: 'Invalid role' }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email: data.email,
          password_hash: hashedPassword,
          full_name: data.fullName,
          college_id: data.collegeId,
          role_id: role.id,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error('User registration error:', insertError)
      return { success: false, error: insertError.message }
    }

    return { success: true, user: newUser }
  } catch (error) {
    console.error('Registration failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    }
  }
}

export async function getColleges() {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from('colleges')
      .select('id, name, location')
      .order('name')

    if (error) {
      console.error('Fetch colleges error:', error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Fetch colleges failed:', error)
    return { success: false, error: 'Failed to fetch colleges', data: [] }
  }
}

export async function getDepartments(collegeId: string) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, hod_name')
      .eq('college_id', collegeId)
      .order('name')

    if (error) {
      console.error('Fetch departments error:', error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Fetch departments failed:', error)
    return { success: false, error: 'Failed to fetch departments', data: [] }
  }
}
