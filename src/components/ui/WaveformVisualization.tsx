import React, { useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface WaveformVisualizationProps {
  audioLevel: number
  isRecording: boolean
  barCount?: number
  height?: number
  className?: string
  animated?: boolean
}

// Memoized individual bar component for performance
const WaveformBar = React.memo(({ 
  height, 
  index, 
  isRecording, 
  animated = true 
}: { 
  height: number
  index: number
  isRecording: boolean
  animated: boolean
}) => {
  const baseHeight = 8
  const maxHeight = 80
  const animatedHeight = isRecording ? Math.max(baseHeight, height) : baseHeight
  
  if (!animated) {
    return (
      <div 
        className="w-1 bg-gradient-to-t from-emerald-600 to-green-400 rounded-full transition-all duration-75"
        style={{ height: `${animatedHeight}px` }}
      />
    )
  }

  return (
    <motion.div
      className="w-1 bg-gradient-to-t from-emerald-600 to-green-400 rounded-full"
      animate={{ height: `${animatedHeight}px` }}
      transition={{ 
        duration: 0.1, 
        ease: "easeOut",
        delay: index * 0.01 // Slight stagger for visual effect
      }}
    />
  )
})

WaveformBar.displayName = 'WaveformBar'

const WaveformVisualization: React.FC<WaveformVisualizationProps> = ({
  audioLevel,
  isRecording,
  barCount = 40,
  height = 80,
  className = '',
  animated = true
}) => {
  const rafRef = useRef<number>()
  const [barHeights, setBarHeights] = React.useState<number[]>(() => 
    new Array(barCount).fill(8)
  )

  // Generate realistic waveform heights based on audio level
  const generateWaveformHeights = useMemo(() => {
    return (level: number) => {
      return Array.from({ length: barCount }, (_, i) => {
        if (!isRecording) return 8
        
        // Create a more natural waveform pattern
        const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2)
        const baseVariation = Math.sin((i / barCount) * Math.PI * 4) * 0.3 + 0.7
        const centerEffect = 1 - centerDistance * 0.3
        const randomVariation = Math.random() * 0.4 + 0.8
        
        const combinedEffect = level * baseVariation * centerEffect * randomVariation
        return Math.max(8, Math.min(height, combinedEffect * height))
      })
    }
  }, [barCount, height, isRecording])

  // Throttled update using requestAnimationFrame for smooth performance
  useEffect(() => {
    if (!isRecording) {
      setBarHeights(new Array(barCount).fill(8))
      return
    }

    const updateWaveform = () => {
      setBarHeights(generateWaveformHeights(audioLevel))
      rafRef.current = requestAnimationFrame(updateWaveform)
    }

    rafRef.current = requestAnimationFrame(updateWaveform)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [audioLevel, isRecording, generateWaveformHeights])

  // Render bars using the memoized component
  const bars = useMemo(() => 
    barHeights.map((barHeight, index) => (
      <WaveformBar
        key={index}
        height={barHeight}
        index={index}
        isRecording={isRecording}
        animated={animated}
      />
    )), 
    [barHeights, isRecording, animated]
  )

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {bars}
    </div>
  )
}

// Additional hook for managing audio visualization state
export const useAudioVisualization = (audioContext?: AudioContext, analyser?: AnalyserNode) => {
  const [audioLevel, setAudioLevel] = React.useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!audioContext || !analyser) return

    const updateAudioLevel = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(dataArray)
      
      // Calculate average audio level
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      setAudioLevel(average / 255)
      
      rafRef.current = requestAnimationFrame(updateAudioLevel)
    }

    rafRef.current = requestAnimationFrame(updateAudioLevel)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [audioContext, analyser])

  return audioLevel
}

export default React.memo(WaveformVisualization)