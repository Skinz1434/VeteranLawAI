import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Mock user data - in production, this would come from your auth service
  const mockUser = {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@lawfirm.com',
    role: 'attorney',
    plan: 'enterprise',
    avatar: null,
    firm: 'Mitchell & Associates',
    barNumber: 'NY123456',
    specialties: ['VA Disability Claims', 'Veterans Law', 'Appeals'],
    joinedDate: '2023-01-15',
    casesHandled: 247,
    successRate: 89
  }

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In production, check for valid JWT token or session
        const savedAuth = localStorage.getItem('veteranlawai_auth')
        if (savedAuth) {
          const authData = JSON.parse(savedAuth)
          setUser(authData.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('veteranlawai_auth')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      // Mock authentication - in production, call your auth API
      if (email && password) {
        const authData = {
          user: mockUser,
          token: 'mock_jwt_token_here',
          expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        }
        
        localStorage.setItem('veteranlawai_auth', JSON.stringify(authData))
        setUser(mockUser)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('veteranlawai_auth')
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    
    // Update stored auth data
    const savedAuth = localStorage.getItem('veteranlawai_auth')
    if (savedAuth) {
      const authData = JSON.parse(savedAuth)
      authData.user = updatedUser
      localStorage.setItem('veteranlawai_auth', JSON.stringify(authData))
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider