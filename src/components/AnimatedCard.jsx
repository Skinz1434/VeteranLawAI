import React, { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

const AnimatedCard = ({
  children,
  className = '',
  hover3D = false,
  glowEffect = false,
  clickable = false,
  onClick,
  delay = 0,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // 3D hover effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])

  const handleMouseMove = (event) => {
    if (!hover3D) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (hover3D) {
      x.set(0)
      y.set(0)
    }
  }

  const handleClick = (e) => {
    if (!clickable) return
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
    if (onClick) onClick(e)
  }

  return (
    <motion.div
      className={`
        relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 
        backdrop-blur-sm rounded-3xl border border-slate-700/50
        transition-all duration-300 overflow-hidden
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={hover3D ? {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      } : {}}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={!hover3D ? {
        y: -8,
        transition: { duration: 0.3 }
      } : {}}
      whileTap={clickable ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {/* Glow Effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        initial={{ 
          background: 'linear-gradient(45deg, transparent, transparent)',
          opacity: 0 
        }}
        animate={{ 
          background: isHovered 
            ? 'linear-gradient(45deg, rgba(6, 182, 212, 0.3), rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3))'
            : 'linear-gradient(45deg, transparent, transparent)',
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.5 }}
        style={{
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude'
        }}
      />

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={isPressed ? {
          background: [
            'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
            'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)'
          ],
          x: ['-100%', '100%'],
          opacity: [0, 1, 0]
        } : {}}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Floating Particles Effect */}
      {isHovered && glowEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0
              }}
              animate={{
                y: [null, '-20px'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = 'up',
  className = '' 
}) => {
  return (
    <AnimatedCard className={`p-6 ${className}`} glowEffect>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <motion.p 
            className="text-2xl font-bold text-white mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
          {change && (
            <motion.div 
              className={`flex items-center mt-2 text-sm ${
                trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span>{change}</span>
            </motion.div>
          )}
        </div>
        {Icon && (
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>
        )}
      </div>
    </AnimatedCard>
  )
}

export const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  features = [],
  buttonText = 'Learn More',
  onButtonClick,
  className = '' 
}) => {
  return (
    <AnimatedCard className={`p-8 ${className}`} hover3D glowEffect clickable onClick={onButtonClick}>
      <div className="text-center">
        {Icon && (
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
        )}
        
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-slate-300 mb-6 leading-relaxed">{description}</p>
        
        {features.length > 0 && (
          <ul className="space-y-2 mb-6">
            {features.map((feature, index) => (
              <motion.li 
                key={index}
                className="text-slate-400 text-sm flex items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2" />
                {feature}
              </motion.li>
            ))}
          </ul>
        )}
        
        <motion.button
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {buttonText}
        </motion.button>
      </div>
    </AnimatedCard>
  )
}

export default AnimatedCard

