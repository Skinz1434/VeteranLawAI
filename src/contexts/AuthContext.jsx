import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, signInWithGoogle, signOutUser, db } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

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
  const [userProfile, setUserProfile] = useState(null)

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        try {
          // Get or create user profile in Firestore
          const userRef = doc(db, 'users', firebaseUser.uid)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            // Update existing profile with latest Firebase data
            const profileData = userSnap.data()
            const updatedProfile = {
              ...profileData,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              lastSignIn: new Date().toISOString(),
            }

            await updateDoc(userRef, {
              lastSignIn: updatedProfile.lastSignIn,
              photoURL: firebaseUser.photoURL,
            })

            setUserProfile(updatedProfile)
          } else {
            // Create new user profile
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'attorney',
              plan: 'enterprise',
              firm: '',
              barNumber: '',
              specialties: ['VA Disability Claims', 'Veterans Law'],
              joinedDate: new Date().toISOString(),
              lastSignIn: new Date().toISOString(),
              casesHandled: 0,
              successRate: 0,
              totalAwarded: 0,
              preferences: {
                theme: 'dark',
                notifications: true,
                autoSave: true,
              },
              googleDrive: {
                connected: true,
                folderId: null,
                permissions: ['read', 'write'],
              },
            }

            await setDoc(userRef, newProfile)
            setUserProfile(newProfile)
          }

          setUser(firebaseUser)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Error managing user profile:', error)
          // Still set basic user info even if profile creation fails
          setUser(firebaseUser)
          setIsAuthenticated(true)
        }
      } else {
        setUser(null)
        setUserProfile(null)
        setIsAuthenticated(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async () => {
    setLoading(true)
    try {
      // Check if demo mode is enabled
      const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
      
      if (isDemoMode) {
        // Create demo user
        const demoUser = {
          uid: 'demo-user-123',
          email: 'demo@veteranlawai.com',
          displayName: 'Demo Attorney',
          photoURL: 'https://ui-avatars.com/api/?name=Demo+Attorney&background=0ea5e9&color=fff',
        }
        
        const demoProfile = {
          uid: 'demo-user-123',
          email: 'demo@veteranlawai.com',
          displayName: 'Demo Attorney',
          photoURL: 'https://ui-avatars.com/api/?name=Demo+Attorney&background=0ea5e9&color=fff',
          role: 'attorney',
          plan: 'enterprise',
          firm: 'Demo Law Firm',
          barNumber: 'DEMO123456',
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
          googleDrive: {
            connected: false,
            folderId: null,
            permissions: ['read', 'write'],
          },
        }
        
        // Set demo user
        setTimeout(() => {
          setUser(demoUser)
          setUserProfile(demoProfile)
          setIsAuthenticated(true)
          setLoading(false)
        }, 1000) // Simulate loading
        
        return { success: true }
      }
      
      // Normal Firebase login
      const result = await signInWithGoogle()
      if (result.success) {
        // Auth state change will be handled by the listener above
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
      
      if (isDemoMode) {
        // Demo logout
        setUser(null)
        setUserProfile(null)
        setIsAuthenticated(false)
      } else {
        // Firebase logout
        await signOutUser()
        // Auth state change will be handled by the listener above
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async updates => {
    if (!user?.uid) return false

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, updates)

      setUserProfile(prev => ({ ...prev, ...updates }))
      return true
    } catch (error) {
      console.error('Failed to update user profile:', error)
      return false
    }
  }

  const updatePreferences = async preferences => {
    return await updateUserProfile({ preferences })
  }

  const updateGoogleDriveSettings = async driveSettings => {
    return await updateUserProfile({
      googleDrive: { ...userProfile?.googleDrive, ...driveSettings },
    })
  }

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUserProfile,
    updatePreferences,
    updateGoogleDriveSettings,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
