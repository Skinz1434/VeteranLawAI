/**
 * Google Drive Service for VeteranLawAI
 * Handles file uploads and storage to Google Drive
 */

class GoogleDriveService {
  constructor() {
    this.isInitialized = false
    this.isSignedIn = false
    this.driveApi = null
  }

  /**
   * Initialize Google Drive API
   */
  async initialize() {
    try {
      // Check if Google API is loaded
      if (!window.gapi) {
        throw new Error('Google API not loaded')
      }

      // Load the API client and auth library
      await new Promise((resolve) => {
        window.gapi.load('client:auth2', resolve)
      })

      // Initialize the client
      await window.gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.file'
      })

      this.driveApi = window.gapi.client.drive
      this.isInitialized = true
      
      // Check if user is already signed in
      const authInstance = window.gapi.auth2.getAuthInstance()
      this.isSignedIn = authInstance.isSignedIn.get()

      console.log('Google Drive API initialized successfully')
      return true
    } catch (error) {
      console.error('Google Drive initialization failed:', error)
      this.isInitialized = false
      return false
    }
  }

  /**
   * Sign in to Google Drive
   */
  async signIn() {
    if (!this.isInitialized) {
      throw new Error('Google Drive API not initialized')
    }

    try {
      const authInstance = window.gapi.auth2.getAuthInstance()
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn()
      }
      this.isSignedIn = true
      return true
    } catch (error) {
      console.error('Google Drive sign-in failed:', error)
      throw error
    }
  }

  /**
   * Create a folder for VeteranLawAI documents
   */
  async createVeteranLawAIFolder() {
    if (!this.isSignedIn) {
      await this.signIn()
    }

    try {
      // Check if folder already exists
      const existingFolder = await this.driveApi.files.list({
        q: "name='VeteranLawAI Documents' and mimeType='application/vnd.google-apps.folder'",
        fields: 'files(id, name)'
      })

      if (existingFolder.result.files.length > 0) {
        return existingFolder.result.files[0].id
      }

      // Create new folder
      const folder = await this.driveApi.files.create({
        resource: {
          name: 'VeteranLawAI Documents',
          mimeType: 'application/vnd.google-apps.folder'
        },
        fields: 'id'
      })

      console.log('Created VeteranLawAI folder:', folder.result.id)
      return folder.result.id
    } catch (error) {
      console.error('Failed to create VeteranLawAI folder:', error)
      throw error
    }
  }

  /**
   * Upload a file to Google Drive
   */
  async uploadFile(file, filename, extractedText = '', metadata = {}) {
    if (!this.isSignedIn) {
      await this.signIn()
    }

    try {
      // Get or create the VeteranLawAI folder
      const folderId = await this.createVeteranLawAIFolder()

      // Prepare file metadata
      const fileMetadata = {
        name: `${filename}_processed_${Date.now()}`,
        parents: [folderId],
        description: `Processed by VeteranLawAI on ${new Date().toISOString()}\n\nOriginal: ${filename}\nDocument Type: ${metadata.formType || 'Unknown'}\nConfidence: ${Math.round((metadata.confidence || 0) * 100)}%\nVA Terms Found: ${metadata.vaTermsFound || 0}\n\nExtracted Text:\n${extractedText.substring(0, 500)}${extractedText.length > 500 ? '...' : ''}`
      }

      // Create form data for upload
      const form = new FormData()
      form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }))
      form.append('file', file)

      // Upload to Google Drive
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
        },
        body: form
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Also upload the extracted text as a separate document
      await this.uploadTextFile(extractedText, `${filename}_extracted_text.txt`, folderId, metadata)

      console.log('File uploaded successfully:', result.id)
      return {
        id: result.id,
        name: result.name,
        webViewLink: `https://drive.google.com/file/d/${result.id}/view`,
        webContentLink: `https://drive.google.com/file/d/${result.id}/edit`
      }
    } catch (error) {
      console.error('File upload failed:', error)
      throw error
    }
  }

  /**
   * Upload extracted text as a separate text file
   */
  async uploadTextFile(text, filename, folderId, metadata = {}) {
    try {
      const textBlob = new Blob([text], { type: 'text/plain' })
      
      const fileMetadata = {
        name: filename,
        parents: [folderId],
        description: `Extracted text from ${filename}\nProcessed by VeteranLawAI\nDocument Type: ${metadata.formType || 'Unknown'}\nConfidence: ${Math.round((metadata.confidence || 0) * 100)}%`
      }

      const form = new FormData()
      form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }))
      form.append('file', textBlob)

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
        },
        body: form
      })

      if (!response.ok) {
        throw new Error(`Text upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Text file uploaded successfully:', result.id)
      return result
    } catch (error) {
      console.error('Text file upload failed:', error)
      throw error
    }
  }

  /**
   * List files in VeteranLawAI folder
   */
  async listFiles() {
    if (!this.isSignedIn) {
      await this.signIn()
    }

    try {
      const folderId = await this.createVeteranLawAIFolder()
      
      const response = await this.driveApi.files.list({
        q: `'${folderId}' in parents`,
        fields: 'files(id, name, createdTime, size, webViewLink)',
        orderBy: 'createdTime desc'
      })

      return response.result.files
    } catch (error) {
      console.error('Failed to list files:', error)
      throw error
    }
  }

  /**
   * Delete a file from Google Drive
   */
  async deleteFile(fileId) {
    if (!this.isSignedIn) {
      await this.signIn()
    }

    try {
      await this.driveApi.files.delete({
        fileId: fileId
      })
      console.log('File deleted successfully:', fileId)
      return true
    } catch (error) {
      console.error('Failed to delete file:', error)
      throw error
    }
  }

  /**
   * Check if Google Drive is properly configured
   */
  isConfigured() {
    return !!(import.meta.env.VITE_GOOGLE_API_KEY && import.meta.env.VITE_GOOGLE_CLIENT_ID)
  }

  /**
   * Get setup instructions for Google Drive
   */
  getSetupInstructions() {
    return {
      message: 'Google Drive integration requires API credentials',
      steps: [
        '1. Go to Google Cloud Console (console.cloud.google.com)',
        '2. Create or select a project',
        '3. Enable Google Drive API',
        '4. Create credentials (API Key + OAuth 2.0 Client ID)',
        '5. Add your domain to authorized origins',
        '6. Add VITE_GOOGLE_API_KEY and VITE_GOOGLE_CLIENT_ID to your .env.local file'
      ],
      documentation: 'https://developers.google.com/drive/api/quickstart/js'
    }
  }
}

// Create and export a singleton instance
export const googleDriveService = new GoogleDriveService()
export default googleDriveService