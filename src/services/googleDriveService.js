/**
 * @fileoverview Google Drive Service for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.1
 *
 * Provides seamless integration with Google Drive for document storage,
 * collaboration, and backup throughout the platform.
 * Corrected environment variable access for Vite.
 */

import { auth } from '../config/firebase'

export class GoogleDriveService {
  constructor() {
    this.isInitialized = false
    this.gapi = null
    this.driveAPI = null
    this.folderId = null
    this.uploadQueue = []
    this.isProcessing = false
  }

  async initialize() {
    // ... (rest of the function is the same)
  }

  async loadGoogleAPI() {
    // ... (rest of the function is the same)
  }
  
  /**
   * Initialize Google Drive API
   */
  async initializeDriveAPI() {
    return new Promise((resolve, reject) => {
      this.gapi.load('client:auth2', async () => {
        try {
          await this.gapi.client.init({
            // CORRECTED: Using Vite's import.meta.env syntax
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
            // NOTE: The Google Client ID for Drive might be different.
            // Using the Firebase App ID as a placeholder. This may need to be updated.
            clientId: import.meta.env.VITE_FIREBASE_APP_ID, 
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.file',
          })

          if (!this.gapi.auth2.getAuthInstance().isSignedIn.get()) {
            await this.gapi.auth2.getAuthInstance().signIn()
          }

          this.driveAPI = this.gapi.client.drive
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    })
  }
  
  // ... (All other methods in the class remain the same)
}

export const googleDriveService = new GoogleDriveService();
// ... (All other exported functions remain the same)
