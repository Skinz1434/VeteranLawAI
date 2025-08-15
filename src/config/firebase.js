// Firebase configuration for VeteranLawAI Platform
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Ensure sessions persist and use browser language
setPersistence(auth, browserLocalPersistence).catch(() => {})
auth.useDeviceLanguage?.()
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Signs in the user using the Google Popup method.
 * This is the standard, secure way to handle Google login.
 * It requires the app's domain to be authorized in Firebase.
 */
export const signInWithGoogle = async () => {
  console.log('🔥 Firebase signInWithGoogle called')
  console.log('🔥 Auth instance:', auth)
  console.log('🔥 Google provider:', googleProvider)
  
  try {
    // Check for redirect result first
    console.log('🔥 Checking for redirect result...')
    const redirect = await getRedirectResult(auth).catch((err) => {
      console.log('🔥 Redirect result error (may be normal):', err)
      return null
    })
    
    if (redirect?.user) {
      console.log('🔥 Redirect result found, user:', redirect.user)
      return { success: true, user: redirect.user }
    }

    console.log('🔥 Attempting popup sign-in...')
    const result = await signInWithPopup(auth, googleProvider)
    console.log('🔥 Popup sign-in successful:', result.user)
    return { success: true, user: result.user }
  } catch (error) {
    console.error('🔥 Google Sign-In Error:', error)
    console.error('🔥 Error code:', error.code)
    console.error('🔥 Error message:', error.message)
    
    // Fallback to redirect for popup blockers or unsupported environments
    const fallbackCodes = [
      'auth/popup-blocked',
      'auth/popup-closed-by-user',
      'auth/operation-not-supported-in-this-environment',
      'auth/unauthorized-domain',
    ]
    
    if (fallbackCodes.includes(error?.code)) {
      console.log('🔥 Attempting redirect fallback...')
      try {
        await signInWithRedirect(auth, googleProvider)
        return { success: false, error: 'Redirecting to Google…' }
      } catch (redirectError) {
        console.error('🔥 Google Redirect Sign-In Error:', redirectError)
        return { success: false, error: `Redirect failed: ${redirectError.code}` }
      }
    }
    
    return { success: false, error: `${error.code}: ${error.message}` }
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign Out Error:', error);
    return { success: false, error: error.message };
  }
};
