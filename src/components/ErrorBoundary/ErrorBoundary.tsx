import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  level?: 'page' | 'component' | 'critical'
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })

    // Log error for monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Send error to monitoring service (if available)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: this.props.level === 'critical'
      })
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Announce error to screen readers
    setTimeout(() => {
      if (typeof window !== 'undefined' && 'announceToScreenReader' in window) {
        (window as any).announceToScreenReader(
          `An error occurred in the ${this.props.level || 'application'}. Please try refreshing the page or contact support if the issue persists.`
        )
      }
    }, 100)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    })
  }

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state
    const errorReport = {
      id: errorId,
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // Copy error report to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        alert('Error report copied to clipboard. Please share this with our support team.')
      })
      .catch(() => {
        alert('Failed to copy error report. Please manually copy the error details shown below.')
      })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { level = 'component' } = this.props
      const { error, errorInfo, errorId } = this.state

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {level === 'critical' ? 'Critical Error' : 'Something went wrong'}
              </h1>
              <p className="text-slate-300 mb-6">
                {level === 'critical' 
                  ? 'A critical error has occurred that prevents the application from functioning properly.'
                  : 'We encountered an unexpected error. This might be a temporary issue.'
                }
              </p>
            </div>

            {/* Error Details (Development/Debug) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="mb-6 text-left bg-slate-800/50 rounded-lg p-4 overflow-auto max-h-48">
                <h3 className="font-semibold text-red-400 mb-2">Error Details (Development Mode):</h3>
                <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                  {error.toString()}
                  {errorInfo?.componentStack && '\n\nComponent Stack:' + errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Error ID for Support */}
            <div className="mb-6 p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-slate-400 mb-2">Error ID for support:</p>
              <code className="text-sm text-cyan-400 font-mono">{errorId}</code>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                className="flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>

              {level === 'critical' && (
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="flex items-center justify-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              )}

              <Button
                variant="outline"
                onClick={this.handleReportError}
                className="flex items-center justify-center"
              >
                <Bug className="h-4 w-4 mr-2" />
                Report Error
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                If this error persists, please{' '}
                <a 
                  href="mailto:support@vaadvocate.com" 
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  contact support
                </a>{' '}
                with the error ID above.
              </p>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easy wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Hook for programmatic error throwing (useful for async errors)
export const useErrorHandler = () => {
  return React.useCallback((error: Error) => {
    throw error
  }, [])
}

export default ErrorBoundary