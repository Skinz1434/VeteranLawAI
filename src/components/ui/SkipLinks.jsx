/**
 * @fileoverview Skip Links Component for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.1
 *
 * Provides keyboard navigation skip links for accessibility compliance.
 * Essential for screen reader users and keyboard-only navigation.
 * CSS has been moved to its own file for Vite compatibility.
 */

import React from 'react';
import { motion } from 'framer-motion';
import './SkipLinks.css'; // Import the CSS file

/**
 * Skip Links Component
 * Provides quick navigation options for keyboard and screen reader users
 */
const SkipLinks = () => {
  const skipLinks = [
    { id: 'main-content', text: 'Skip to main content' },
    { id: 'navigation', text: 'Skip to navigation' },
  ];

  const handleSkipClick = (targetId) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.focus({ preventScroll: true });
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="skip-links-container">
      {skipLinks.map((link) => (
        <motion.a
          key={link.id}
          href={`#${link.id}`}
          onClick={(e) => {
            e.preventDefault();
            handleSkipClick(link.id);
          }}
          className="sr-only sr-only-focusable"
        >
          {link.text}
        </motion.a>
      ))}
    </div>
  );
};

export default SkipLinks;
