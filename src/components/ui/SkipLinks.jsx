/**
 * @fileoverview Skip Links Component for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.0
 * 
 * Provides keyboard navigation skip links for accessibility compliance.
 * Essential for screen reader users and keyboard-only navigation.
 */

import React from 'react'
import { motion } from 'framer-motion'

/**
 * Skip Links Component
 * Provides quick navigation options for keyboard and screen reader users
 */
const SkipLinks = () => {
  const skipLinks = [
    { id: 'main-content', text: 'Skip to main content' },
    { id: 'navigation', text: 'Skip to navigation' },
    { id: 'search', text: 'Skip to search' },
    { id: 'footer', text: 'Skip to footer' }
  ]

  const handleSkipClick = (targetId) => {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.focus()
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }

  return (
    <div className="skip-links sr-only-focusable">
      {skipLinks.map((link, index) => (
        <motion.a
          key={link.id}
          href={`#${link.id}`}
          onClick={(e) => {
            e.preventDefault()
            handleSkipClick(link.id)
          }}
          onFocus={(e) => {
            // Make visible when focused
            e.target.classList.remove('sr-only')
          }}
          onBlur={(e) => {
            // Hide when focus leaves
            e.target.classList.add('sr-only')
          }}
          className="sr-only absolute top-4 left-4 z-[9999] px-4 py-2 bg-slate-900 text-white rounded-lg border border-cyan-500 focus:not-sr-only focus:relative focus:z-[9999] hover:bg-slate-800 transition-colors"
          whileFocus={{ scale: 1.05 }}
          tabIndex={0}
        >
          {link.text}
        </motion.a>
      ))}
      
      <style jsx>{`
        .sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }
        
        .sr-only-focusable:focus,
        .sr-only-focusable:active,
        .sr-only-focusable:focus-within {
          position: static !important;
          width: auto !important;
          height: auto !important;
          padding: initial !important;
          margin: initial !important;
          overflow: visible !important;
          clip: auto !important;
          white-space: normal !important;
        }
        
        .focus\\:not-sr-only:focus {
          position: static !important;
          width: auto !important;
          height: auto !important;
          padding: 0.5rem 1rem !important;
          margin: 0 !important;
          overflow: visible !important;
          clip: auto !important;
          white-space: normal !important;
        }
      `}</style>
    </div>
  )
}

export default SkipLinks