// Firebase configuration for VeteranLawAI Platform
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'veteranlawai-platform.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'veteranlawai-platform',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'veteranlawai-platform.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdefghijklmnop',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('https://www.googleapis.com/auth/drive.file')
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile')
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email')

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         !firebaseConfig.apiKey.includes('XXXXX') &&
         firebaseConfig.authDomain &&
         firebaseConfig.projectId
}

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    if (!isFirebaseConfigured()) {
      console.error('Firebase is not properly configured. Please set up environment variables.')
      return { 
        success: false, 
        error: 'Authentication service is not configured. Please contact support.' 
      }
    }
    const result = await signInWithPopup(auth, googleProvider)
    return { success: true, user: result.user }
  } catch (error) {
    console.error('Google sign-in error:', error)
    return { success: false, error: error.message }
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false, error: error.message }
  }
}

export default app
