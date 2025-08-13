#!/bin/bash

# Script to add Firebase configuration to Vercel
# Replace the placeholder values with your actual Firebase configuration

echo "Adding Firebase configuration to Vercel..."

# Add your Firebase configuration values here
echo "YOUR_API_KEY" | vercel env add VITE_FIREBASE_API_KEY production
echo "YOUR_PROJECT.firebaseapp.com" | vercel env add VITE_FIREBASE_AUTH_DOMAIN production
echo "YOUR_PROJECT_ID" | vercel env add VITE_FIREBASE_PROJECT_ID production
echo "YOUR_PROJECT.appspot.com" | vercel env add VITE_FIREBASE_STORAGE_BUCKET production
echo "YOUR_SENDER_ID" | vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
echo "YOUR_APP_ID" | vercel env add VITE_FIREBASE_APP_ID production
echo "false" | vercel env add VITE_DEMO_MODE production

echo "Configuration added! Triggering redeployment..."
vercel --prod --yes

echo "Done! Your app should now use real Firebase authentication."