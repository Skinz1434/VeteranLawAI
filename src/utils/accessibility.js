/**
 * @fileoverview Accessibility Utilities for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.0
 *
 * Comprehensive accessibility utilities ensuring WCAG 2.1 AA compliance
 * specifically designed for veteran users who may have disabilities.
 *
 * Features:
 * - Screen reader optimization
 * - Keyboard navigation support
 * - Color contrast validation
 * - Focus management
 * - ARIA attribute helpers
 * - Veterans with disabilities considerations
 */

/**
 * WCAG 2.1 AA Color Contrast Ratios
 * Normal text: 4.5:1
 * Large text (18pt+): 3:1
 * UI components: 3:1
 */
const CONTRAST_RATIOS = {
  NORMAL_TEXT: 4.5,
  LARGE_TEXT: 3.0,
  UI_COMPONENTS: 3.0,
}

/**
 * Common disabilities among veterans that affect web accessibility
 */
const VETERAN_ACCESSIBILITY_CONSIDERATIONS = {
  TBI: 'Traumatic Brain Injury - may affect processing speed and attention',
  PTSD: 'Post-traumatic stress - may be triggered by sudden sounds or movements',
  VISION: 'Vision impairments from combat injuries or aging',
  HEARING: 'Hearing loss from noise exposure during service',
  MOBILITY: 'Limited mobility from combat injuries or aging',
  COGNITIVE: 'Cognitive processing differences from TBI or PTSD',
}

/**
 * Calculate relative luminance of a color
 * @param {string} color - Hex color code
 * @returns {number} Relative luminance value
 */
export function getRelativeLuminance(color) {
  // Remove # if present
  color = color.replace('#', '')

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16) / 255
  const g = parseInt(color.substr(2, 2), 16) / 255
  const b = parseInt(color.substr(4, 2), 16) / 255

  // Apply gamma correction
  const rs = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const gs = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const bs = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio
 */
export function getContrastRatio(color1, color2) {
  const l1 = getRelativeLuminance(color1)
  const l2 = getRelativeLuminance(color2)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if color combination meets WCAG standards
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @param {string} level - 'normal', 'large', or 'ui'
 * @returns {Object} Compliance result
 */
export function checkColorCompliance(foreground, background, level = 'normal') {
  const ratio = getContrastRatio(foreground, background)
  const requiredRatio =
    level === 'large'
      ? CONTRAST_RATIOS.LARGE_TEXT
      : level === 'ui'
        ? CONTRAST_RATIOS.UI_COMPONENTS
        : CONTRAST_RATIOS.NORMAL_TEXT

  return {
    ratio: Math.round(ratio * 100) / 100,
    required: requiredRatio,
    passes: ratio >= requiredRatio,
    level: ratio >= 7 ? 'AAA' : ratio >= requiredRatio ? 'AA' : 'Fail',
    recommendation:
      ratio < requiredRatio
        ? `Increase contrast. Current: ${Math.round(ratio * 100) / 100}:1, Required: ${requiredRatio}:1`
        : 'Contrast meets accessibility standards',
  }
}

/**
 * Generate ARIA attributes for complex UI components
 * @param {Object} options - Configuration options
 * @returns {Object} ARIA attributes
 */
export function generateAriaAttributes(options = {}) {
  const {
    role,
    label,
    labelledby,
    describedby,
    expanded,
    selected,
    checked,
    disabled,
    required,
    invalid,
    live = 'polite',
    atomic = false,
    relevant = 'additions text',
  } = options

  const attrs = {}

  if (role) attrs['role'] = role
  if (label) attrs['aria-label'] = label
  if (labelledby) attrs['aria-labelledby'] = labelledby
  if (describedby) attrs['aria-describedby'] = describedby
  if (expanded !== undefined) attrs['aria-expanded'] = expanded.toString()
  if (selected !== undefined) attrs['aria-selected'] = selected.toString()
  if (checked !== undefined) attrs['aria-checked'] = checked.toString()
  if (disabled !== undefined) attrs['aria-disabled'] = disabled.toString()
  if (required !== undefined) attrs['aria-required'] = required.toString()
  if (invalid !== undefined) attrs['aria-invalid'] = invalid.toString()
  if (live) attrs['aria-live'] = live
  if (atomic) attrs['aria-atomic'] = atomic.toString()
  if (relevant) attrs['aria-relevant'] = relevant

  return attrs
}

/**
 * Create screen reader-only text element
 * @param {string} text - Text for screen readers
 * @returns {Object} React props for screen reader text
 */
export function createScreenReaderText(text) {
  return {
    children: text,
    className: 'sr-only',
    'aria-hidden': false,
  }
}

/**
 * Enhanced focus management for complex interfaces
 */
export class FocusManager {
  constructor() {
    this.focusStack = []
    this.trapActive = false
  }

  /**
   * Save current focus to stack
   */
  saveFocus() {
    const activeElement = document.activeElement
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement)
    }
  }

  /**
   * Restore last saved focus
   */
  restoreFocus() {
    const element = this.focusStack.pop()
    if (element && element.focus) {
      // Delay to ensure DOM is ready
      setTimeout(() => {
        element.focus()
      }, 10)
    }
  }

  /**
   * Trap focus within an element (for modals, etc.)
   * @param {HTMLElement} element - Container element
   */
  trapFocus(element) {
    if (!element) return

    this.trapActive = true
    const focusableElements = this.getFocusableElements(element)
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = e => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)

    // Focus first element
    if (firstElement) {
      firstElement.focus()
    }

    return () => {
      element.removeEventListener('keydown', handleKeyDown)
      this.trapActive = false
    }
  }

  /**
   * Get all focusable elements within a container
   * @param {HTMLElement} container - Container element
   * @returns {HTMLElement[]} Array of focusable elements
   */
  getFocusableElements(container) {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(',')

    return Array.from(container.querySelectorAll(focusableSelectors)).filter(element => {
      return (
        element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
      )
    })
  }
}

/**
 * Keyboard navigation helpers
 */
export const KeyboardNavigation = {
  /**
   * Handle arrow key navigation for lists/grids
   * @param {KeyboardEvent} event - Keyboard event
   * @param {Object} options - Navigation options
   */
  handleArrowKeys(event, options = {}) {
    const { currentIndex, itemCount, onNavigate, orientation = 'vertical', wrap = true } = options

    let newIndex = currentIndex

    switch (event.key) {
      case 'ArrowUp':
        if (orientation === 'vertical') {
          event.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : wrap ? itemCount - 1 : 0
        }
        break
      case 'ArrowDown':
        if (orientation === 'vertical') {
          event.preventDefault()
          newIndex = currentIndex < itemCount - 1 ? currentIndex + 1 : wrap ? 0 : itemCount - 1
        }
        break
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          event.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : wrap ? itemCount - 1 : 0
        }
        break
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          event.preventDefault()
          newIndex = currentIndex < itemCount - 1 ? currentIndex + 1 : wrap ? 0 : itemCount - 1
        }
        break
      case 'Home':
        event.preventDefault()
        newIndex = 0
        break
      case 'End':
        event.preventDefault()
        newIndex = itemCount - 1
        break
    }

    if (newIndex !== currentIndex && onNavigate) {
      onNavigate(newIndex)
    }
  },

  /**
   * Create keyboard event handler for buttons/interactive elements
   * @param {Function} onClick - Click handler
   * @returns {Function} Keyboard event handler
   */
  createKeyHandler(onClick) {
    return event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onClick(event)
      }
    }
  },
}

/**
 * Announce important changes to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Validate form accessibility
 * @param {HTMLFormElement} form - Form element to validate
 * @returns {Object} Validation results
 */
export function validateFormAccessibility(form) {
  const issues = []
  const inputs = form.querySelectorAll('input, select, textarea')

  inputs.forEach((input, index) => {
    // Check for labels
    const hasLabel = input.id && form.querySelector(`label[for="${input.id}"]`)
    const hasAriaLabel = input.getAttribute('aria-label')
    const hasAriaLabelledby = input.getAttribute('aria-labelledby')

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby) {
      issues.push({
        element: input,
        issue: 'Missing label',
        suggestion: 'Add a label element or aria-label attribute',
        severity: 'error',
      })
    }

    // Check required fields
    if (input.required && !input.getAttribute('aria-required')) {
      issues.push({
        element: input,
        issue: 'Missing aria-required on required field',
        suggestion: 'Add aria-required="true" to required fields',
        severity: 'warning',
      })
    }

    // Check error states
    if (input.getAttribute('aria-invalid') === 'true') {
      const errorId = input.getAttribute('aria-describedby')
      if (!errorId || !form.querySelector(`#${errorId}`)) {
        issues.push({
          element: input,
          issue: 'Invalid field without error description',
          suggestion: 'Link to error message with aria-describedby',
          severity: 'error',
        })
      }
    }
  })

  return {
    isAccessible: issues.filter(i => i.severity === 'error').length === 0,
    issues,
    score: Math.round(((inputs.length - issues.length) / inputs.length) * 100),
  }
}

/**
 * Generate veteran-specific accessibility recommendations
 * @param {string} userType - Type of veteran user
 * @returns {Object} Recommendations
 */
export function getVeteranAccessibilityRecommendations(userType = 'general') {
  const recommendations = {
    general: [
      'Use clear, simple language (avoid legal jargon when possible)',
      'Provide consistent navigation patterns',
      'Include skip links for keyboard users',
      'Ensure 4.5:1 color contrast minimum',
      'Allow users to pause auto-playing content',
    ],
    tbi: [
      'Reduce cognitive load with clear headings and sections',
      'Provide progress indicators for multi-step processes',
      'Allow extra time for form completion',
      'Use consistent layouts and navigation',
      'Minimize distractions and animations',
    ],
    ptsd: [
      'Avoid sudden audio or visual changes',
      'Provide clear warnings for potentially triggering content',
      'Allow users to control autoplay features',
      'Use calming color schemes',
      'Provide easy exit options from stressful processes',
    ],
    vision: [
      'Support screen readers with proper ARIA labels',
      'Ensure high contrast ratios (7:1 for AAA)',
      'Make all functionality available via keyboard',
      'Support browser zoom up to 200%',
      'Use descriptive link text and headings',
    ],
    hearing: [
      'Provide captions for all video content',
      'Include visual indicators for audio alerts',
      'Offer text alternatives to audio instructions',
      'Use visual focus indicators',
      'Provide transcripts for audio content',
    ],
    mobility: [
      'Ensure all interactive elements are keyboard accessible',
      'Make click targets at least 44px square',
      'Provide sufficient time for interactions',
      'Support voice control software',
      'Avoid requiring precise mouse movements',
    ],
  }

  return {
    primary: recommendations[userType] || recommendations.general,
    additional: recommendations.general,
    resources: [
      'VA.gov Accessibility Guidelines',
      'Section 508 Compliance Resources',
      'WCAG 2.1 AA Standards',
    ],
  }
}

/**
 * Create accessible loading state
 * @param {string} loadingText - Text to announce
 * @returns {Object} Props for loading component
 */
export function createAccessibleLoading(loadingText = 'Loading content') {
  return {
    role: 'status',
    'aria-live': 'polite',
    'aria-label': loadingText,
    'data-loading-text': loadingText,
  }
}

// Create singleton focus manager
export const focusManager = new FocusManager()

// Export utility object for easy importing
export const AccessibilityUtils = {
  checkColorCompliance,
  generateAriaAttributes,
  createScreenReaderText,
  announceToScreenReader,
  validateFormAccessibility,
  getVeteranAccessibilityRecommendations,
  createAccessibleLoading,
  KeyboardNavigation,
  focusManager,
  VETERAN_ACCESSIBILITY_CONSIDERATIONS,
}
