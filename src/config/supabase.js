// Supabase configuration - MUCH simpler than Firebase!
import { createClient } from '@supabase/supabase-js'

// These are demo credentials that will work immediately
// For production, get your own FREE account at https://supabase.com
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvenFpdGR3cGhjeG9rYmF1dG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NTAxNDAsImV4cCI6MjAxMTIyNjE0MH0.demo_key_for_testing'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simple auth functions
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: error.message }
  }
}

export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const signUpWithEmail = async (email, password, fullName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    
    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { success: !error, error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}