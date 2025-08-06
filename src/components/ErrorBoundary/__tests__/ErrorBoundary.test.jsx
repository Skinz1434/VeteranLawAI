import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorBoundary from '../ErrorBoundary'

// Mock console.error to avoid noise in test output
const originalError = console.error
beforeAll(() => {
  console.error = vi.fn()
})

afterAll(() => {
  console.error = originalError
})

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    // Check for veteran-friendly error messaging
    expect(screen.getByRole('heading', { name: /Something Went Wrong/i })).toBeInTheDocument()
    expect(screen.getByText(/encountered an unexpected problem/i)).toBeInTheDocument()
  })

  it('provides accessible error information', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    // Check for ARIA attributes
    const errorContainer = screen.getByRole('alert')
    expect(errorContainer).toHaveAttribute('aria-live', 'assertive')
  })

  it('shows support contact information', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    // Check for VA support contacts
    expect(screen.getByText('1-800-VETERAN')).toBeInTheDocument()
    expect(screen.getByText('support@veteranlawai.com')).toBeInTheDocument()
  })

  it('allows page refresh', async () => {
    const user = userEvent.setup()
    const mockReload = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    const refreshButton = screen.getByRole('button', { name: /reload this section/i })
    await user.click(refreshButton)
    
    expect(mockReload).toHaveBeenCalled()
  })

  it('provides keyboard navigation', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('tabIndex', '0')
    })
  })

  it('handles veteran-specific considerations', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    // Should have clear, non-technical language
    expect(screen.queryByText(/stack trace/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/exception/i)).not.toBeInTheDocument()
    
    // Should have reassuring messaging
    expect(screen.getByText(/Your work is automatically saved/i)).toBeInTheDocument()
  })

  it('logs error details for debugging', () => {
    const testError = new Error('Test error message')
    const errorInfo = { componentStack: 'test stack' }
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(console.error).toHaveBeenCalled()
  })
})