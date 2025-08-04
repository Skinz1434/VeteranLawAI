/**
 * @fileoverview Error Boundary Component for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.0
 * 
 * Comprehensive error handling with veteran-friendly error messages
 * and accessibility features. Provides fallback UI when components crash.
 */

import React from 'react'
import { AlertTriangle, RefreshCw, Home, Phone, Mail } from 'lucide-react'
import Button from '../ui/Button'
import { announceToScreenReader } from '../../utils/accessibility'

/**
 * Error Boundary Class Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Announce error to screen readers
    announceToScreenReader(
      'An error occurred while loading this section. Please try refreshing or contact support if the problem persists.',
      'assertive'
    )

    // Report error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo)
    }
  }

  /**
   * Report error to monitoring service
   * @param {Error} error - The error that occurred
   * @param {Object} errorInfo - Error boundary info
   */
  reportError = (error, errorInfo) => {
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.props.userId || 'anonymous'
    }

    // Send to error reporting service
    // This would integrate with services like Sentry, LogRocket, etc.
    console.log('Error report:', errorReport)
  }

  /**
   * Attempt to recover from error
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })

    // Announce recovery attempt
    announceToScreenReader('Attempting to reload the section')

    // Optional: Call parent retry handler
    if (this.props.onRetry) {
      this.props.onRetry()
    }
  }

  /**
   * Navigate to home page
   */
  handleGoHome = () => {
    window.location.href = '/'
  }

  /**
   * Get user-friendly error message based on error type
   */
  getUserFriendlyMessage() {
    const { error } = this.state
    const { errorType = 'general' } = this.props

    if (!error) return null

    // Network-related errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        title: 'Connection Problem',
        message: 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.',
        suggestion: 'If you continue to have problems, please contact our support team.'
      }
    }

    // Permission errors
    if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      return {
        title: 'Access Issue',
        message: 'You may not have permission to access this information, or your session may have expired.',
        suggestion: 'Please try logging in again or contact support if you believe this is an error.'
      }
    }

    // Data loading errors
    if (error.message.includes('parse') || error.message.includes('JSON')) {
      return {
        title: 'Data Loading Problem',
        message: 'We encountered a problem loading your information.',
        suggestion: 'Please try refreshing the page. If the problem continues, contact support.'
      }
    }

    // Component-specific errors
    const componentMessages = {
      analytics: {
        title: 'Analytics Unavailable',
        message: 'We\'re having trouble loading your analytics data right now.',
        suggestion: 'Please try again in a few minutes. Your data is safe and will be available shortly.'
      },
      caseresearch: {
        title: 'Case Research Unavailable',
        message: 'The legal research tools are temporarily unavailable.',
        suggestion: 'Please try again shortly. You can still access other features of the platform.'
      },
      claimguidance: {
        title: 'Claim Guidance Unavailable',
        message: 'The claim guidance tools are having issues loading.',
        suggestion: 'Please try refreshing or contact support for immediate assistance with your claim.'
      }
    }

    return componentMessages[errorType] || {
      title: 'Something Went Wrong',
      message: 'We encountered an unexpected problem while loading this section.',
      suggestion: 'Please try refreshing the page or contact our support team if the problem continues.'
    }
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.getUserFriendlyMessage()
      const { showDetails = false, supportEmail = 'support@veteranlawai.com', supportPhone = '1-800-VETERAN' } = this.props

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-8 border border-red-500/20 shadow-2xl">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
                  <AlertTriangle className="h-10 w-10 text-red-400" />
                </div>
              </div>

              {/* Error Content */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">
                  {errorMessage?.title || 'Oops! Something went wrong'}
                </h1>
                
                <p className="text-slate-300 text-lg mb-4 leading-relaxed">
                  {errorMessage?.message || 'We encountered an unexpected error while loading this page.'}
                </p>
                
                <p className="text-slate-400 text-sm">
                  {errorMessage?.suggestion || 'Please try refreshing the page or contact support if the problem persists.'}
                </p>

                {/* Error ID for support reference */}
                <div className="mt-4 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <p className="text-slate-400 text-xs">
                    Error Reference: <span className="text-slate-300 font-mono">{this.state.errorId}</span>
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Please include this reference when contacting support
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button
                  onClick={this.handleRetry}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 flex items-center justify-center"
                  aria-label="Try to reload this section"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex items-center justify-center"
                  aria-label="Return to the homepage"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Button>
              </div>

              {/* Support Information */}
              <div className="border-t border-slate-600/30 pt-6">
                <h3 className="text-white font-semibold mb-4 text-center">Need Help?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-center space-x-2 text-slate-300">
                    <Phone className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Call: {supportPhone}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-slate-300">
                    <Mail className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">Email: {supportEmail}</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs text-center mt-3">
                  Our support team is here to help veterans and their representatives
                </p>
              </div>

              {/* Development Details (only in development) */}
              {showDetails && process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6">
                  <summary className="text-slate-300 cursor-pointer text-sm font-medium mb-2">
                    Technical Details (Development Only)
                  </summary>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600/30">
                    <h4 className="text-red-400 font-medium mb-2">Error:</h4>
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap mb-4 overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                    
                    {this.state.errorInfo && (
                      <>
                        <h4 className="text-red-400 font-medium mb-2">Component Stack:</h4>
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </>
                    )}
                  </div>
                </details>
              )}
            </div>

            {/* Accessibility Information */}
            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                If you're using assistive technology and need immediate help, 
                please call our accessibility support line at {supportPhone}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 * @param {React.Component} Component - Component to wrap
 * @param {Object} errorBoundaryProps - Props for error boundary
 * @returns {React.Component} Wrapped component
 */
export function withErrorBoundary(Component, errorBoundaryProps = {}) {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

/**
 * Hook for error handling in functional components
 * @returns {Function} Error reporter function
 */
export function useErrorHandler() {
  return (error, errorInfo = {}) => {
    console.error('Component error:', error, errorInfo)
    
    // Announce error to screen readers
    announceToScreenReader(
      'An error occurred. Please try refreshing or contact support.',
      'assertive'
    )
    
    // Could integrate with error reporting service here
    if (process.env.NODE_ENV === 'production') {
      // Report to monitoring service
    }
  }
}

export default ErrorBoundary