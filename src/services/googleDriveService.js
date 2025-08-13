/**
 * @fileoverview Google Drive Service for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.0
 *
 * Provides seamless integration with Google Drive for document storage,
 * collaboration, and backup throughout the platform.
 */

import { auth } from '../config/firebase'

/**
 * Google Drive Service Class
 * Handles all Google Drive operations including file upload, download,
 * sharing, and organization for VA legal documents.
 */
export class GoogleDriveService {
  constructor() {
    this.isInitialized = false
    this.gapi = null
    this.driveAPI = null
    this.folderId = null
    this.uploadQueue = []
    this.isProcessing = false
  }

  /**
   * Initialize Google Drive API
   */
  async initialize() {
    try {
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to access Google Drive')
      }

      // Load Google API client
      await this.loadGoogleAPI()

      // Initialize Drive API
      await this.initializeDriveAPI()

      // Create or find VeteranLawAI folder
      await this.setupVeteranLawAIFolder()

      this.isInitialized = true
      console.log('Google Drive service initialized successfully')

      return { success: true }
    } catch (error) {
      console.error('Failed to initialize Google Drive service:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Load Google API client
   */
  async loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      // Check if Google API is already loaded
      if (window.gapi) {
        this.gapi = window.gapi
        resolve()
        return
      }

      // Load Google API script
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = () => {
        this.gapi = window.gapi
        resolve()
      }
      script.onerror = () => reject(new Error('Failed to load Google API'))
      document.head.appendChild(script)
    })
  }

  /**
   * Initialize Google Drive API
   */
  async initializeDriveAPI() {
    return new Promise((resolve, reject) => {
      this.gapi.load('client:auth2', async () => {
        try {
          await this.gapi.client.init({
            apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.file',
          })

          // Check if user is already signed in
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

  /**
   * Setup VeteranLawAI folder structure
   */
  async setupVeteranLawAIFolder() {
    try {
      // Search for existing VeteranLawAI folder
      const response = await this.driveAPI.files.list({
        q: "name='VeteranLawAI' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        spaces: 'drive',
        fields: 'files(id, name)',
      })

      if (response.result.files.length > 0) {
        this.folderId = response.result.files[0].id
        console.log('Found existing VeteranLawAI folder:', this.folderId)
      } else {
        // Create new VeteranLawAI folder
        const folder = await this.driveAPI.files.create({
          resource: {
            name: 'VeteranLawAI',
            mimeType: 'application/vnd.google-apps.folder',
            description: 'VeteranLawAI Platform Documents',
          },
          fields: 'id, name',
        })

        this.folderId = folder.result.id
        console.log('Created new VeteranLawAI folder:', this.folderId)

        // Create subfolders for organization
        await this.createSubfolders()
      }

      return this.folderId
    } catch (error) {
      console.error('Failed to setup VeteranLawAI folder:', error)
      throw error
    }
  }

  /**
   * Create organized subfolders
   */
  async createSubfolders() {
    const subfolders = [
      'VA Forms',
      'Medical Records',
      'Legal Documents',
      'Case Files',
      'OCR Results',
      'Audio Transcripts',
      'Research Materials',
      'Analytics Reports',
    ]

    for (const folderName of subfolders) {
      try {
        await this.driveAPI.files.create({
          resource: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [this.folderId],
            description: `${folderName} for VeteranLawAI Platform`,
          },
        })
      } catch (error) {
        console.warn(`Failed to create subfolder ${folderName}:`, error)
      }
    }
  }

  /**
   * Upload file to Google Drive
   */
  async uploadFile(file, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Google Drive service not initialized')
    }

    const { folderName = 'Documents', description = '', tags = [], metadata = {} } = options

    try {
      // Find or create folder
      const folderId = await this.findOrCreateFolder(folderName)

      // Prepare file metadata
      const fileMetadata = {
        name: file.name,
        parents: [folderId],
        description: description || `Uploaded via VeteranLawAI Platform`,
        properties: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          platform: 'VeteranLawAI',
          tags: tags.join(','),
        },
      }

      // Upload file
      const response = await this.driveAPI.files.create({
        resource: fileMetadata,
        media: {
          mimeType: file.type,
          body: file,
        },
        fields: 'id, name, size, webViewLink, createdTime',
      })

      const uploadedFile = response.result

      console.log('File uploaded successfully:', uploadedFile)

      // Add to upload queue for processing
      this.uploadQueue.push({
        id: uploadedFile.id,
        name: uploadedFile.name,
        size: uploadedFile.size,
        link: uploadedFile.webViewLink,
        uploadedAt: uploadedFile.createdTime,
      })

      return {
        success: true,
        fileId: uploadedFile.id,
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size,
        webViewLink: uploadedFile.webViewLink,
        createdTime: uploadedFile.createdTime,
      }
    } catch (error) {
      console.error('File upload failed:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Find or create folder by name
   */
  async findOrCreateFolder(folderName) {
    try {
      // Search for existing folder
      const response = await this.driveAPI.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${this.folderId}' in parents and trashed=false`,
        spaces: 'drive',
        fields: 'files(id, name)',
      })

      if (response.result.files.length > 0) {
        return response.result.files[0].id
      }

      // Create new folder
      const folder = await this.driveAPI.files.create({
        resource: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [this.folderId],
          description: `${folderName} folder for VeteranLawAI Platform`,
        },
        fields: 'id, name',
      })

      return folder.result.id
    } catch (error) {
      console.error('Failed to find or create folder:', error)
      // Fallback to main folder
      return this.folderId
    }
  }

  /**
   * Download file from Google Drive
   */
  async downloadFile(fileId) {
    if (!this.isInitialized) {
      throw new Error('Google Drive service not initialized')
    }

    try {
      const response = await this.driveAPI.files.get({
        fileId,
        alt: 'media',
      })

      return {
        success: true,
        data: response.body,
        contentType: response.headers['content-type'],
      }
    } catch (error) {
      console.error('File download failed:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * List files in folder
   */
  async listFiles(folderName = null, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Google Drive service not initialized')
    }

    const { pageSize = 50, orderBy = 'createdTime desc', query = '' } = options

    try {
      let q = `'${this.folderId}' in parents and trashed=false`

      if (folderName) {
        const folderId = await this.findOrCreateFolder(folderName)
        q = `'${folderId}' in parents and trashed=false`
      }

      if (query) {
        q += ` and (name contains '${query}' or description contains '${query}')`
      }

      const response = await this.driveAPI.files.list({
        q,
        pageSize,
        orderBy,
        fields:
          'nextPageToken, files(id, name, size, mimeType, createdTime, modifiedTime, webViewLink, description, properties)',
      })

      return {
        success: true,
        files: response.result.files || [],
        nextPageToken: response.result.nextPageToken,
      }
    } catch (error) {
      console.error('Failed to list files:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Share file with specific permissions
   */
  async shareFile(fileId, permissions = {}) {
    if (!this.isInitialized) {
      throw new Error('Google Drive service not initialized')
    }

    const { role = 'reader', type = 'user', emailAddress = null, domain = null } = permissions

    try {
      const permission = {
        role,
        type,
      }

      if (emailAddress) {
        permission.emailAddress = emailAddress
      }

      if (domain) {
        permission.domain = domain
      }

      const response = await this.driveAPI.permissions.create({
        fileId,
        resource: permission,
        fields: 'id, role, type',
      })

      return {
        success: true,
        permissionId: response.result.id,
        role: response.result.role,
        type: response.result.type,
      }
    } catch (error) {
      console.error('Failed to share file:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Delete file from Google Drive
   */
  async deleteFile(fileId) {
    if (!this.isInitialized) {
      throw new Error('Google Drive service not initialized')
    }

    try {
      await this.driveAPI.files.delete({
        fileId,
      })

      return { success: true }
    } catch (error) {
      console.error('Failed to delete file:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(fileId) {
    if (!this.isInitialized) {
      throw new Error('Google Drive service not initialized')
    }

    try {
      const response = await this.driveAPI.files.get({
        fileId,
        fields:
          'id, name, size, mimeType, createdTime, modifiedTime, webViewLink, description, properties, parents',
      })

      return {
        success: true,
        metadata: response.result,
      }
    } catch (error) {
      console.error('Failed to get file metadata:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Update file metadata
   */
  async updateFileMetadata(fileId, updates) {
    if (!this.isInitialized) {
      throw new Error('Google Drive service not initialized')
    }

    try {
      const response = await this.driveAPI.files.update({
        fileId,
        resource: updates,
        fields: 'id, name, description, properties',
      })

      return {
        success: true,
        updatedFile: response.result,
      }
    } catch (error) {
      console.error('Failed to update file metadata:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats() {
    if (!this.isInitialized) {
      throw new Error('Google Drive service not initialized')
    }

    try {
      const response = await this.driveAPI.about.get({
        fields: 'storageQuota',
      })

      const quota = response.result.storageQuota

      return {
        success: true,
        total: parseInt(quota.limit),
        used: parseInt(quota.usage),
        available: parseInt(quota.limit) - parseInt(quota.usage),
        usagePercentage: (parseInt(quota.usage) / parseInt(quota.limit)) * 100,
      }
    } catch (error) {
      console.error('Failed to get storage stats:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Get service status and capabilities
   */
  getServiceInfo() {
    return {
      initialized: this.isInitialized,
      folderId: this.folderId,
      uploadQueueLength: this.uploadQueue.length,
      isProcessing: this.isProcessing,
      capabilities: {
        upload: true,
        download: true,
        sharing: true,
        organization: true,
        metadata: true,
        search: true,
      },
    }
  }

  /**
   * Cleanup and disconnect
   */
  async cleanup() {
    try {
      if (this.gapi && this.gapi.auth2) {
        await this.gapi.auth2.getAuthInstance().signOut()
      }

      this.isInitialized = false
      this.gapi = null
      this.driveAPI = null
      this.folderId = null

      console.log('Google Drive service cleaned up successfully')
    } catch (error) {
      console.error('Failed to cleanup Google Drive service:', error)
    }
  }
}

// Create singleton instance
export const googleDriveService = new GoogleDriveService()

// Export utility functions
export const initializeGoogleDrive = async () => {
  return await googleDriveService.initialize()
}

export const uploadToGoogleDrive = async (file, options) => {
  return await googleDriveService.uploadFile(file, options)
}

export const downloadFromGoogleDrive = async fileId => {
  return await googleDriveService.downloadFile(fileId)
}

export const listGoogleDriveFiles = async (folderName, options) => {
  return await googleDriveService.listFiles(folderName, options)
}

export const getGoogleDriveServiceInfo = () => {
  return googleDriveService.getServiceInfo()
}
