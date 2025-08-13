// Firebase configuration for VeteranLawAI Platform
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your actual API key
  authDomain: 'veteranlawai-platform.firebaseapp.com',
  projectId: 'veteranlawai-platform',
  storageBucket: 'veteranlawai-platform.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdefghijklmnop',
  measurementId: 'G-XXXXXXXXXX',
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

// Authentication functions
export const signInWithGoogle = async () => {
  try {
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
