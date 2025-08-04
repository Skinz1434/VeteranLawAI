// Error handling utility for VeteranLawAI platform
import { toast } from 'react-hot-toast'

export class VeteranLawAIError extends Error {
  constructor(message, code, details = {}) {
    super(message)
    this.name = 'VeteranLawAIError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

export const ErrorCodes = {
  // Authentication errors
  AUTH_FAILED: 'AUTH_FAILED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // API errors
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // File processing errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  OCR_PROCESSING_FAILED: 'OCR_PROCESSING_FAILED',
  
  // Google Drive errors
  DRIVE_CONNECTION_FAILED: 'DRIVE_CONNECTION_FAILED',
  DRIVE_UPLOAD_FAILED: 'DRIVE_UPLOAD_FAILED',
  DRIVE_QUOTA_EXCEEDED: 'DRIVE_QUOTA_EXCEEDED',
  
  // Legal database errors
  SEARCH_FAILED: 'SEARCH_FAILED',
  DATABASE_UNAVAILABLE: 'DATABASE_UNAVAILABLE',
  
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
}

export const ErrorMessages = {
  [ErrorCodes.AUTH_FAILED]: 'Authentication failed. Please check your credentials.',
  [ErrorCodes.SESSION_EXPIRED]: 'Your session has expired. Please sign in again.',
  [ErrorCodes.UNAUTHORIZED]: 'You are not authorized to access this resource.',
  [ErrorCodes.API_ERROR]: 'An error occurred while processing your request.',
  [ErrorCodes.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ErrorCodes.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ErrorCodes.FILE_TOO_LARGE]: 'File size exceeds the maximum limit of 10MB.',
  [ErrorCodes.INVALID_FILE_TYPE]: 'Invalid file type. Please upload a supported format.',
  [ErrorCodes.OCR_PROCESSING_FAILED]: 'Failed to process document. Please try again.',
  [ErrorCodes.DRIVE_CONNECTION_FAILED]: 'Failed to connect to Google Drive. Please check your connection.',
  [ErrorCodes.DRIVE_UPLOAD_FAILED]: 'Failed to upload file to Google Drive.',
  [ErrorCodes.DRIVE_QUOTA_EXCEEDED]: 'Google Drive storage quota exceeded.',
  [ErrorCodes.SEARCH_FAILED]: 'Search failed. Please try again with different terms.',
  [ErrorCodes.DATABASE_UNAVAILABLE]: 'Legal database is temporarily unavailable.',
  [ErrorCodes.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  [ErrorCodes.VALIDATION_ERROR]: 'Please check your input and try again.'
}

export class ErrorHandler {
  static log(error) {
    console.error('[VeteranLawAI Error]', {
      message: error.message,
      code: error.code,
      details: error.details,
      timestamp: error.timestamp,
      stack: error.stack
    })
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service (e.g., Sentry, LogRocket)
      this.sendToErrorTracking(error)
    }
  }

  static handle(error, showToast = true) {
    let processedError

    if (error instanceof VeteranLawAIError) {
      processedError = error
    } else if (error.response) {
      // API error
      processedError = new VeteranLawAIError(
        ErrorMessages[ErrorCodes.API_ERROR],
        ErrorCodes.API_ERROR,
        { status: error.response.status, data: error.response.data }
      )
    } else if (error.request) {
      // Network error
      processedError = new VeteranLawAIError(
        ErrorMessages[ErrorCodes.NETWORK_ERROR],
        ErrorCodes.NETWORK_ERROR,
        { request: error.request }
      )
    } else {
      // Unknown error
      processedError = new VeteranLawAIError(
        ErrorMessages[ErrorCodes.UNKNOWN_ERROR],
        ErrorCodes.UNKNOWN_ERROR,
        { originalError: error.message }
      )
    }

    this.log(processedError)

    if (showToast) {
      this.showErrorToast(processedError)
    }

    return processedError
  }

  static showErrorToast(error) {
    toast.error(error.message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid #ef4444'
      }
    })
  }

  static showSuccessToast(message) {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid #10b981'
      }
    })
  }

  static showInfoToast(message) {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid #3b82f6'
      }
    })
  }

  static sendToErrorTracking(error) {
    // Implement error tracking service integration
    // Example: Sentry.captureException(error)
  }

  static createFileError(file, reason) {
    let code, message

    if (file.size > 10 * 1024 * 1024) { // 10MB
      code = ErrorCodes.FILE_TOO_LARGE
      message = ErrorMessages[ErrorCodes.FILE_TOO_LARGE]
    } else if (!this.isValidFileType(file)) {
      code = ErrorCodes.INVALID_FILE_TYPE
      message = ErrorMessages[ErrorCodes.INVALID_FILE_TYPE]
    } else {
      code = ErrorCodes.UNKNOWN_ERROR
      message = reason || ErrorMessages[ErrorCodes.UNKNOWN_ERROR]
    }

    return new VeteranLawAIError(message, code, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })
  }

  static isValidFileType(file) {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    return validTypes.includes(file.type)
  }

  static async withErrorHandling(asyncFunction, errorMessage = null) {
    try {
      return await asyncFunction()
    } catch (error) {
      const processedError = this.handle(error, true)
      if (errorMessage) {
        this.showErrorToast(new VeteranLawAIError(errorMessage, ErrorCodes.UNKNOWN_ERROR))
      }
      throw processedError
    }
  }

  static validateInput(value, rules) {
    const errors = []

    if (rules.required && (!value || value.trim() === '')) {
      errors.push('This field is required')
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      errors.push(`Minimum length is ${rules.minLength} characters`)
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors.push(`Maximum length is ${rules.maxLength} characters`)
    }

    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push('Please enter a valid email address')
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors.push(rules.patternMessage || 'Invalid format')
    }

    if (errors.length > 0) {
      throw new VeteranLawAIError(
        errors.join(', '),
        ErrorCodes.VALIDATION_ERROR,
        { field: rules.field, errors }
      )
    }

    return true
  }
}

export default ErrorHandler

