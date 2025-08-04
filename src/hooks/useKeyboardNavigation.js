/**
 * @fileoverview Keyboard Navigation Hook for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.0
 * 
 * Comprehensive keyboard navigation support for accessibility compliance.
 * Provides keyboard shortcuts, focus management, and navigation helpers.
 */

import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { announceToScreenReader } from '../utils/accessibility'

/**
 * Keyboard Navigation Hook
 * Provides comprehensive keyboard navigation functionality
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} Navigation utilities and handlers
 */
export function useKeyboardNavigation(options = {}) {
  const {
    enableGlobalShortcuts = true,
    enableArrowNavigation = false,
    enableEscapeHandling = true,
    containerRef = null,
    onNavigate = null
  } = options

  const navigate = useNavigate()
  const currentFocusIndex = useRef(-1)
  const focusableElements = useRef([])

  /**
   * Global keyboard shortcuts for the platform
   */
  const globalShortcuts = {
    // Navigation shortcuts
    'Alt+h': () => navigate('/'),
    'Alt+a': () => navigate('/analytics'),
    'Alt+c': () => navigate('/case-research'),
    'Alt+l': () => navigate('/legal-knowledge'),
    'Alt+g': () => navigate('/claim-guidance'),
    'Alt+t': () => navigate('/audio-transcription'),
    'Alt+o': () => navigate('/camera-ocr'),
    
    // Accessibility shortcuts
    'Alt+s': () => focusSearch(),
    'Alt+n': () => focusNavigation(),
    'Alt+m': () => focusMainContent(),
    
    // Help shortcuts
    'Alt+?': () => showKeyboardShortcuts(),
    'F1': () => showKeyboardShortcuts()
  }

  /**
   * Update focusable elements list
   */
  const updateFocusableElements = useCallback(() => {
    if (!containerRef?.current) {
      focusableElements.current = []
      return
    }

    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      '.focusable'
    ].join(', ')

    const elements = Array.from(containerRef.current.querySelectorAll(selectors))
      .filter(element => {
        // Filter out invisible elements
        const style = window.getComputedStyle(element)
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               element.offsetWidth > 0 && 
               element.offsetHeight > 0
      })

    focusableElements.current = elements
  }, [containerRef])

  /**
   * Handle arrow key navigation
   */
  const handleArrowNavigation = useCallback((event) => {
    if (!enableArrowNavigation || focusableElements.current.length === 0) return

    const { key } = event
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return

    event.preventDefault()

    const currentIndex = focusableElements.current.indexOf(document.activeElement)
    let newIndex = currentIndex

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = currentIndex < focusableElements.current.length - 1 ? currentIndex + 1 : 0
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.current.length - 1
        break
      case 'Home':
        newIndex = 0
        break
      case 'End':
        newIndex = focusableElements.current.length - 1
        break
    }

    if (newIndex !== currentIndex && focusableElements.current[newIndex]) {
      focusableElements.current[newIndex].focus()
      currentFocusIndex.current = newIndex
      
      if (onNavigate) {
        onNavigate(newIndex, focusableElements.current[newIndex])
      }
    }
  }, [enableArrowNavigation, onNavigate])

  /**
   * Handle escape key for modal/overlay dismissal
   */
  const handleEscapeKey = useCallback((event) => {
    if (!enableEscapeHandling || event.key !== 'Escape') return

    // Check for open modals or overlays
    const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]')
    const openDropdown = document.querySelector('[aria-expanded="true"]')
    const openPopover = document.querySelector('.popover.open')

    if (openModal) {
      // Close modal and return focus to trigger
      const closeButton = openModal.querySelector('[aria-label*="close"], [data-dismiss="modal"]')
      if (closeButton) {
        closeButton.click()
      }
      event.preventDefault()
      announceToScreenReader('Modal closed')
    } else if (openDropdown) {
      // Close dropdown
      const trigger = document.querySelector(`[aria-controls="${openDropdown.id}"]`)
      if (trigger) {
        trigger.click()
        trigger.focus()
      }
      event.preventDefault()
      announceToScreenReader('Dropdown closed')
    } else if (openPopover) {
      // Close popover
      openPopover.classList.remove('open')
      event.preventDefault()
    }
  }, [enableEscapeHandling])

  /**
   * Handle global keyboard shortcuts
   */
  const handleGlobalShortcuts = useCallback((event) => {
    if (!enableGlobalShortcuts) return

    const shortcutKey = getShortcutKey(event)
    const handler = globalShortcuts[shortcutKey]

    if (handler) {
      event.preventDefault()
      handler()
    }
  }, [enableGlobalShortcuts, navigate])

  /**
   * Get shortcut key combination from event
   */
  const getShortcutKey = (event) => {
    const parts = []
    if (event.ctrlKey) parts.push('Ctrl')
    if (event.altKey) parts.push('Alt')
    if (event.shiftKey) parts.push('Shift')
    if (event.metaKey) parts.push('Meta')
    
    // Handle special keys
    if (event.key === 'F1') return 'F1'
    if (event.key !== 'Control' && event.key !== 'Alt' && event.key !== 'Shift' && event.key !== 'Meta') {
      parts.push(event.key)
    }
    
    return parts.join('+')
  }

  /**
   * Focus search input
   */
  const focusSearch = useCallback(() => {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i], #search-input')
    if (searchInput) {
      searchInput.focus()
      announceToScreenReader('Search focused')
    }
  }, [])

  /**
   * Focus navigation
   */
  const focusNavigation = useCallback(() => {
    const navigation = document.querySelector('nav, #navigation, .navigation')
    if (navigation) {
      const firstLink = navigation.querySelector('a, button')
      if (firstLink) {
        firstLink.focus()
        announceToScreenReader('Navigation focused')
      }
    }
  }, [])

  /**
   * Focus main content
   */
  const focusMainContent = useCallback(() => {
    const mainContent = document.querySelector('main, #main-content, .main-content')
    if (mainContent) {
      mainContent.focus()
      announceToScreenReader('Main content focused')
    }
  }, [])

  /**
   * Show keyboard shortcuts help
   */
  const showKeyboardShortcuts = useCallback(() => {
    const shortcuts = [
      'Alt+H: Go to Home',
      'Alt+A: Go to Analytics',
      'Alt+C: Go to Case Research',
      'Alt+L: Go to Legal Knowledge',
      'Alt+G: Go to Claim Guidance',
      'Alt+T: Go to Audio Transcription',
      'Alt+O: Go to Camera OCR',
      'Alt+S: Focus Search',
      'Alt+N: Focus Navigation',
      'Alt+M: Focus Main Content',
      'Alt+?: Show this help',
      'Escape: Close modals/dropdowns',
      'Tab: Next element',
      'Shift+Tab: Previous element'
    ]

    const message = 'Keyboard shortcuts available:\n' + shortcuts.join('\n')
    
    // In a real app, this would show a proper modal
    alert(message)
    announceToScreenReader('Keyboard shortcuts displayed')
  }, [])

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback((event) => {
    // Handle global shortcuts first
    handleGlobalShortcuts(event)
    
    // Then handle navigation
    if (!event.defaultPrevented) {
      handleArrowNavigation(event)
      handleEscapeKey(event)
    }
  }, [handleGlobalShortcuts, handleArrowNavigation, handleEscapeKey])

  /**
   * Setup keyboard event listeners
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    
    // Update focusable elements when DOM changes
    const observer = new MutationObserver(updateFocusableElements)
    if (containerRef?.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'tabindex', 'aria-hidden']
      })
    }

    // Initial update
    updateFocusableElements()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      observer.disconnect()
    }
  }, [handleKeyDown, updateFocusableElements, containerRef])

  /**
   * Focus management utilities
   */
  const focusUtils = {
    /**
     * Focus first focusable element
     */
    focusFirst: () => {
      if (focusableElements.current.length > 0) {
        focusableElements.current[0].focus()
        currentFocusIndex.current = 0
      }
    },

    /**
     * Focus last focusable element
     */
    focusLast: () => {
      const lastIndex = focusableElements.current.length - 1
      if (lastIndex >= 0) {
        focusableElements.current[lastIndex].focus()
        currentFocusIndex.current = lastIndex
      }
    },

    /**
     * Focus element by index
     */
    focusIndex: (index) => {
      if (index >= 0 && index < focusableElements.current.length) {
        focusableElements.current[index].focus()
        currentFocusIndex.current = index
      }
    },

    /**
     * Get current focus index
     */
    getCurrentIndex: () => {
      return focusableElements.current.indexOf(document.activeElement)
    },

    /**
     * Get focusable elements count
     */
    getCount: () => focusableElements.current.length
  }

  return {
    focusUtils,
    shortcuts: globalShortcuts,
    updateFocusableElements,
    focusSearch,
    focusNavigation,
    focusMainContent,
    showKeyboardShortcuts
  }
}

/**
 * Hook for managing focus trapping (useful for modals)
 */
export function useFocusTrap(isActive = false, containerRef = null) {
  const focusableElements = useRef([])
  const previouslyFocusedElement = useRef(null)

  const updateFocusableElements = useCallback(() => {
    if (!containerRef?.current) return

    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    focusableElements.current = Array.from(
      containerRef.current.querySelectorAll(selectors)
    ).filter(element => {
      const style = window.getComputedStyle(element)
      return style.display !== 'none' && 
             style.visibility !== 'hidden' &&
             element.offsetWidth > 0
    })
  }, [containerRef])

  const handleKeyDown = useCallback((event) => {
    if (!isActive || event.key !== 'Tab') return

    const firstElement = focusableElements.current[0]
    const lastElement = focusableElements.current[focusableElements.current.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      previouslyFocusedElement.current = document.activeElement
      updateFocusableElements()
      
      // Focus first element
      if (focusableElements.current.length > 0) {
        focusableElements.current[0].focus()
      }
    } else if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, handleKeyDown, updateFocusableElements])

  return { updateFocusableElements }
}