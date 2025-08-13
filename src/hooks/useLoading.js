/**
 * @fileoverview Loading State Management Hook for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.0
 *
 * Centralized loading state management with accessibility features.
 * Provides consistent loading experiences across all platform tools.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { announceToScreenReader } from '../utils/accessibility'

/**
 * Loading state management hook
 * Provides centralized loading state with accessibility features
 */
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const timeoutRef = useRef(null)
  const startTimeRef = useRef(null)

  /**
   * Start loading with optional message and accessibility announcement
   */
  const startLoading = useCallback((message = 'Loading...', announceToUser = true) => {
    setIsLoading(true)
    setLoadingMessage(message)
    setProgress(0)
    setError(null)
    startTimeRef.current = Date.now()

    if (announceToUser) {
      announceToScreenReader(message)
    }
  }, [])

  /**
   * Stop loading and optionally announce completion
   */
  const stopLoading = useCallback((successMessage = null, announceToUser = true) => {
    setIsLoading(false)
    setLoadingMessage('')
    setProgress(100)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (successMessage && announceToUser) {
      announceToScreenReader(successMessage)
    }
  }, [])

  /**
   * Set loading progress (0-100)
   */
  const setLoadingProgress = useCallback((newProgress, message = null) => {
    setProgress(Math.min(100, Math.max(0, newProgress)))

    if (message) {
      setLoadingMessage(message)
    }
  }, [])

  /**
   * Set loading error and stop loading
   */
  const setLoadingError = useCallback((errorMessage, announceToUser = true) => {
    setError(errorMessage)
    setIsLoading(false)
    setProgress(0)

    if (announceToUser) {
      announceToScreenReader(`Error: ${errorMessage}`)
    }
  }, [])

  /**
   * Update loading message without affecting loading state
   */
  const updateMessage = useCallback((message, announceToUser = false) => {
    setLoadingMessage(message)

    if (announceToUser) {
      announceToScreenReader(message)
    }
  }, [])

  /**
   * Set a timeout to automatically stop loading
   */
  const setLoadingTimeout = useCallback(
    (timeoutMs, timeoutMessage = 'Operation timed out') => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setLoadingError(timeoutMessage)
      }, timeoutMs)
    },
    [setLoadingError]
  )

  /**
   * Get loading duration in milliseconds
   */
  const getLoadingDuration = useCallback(() => {
    if (!startTimeRef.current) return 0
    return Date.now() - startTimeRef.current
  }, [])

  /**
   * Reset all loading states
   */
  const resetLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingMessage('')
    setProgress(0)
    setError(null)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isLoading,
    loadingMessage,
    progress,
    error,
    startLoading,
    stopLoading,
    setLoadingProgress,
    setLoadingError,
    updateMessage,
    setLoadingTimeout,
    getLoadingDuration,
    resetLoading,
  }
}

/**
 * Multi-stage loading hook for complex operations
 */
export function useMultiStageLoading(stages = []) {
  const [currentStage, setCurrentStage] = useState(0)
  const [stageProgress, setStageProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const {
    isLoading,
    loadingMessage,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    resetLoading,
  } = useLoading()

  /**
   * Start the multi-stage process
   */
  const startStages = useCallback(
    (initialMessage = 'Starting process...') => {
      setCurrentStage(0)
      setStageProgress(0)
      setIsCompleted(false)
      startLoading(initialMessage)
    },
    [startLoading]
  )

  /**
   * Advance to the next stage
   */
  const nextStage = useCallback(
    (message = null) => {
      if (currentStage < stages.length - 1) {
        const newStage = currentStage + 1
        setCurrentStage(newStage)
        setStageProgress(0)

        const stageMessage = message || stages[newStage]?.name || `Stage ${newStage + 1}`
        announceToScreenReader(stageMessage)
      }
    },
    [currentStage, stages]
  )

  /**
   * Update progress within current stage
   */
  const updateStageProgress = useCallback(progress => {
    setStageProgress(Math.min(100, Math.max(0, progress)))
  }, [])

  /**
   * Complete all stages
   */
  const completeStages = useCallback(
    (successMessage = 'Process completed successfully') => {
      setCurrentStage(stages.length - 1)
      setStageProgress(100)
      setIsCompleted(true)
      stopLoading(successMessage)
    },
    [stages.length, stopLoading]
  )

  /**
   * Get overall progress (0-100)
   */
  const getOverallProgress = useCallback(() => {
    if (stages.length === 0) return 0

    const completedStages = currentStage
    const currentStageProgress = stageProgress / 100
    const totalProgress = (completedStages + currentStageProgress) / stages.length

    return Math.round(totalProgress * 100)
  }, [currentStage, stageProgress, stages.length])

  /**
   * Reset multi-stage loading
   */
  const resetStages = useCallback(() => {
    setCurrentStage(0)
    setStageProgress(0)
    setIsCompleted(false)
    resetLoading()
  }, [resetLoading])

  return {
    isLoading,
    loadingMessage,
    error,
    currentStage,
    stageProgress,
    isCompleted,
    overallProgress: getOverallProgress(),
    startStages,
    nextStage,
    updateStageProgress,
    completeStages,
    setLoadingError,
    resetStages,
  }
}

/**
 * Debounced loading hook to prevent flickering on fast operations
 */
export function useDebouncedLoading(delay = 300) {
  const [isLoading, setIsLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const timeoutRef = useRef(null)
  const hideTimeoutRef = useRef(null)

  const startLoading = useCallback(() => {
    setIsLoading(true)

    // Clear any existing hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }

    // Show loading after delay to prevent flickering
    if (!showLoading) {
      timeoutRef.current = setTimeout(() => {
        setShowLoading(true)
      }, delay)
    } else {
      setShowLoading(true)
    }
  }, [delay, showLoading])

  const stopLoading = useCallback(() => {
    setIsLoading(false)

    // Clear show timeout if still pending
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Hide loading immediately if operation was fast
    // Or after a brief delay to show completion
    if (showLoading) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowLoading(false)
      }, 100)
    }
  }, [showLoading])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  return {
    isLoading,
    showLoading,
    startLoading,
    stopLoading,
  }
}

/**
 * Hook for managing file upload/download progress
 */
export function useFileProgress() {
  const [progress, setProgress] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [transferRate, setTransferRate] = useState(0)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0)

  const startProgress = useCallback((name = '', size = 0) => {
    setIsActive(true)
    setProgress(0)
    setFileName(name)
    setFileSize(size)
    setTransferRate(0)
    setEstimatedTimeRemaining(0)
  }, [])

  const updateProgress = useCallback((newProgress, rate = 0) => {
    setProgress(Math.min(100, Math.max(0, newProgress)))
    setTransferRate(rate)

    if (rate > 0 && newProgress < 100) {
      const remaining = (100 - newProgress) / rate
      setEstimatedTimeRemaining(remaining)
    }
  }, [])

  const completeProgress = useCallback(() => {
    setProgress(100)
    setIsActive(false)
    setTransferRate(0)
    setEstimatedTimeRemaining(0)
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(0)
    setIsActive(false)
    setFileName('')
    setFileSize(0)
    setTransferRate(0)
    setEstimatedTimeRemaining(0)
  }, [])

  const formatFileSize = useCallback(bytes => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  const formatTime = useCallback(seconds => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }, [])

  return {
    progress,
    isActive,
    fileName,
    fileSize: formatFileSize(fileSize),
    transferRate: formatFileSize(transferRate * 1000) + '/s',
    estimatedTimeRemaining: formatTime(estimatedTimeRemaining),
    startProgress,
    updateProgress,
    completeProgress,
    resetProgress,
  }
}
