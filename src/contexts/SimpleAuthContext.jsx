import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const SimpleAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false) // Changed to false - we're not loading anything on mount
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  // Simple email/password login (works immediately, no setup needed!)
  const loginWithEmail = async (email, password) => {
    setLoading(true)
    
    // For demo purposes, accept any email/password
    // In production, this would validate against a real database
    const demoUser = {
      uid: 'user-' + Date.now(),
      email: email,
      displayName: email.split('@')[0],
      photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=0ea5e9&color=fff`,
    }
    
    const demoProfile = {
      ...demoUser,
      role: 'attorney',
      plan: 'enterprise',
      firm: 'Law Firm',
      barNumber: '123456',
      specialties: ['VA Disability Claims', 'Veterans Law'],
      joinedDate: new Date().toISOString(),
      lastSignIn: new Date().toISOString(),
      casesHandled: 247,
      successRate: 94.2,
      totalAwarded: 4200000,
      preferences: {
        theme: 'dark',
        notifications: true,
        autoSave: true,
      },
    }
    
    // Simulate network delay
    setTimeout(() => {
      setUser(demoUser)
      setUserProfile(demoProfile)
      setIsAuthenticated(true)
      setLoading(false)
      
      // Store in localStorage for persistence
      localStorage.setItem('veteranlawai_user', JSON.stringify(demoUser))
      localStorage.setItem('veteranlawai_profile', JSON.stringify(demoProfile))
    }, 500)
    
    return { success: true }
  }

  // Google login (simplified)
  const login = async () => {
    return loginWithEmail('demo@veteranlawai.com', 'demo123')
  }

  // Logout
  const logout = async () => {
    setUser(null)
    setUserProfile(null)
    setIsAuthenticated(false)
    localStorage.removeItem('veteranlawai_user')
    localStorage.removeItem('veteranlawai_profile')
  }

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('veteranlawai_user')
    const storedProfile = localStorage.getItem('veteranlawai_profile')
    
    if (storedUser && storedProfile) {
      try {
        setUser(JSON.parse(storedUser))
        setUserProfile(JSON.parse(storedProfile))
        setIsAuthenticated(true)
      } catch (e) {
        // Clear invalid data
        localStorage.removeItem('veteranlawai_user')
        localStorage.removeItem('veteranlawai_profile')
      }
    }
  }, [])

  // Update profile
  const updateUserProfile = async (updates) => {
    const newProfile = { ...userProfile, ...updates }
    setUserProfile(newProfile)
    localStorage.setItem('veteranlawai_profile', JSON.stringify(newProfile))
    return true
  }

  const updatePreferences = async (preferences) => {
    return await updateUserProfile({ preferences })
  }

  const updateGoogleDriveSettings = async (driveSettings) => {
    return await updateUserProfile({
      googleDrive: { ...userProfile?.googleDrive, ...driveSettings },
    })
  }

  const value = {
    user,
    userProfile,
    isAuthenticated,
    loading,
    login,
    loginWithEmail,
    logout,
    updateUserProfile,
    updatePreferences,
    updateGoogleDriveSettings,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default SimpleAuthProvider