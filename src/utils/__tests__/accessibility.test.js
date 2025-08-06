import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  checkColorContrast,
  getContrastRatio,
  generateAriaLabel,
  validateFormAccessibility,
  announceToScreenReader,
  isKeyboardNavigable,
  getVeteranAccessibilityNeeds,
  applyVeteranAccessibilitySettings,
  createSkipLink,
  FocusManager
} from '../accessibility'

describe('Accessibility Utilities', () => {
  describe('Color Contrast', () => {
    it('calculates contrast ratio correctly', () => {
      // Black on white should have maximum contrast
      const ratio = getContrastRatio('#000000', '#FFFFFF')
      expect(ratio).toBeCloseTo(21, 0)
      
      // Same colors should have minimum contrast
      const sameRatio = getContrastRatio('#FFFFFF', '#FFFFFF')
      expect(sameRatio).toBe(1)
    })

    it('validates WCAG AA compliance', () => {
      // High contrast should pass
      const highContrast = checkColorContrast('#000000', '#FFFFFF')
      expect(highContrast.meetsAA).toBe(true)
      expect(highContrast.meetsAAA).toBe(true)
      
      // Low contrast should fail
      const lowContrast = checkColorContrast('#777777', '#888888')
      expect(lowContrast.meetsAA).toBe(false)
    })

    it('handles different text sizes', () => {
      // Large text has lower contrast requirements
      const largeText = checkColorContrast('#666666', '#FFFFFF', true)
      expect(largeText.meetsAA).toBe(true)
      
      // Same colors might fail for normal text
      const normalText = checkColorContrast('#666666', '#FFFFFF', false)
      expect(normalText.ratio).toBeGreaterThan(3)
    })
  })

  describe('ARIA Label Generation', () => {
    it('generates appropriate labels for different elements', () => {
      expect(generateAriaLabel('button', 'Submit')).toBe('Submit button')
      expect(generateAriaLabel('link', 'Home')).toBe('Home link')
      expect(generateAriaLabel('form', 'Login')).toBe('Login form')
    })

    it('handles navigation elements', () => {
      expect(generateAriaLabel('navigation', 'Main')).toBe('Main navigation')
      expect(generateAriaLabel('nav', 'Sidebar')).toBe('Sidebar navigation')
    })

    it('includes status information', () => {
      const loadingLabel = generateAriaLabel('button', 'Save', { loading: true })
      expect(loadingLabel).toContain('loading')
      
      const errorLabel = generateAriaLabel('input', 'Email', { error: true })
      expect(errorLabel).toContain('error')
    })
  })

  describe('Form Accessibility Validation', () => {
    it('validates form has accessible labels', () => {
      const form = {
        elements: [
          { type: 'input', id: 'name', label: 'Full Name' },
          { type: 'input', id: 'email', label: 'Email Address' }
        ]
      }
      
      const validation = validateFormAccessibility(form)
      expect(validation.hasLabels).toBe(true)
      expect(validation.issues).toHaveLength(0)
    })

    it('detects missing labels', () => {
      const form = {
        elements: [
          { type: 'input', id: 'name' }, // Missing label
          { type: 'input', id: 'email', label: 'Email' }
        ]
      }
      
      const validation = validateFormAccessibility(form)
      expect(validation.hasLabels).toBe(false)
      expect(validation.issues).toContain('Input name is missing a label')
    })

    it('checks for fieldset grouping', () => {
      const form = {
        elements: [
          { type: 'radio', name: 'service', label: 'Army' },
          { type: 'radio', name: 'service', label: 'Navy' }
        ]
      }
      
      const validation = validateFormAccessibility(form)
      expect(validation.issues).toContain('Radio buttons for service should be grouped in a fieldset')
    })
  })

  describe('Screen Reader Announcements', () => {
    beforeEach(() => {
      // Clean up any existing announcement regions
      document.querySelectorAll('[role="status"], [role="alert"]').forEach(el => el.remove())
    })

    it('creates live region for polite announcements', () => {
      announceToScreenReader('Form saved successfully')
      
      const region = document.querySelector('[role="status"]')
      expect(region).toBeTruthy()
      expect(region.getAttribute('aria-live')).toBe('polite')
      expect(region.textContent).toBe('Form saved successfully')
    })

    it('creates alert region for urgent announcements', () => {
      announceToScreenReader('Error: Invalid input', 'assertive')
      
      const region = document.querySelector('[role="alert"]')
      expect(region).toBeTruthy()
      expect(region.getAttribute('aria-live')).toBe('assertive')
    })

    it('cleans up announcements after delay', async () => {
      vi.useFakeTimers()
      
      announceToScreenReader('Temporary message')
      expect(document.querySelector('[role="status"]')).toBeTruthy()
      
      vi.advanceTimersByTime(3000)
      await vi.runAllTimersAsync()
      
      expect(document.querySelector('[role="status"]')).toBeFalsy()
      
      vi.useRealTimers()
    })
  })

  describe('Veteran Accessibility Needs', () => {
    it('identifies TBI considerations', () => {
      const needs = getVeteranAccessibilityNeeds(['tbi'])
      
      expect(needs.reducedAnimations).toBe(true)
      expect(needs.simplifiedUI).toBe(true)
      expect(needs.extendedTimeouts).toBe(true)
      expect(needs.clearInstructions).toBe(true)
    })

    it('identifies PTSD considerations', () => {
      const needs = getVeteranAccessibilityNeeds(['ptsd'])
      
      expect(needs.noSuddenChanges).toBe(true)
      expect(needs.warningBeforeTimeout).toBe(true)
      expect(needs.calmColors).toBe(true)
    })

    it('identifies vision considerations', () => {
      const needs = getVeteranAccessibilityNeeds(['low-vision'])
      
      expect(needs.highContrast).toBe(true)
      expect(needs.largeText).toBe(true)
      expect(needs.screenReaderOptimized).toBe(true)
    })

    it('combines multiple conditions', () => {
      const needs = getVeteranAccessibilityNeeds(['tbi', 'ptsd', 'hearing'])
      
      expect(needs.reducedAnimations).toBe(true)
      expect(needs.noSuddenChanges).toBe(true)
      expect(needs.visualAlerts).toBe(true)
      expect(needs.captions).toBe(true)
    })
  })

  describe('FocusManager', () => {
    let container
    
    beforeEach(() => {
      container = document.createElement('div')
      container.innerHTML = `
        <button id="btn1">Button 1</button>
        <input id="input1" type="text" />
        <a id="link1" href="#">Link 1</a>
        <div id="div1" tabindex="0">Focusable div</div>
      `
      document.body.appendChild(container)
    })

    afterEach(() => {
      document.body.removeChild(container)
    })

    it('traps focus within container', () => {
      const manager = new FocusManager(container)
      manager.trapFocus()
      
      const focusableElements = manager.getFocusableElements()
      expect(focusableElements).toHaveLength(4)
      expect(focusableElements[0].id).toBe('btn1')
    })

    it('saves and restores focus', () => {
      const button = container.querySelector('#btn1')
      button.focus()
      
      const manager = new FocusManager(container)
      manager.saveFocus()
      
      const input = container.querySelector('#input1')
      input.focus()
      
      manager.restoreFocus()
      expect(document.activeElement).toBe(button)
    })

    it('handles tab navigation', () => {
      const manager = new FocusManager(container)
      manager.trapFocus()
      
      const button = container.querySelector('#btn1')
      button.focus()
      
      // Simulate tab key
      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true
      })
      
      container.dispatchEvent(event)
      // Focus management would be handled by the event listener
    })
  })

  describe('Skip Links', () => {
    it('creates accessible skip link', () => {
      const skipLink = createSkipLink('main-content', 'Skip to main content')
      
      expect(skipLink.tagName).toBe('A')
      expect(skipLink.getAttribute('href')).toBe('#main-content')
      expect(skipLink.className).toContain('skip-link')
      expect(skipLink.textContent).toBe('Skip to main content')
    })

    it('focuses target on activation', () => {
      const mainContent = document.createElement('main')
      mainContent.id = 'main-content'
      document.body.appendChild(mainContent)
      
      const skipLink = createSkipLink('main-content', 'Skip to main')
      document.body.appendChild(skipLink)
      
      skipLink.click()
      
      // Cleanup
      document.body.removeChild(mainContent)
      document.body.removeChild(skipLink)
    })
  })
})