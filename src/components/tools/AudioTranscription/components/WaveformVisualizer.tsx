/**
 * @fileoverview Waveform Visualizer - Real-time audio visualization component
 * @author QBit-Claude Refactor Agent  
 * @version 1.0.0
 */

import React, { useRef, useEffect, memo, useCallback } from 'react'

interface WaveformVisualizerProps {
  audioLevel: number
  isActive: boolean
  className?: string
  color?: string
  backgroundColor?: string
  barCount?: number
  animationSpeed?: number
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  audioLevel,
  isActive,
  className = '',
  color = '#10b981', // Green-500
  backgroundColor = '#1f2937', // Gray-800
  barCount = 32,
  animationSpeed = 0.1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const barsRef = useRef<number[]>(new Array(barCount).fill(0))
  const timeRef = useRef(0)

  // Optimized animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Update canvas size if needed
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    const width = rect.width
    const height = rect.height
    
    // Clear canvas
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    if (!isActive && audioLevel === 0) {
      // Show static bars when inactive
      drawStaticBars(ctx, width, height)
    } else {
      // Show animated waveform when active
      drawAnimatedWaveform(ctx, width, height)
    }

    timeRef.current += animationSpeed
    
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }, [audioLevel, isActive, backgroundColor, barCount, animationSpeed])

  // Draw static bars for inactive state
  const drawStaticBars = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const barWidth = width / barCount
    const maxBarHeight = height * 0.3
    
    ctx.fillStyle = `${color}40` // Semi-transparent
    
    for (let i = 0; i < barCount; i++) {
      const x = i * barWidth
      const barHeight = maxBarHeight * 0.1 // Very low static bars
      const y = (height - barHeight) / 2
      
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight)
    }
  }, [color, barCount])

  // Draw animated waveform for active state
  const drawAnimatedWaveform = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const barWidth = width / barCount
    const maxBarHeight = height * 0.8
    const time = timeRef.current
    
    // Update bars with audio level and wave animation
    for (let i = 0; i < barCount; i++) {
      // Create wave effect with different frequencies
      const waveOffset = Math.sin((time + i * 0.5) * 0.1) * 0.3
      const audioInfluence = audioLevel * (0.5 + Math.sin((time + i * 0.2) * 0.05) * 0.5)
      
      // Target height based on audio level and wave pattern
      const targetHeight = (audioInfluence + waveOffset + 0.1) * maxBarHeight
      
      // Smooth interpolation to target height
      const currentHeight = barsRef.current[i]
      barsRef.current[i] = currentHeight + (targetHeight - currentHeight) * 0.15
      
      // Ensure minimum height
      barsRef.current[i] = Math.max(barsRef.current[i], maxBarHeight * 0.05)
    }
    
    // Draw the bars
    for (let i = 0; i < barCount; i++) {
      const x = i * barWidth
      const barHeight = barsRef.current[i]
      const y = (height - barHeight) / 2
      
      // Create gradient based on bar height
      const intensity = barHeight / maxBarHeight
      const alpha = Math.min(intensity * 2, 1)
      
      // Color intensity based on audio level
      if (audioLevel > 0.7) {
        ctx.fillStyle = `rgba(239, 68, 68, ${alpha})` // Red for high levels
      } else if (audioLevel > 0.4) {
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha})` // Orange for medium levels  
      } else {
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})` // Green for normal levels
      }
      
      // Draw bar with rounded corners effect
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight)
      
      // Add glow effect for active bars
      if (audioLevel > 0.2 && barHeight > maxBarHeight * 0.3) {
        ctx.shadowColor = ctx.fillStyle
        ctx.shadowBlur = 8
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight)
        ctx.shadowBlur = 0
      }
    }
  }, [color, barCount, audioLevel])

  // Initialize animation when component becomes active
  useEffect(() => {
    if (isActive) {
      animate()
    } else {
      // Draw static state once when inactive
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const rect = canvas.getBoundingClientRect()
          animate() // Draw once
        }
      }
    }

    // Cleanup animation on unmount or when becoming inactive
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isActive, animate])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      // Trigger a redraw on resize
      if (!isActive) {
        animate()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isActive, animate])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '6px',
      }}
      role="img"
      aria-label={
        isActive 
          ? `Audio waveform visualization showing ${Math.round(audioLevel * 100)}% audio level`
          : 'Audio waveform visualization - inactive'
      }
    />
  )
}

// Memoize component to prevent unnecessary re-renders
// Only re-render when audioLevel, isActive, or visual props change
export default memo(WaveformVisualizer, (prevProps, nextProps) => {
  return (
    prevProps.audioLevel === nextProps.audioLevel &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.className === nextProps.className &&
    prevProps.color === nextProps.color &&
    prevProps.backgroundColor === nextProps.backgroundColor &&
    prevProps.barCount === nextProps.barCount &&
    prevProps.animationSpeed === nextProps.animationSpeed
  )
})