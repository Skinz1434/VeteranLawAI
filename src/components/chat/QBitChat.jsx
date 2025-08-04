/**
 * @fileoverview QBit AI Chatbot - Floating AI assistant with premium design
 * @author VeteranLawAI Platform  
 * @version 3.0.0
 */

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Zap,
  Sparkles,
  Brain,
  Shield,
  Clock,
  CheckCircle,
  Copy,
  Download,
  RefreshCw,
  Volume2,
  VolumeX
} from 'lucide-react'
import Button from '../ui/Button'

/**
 * QBit AI Chatbot Component
 * Premium floating AI assistant with advanced conversational capabilities
 */
const QBitChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: "👋 Hello! I'm QBit, your AI-powered VA legal assistant. I can help you with case research, claim guidance, legal precedents, and much more. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        "Research PTSD claim precedents",
        "Draft a nexus letter",
        "Calculate disability ratings",
        "Find similar cases"
      ]
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)

  // Mock AI responses for demonstration
  const aiResponses = [
    {
      trigger: ['ptsd', 'trauma', 'mental health'],
      response: "🎯 For PTSD claims, I recommend focusing on these key elements:\n\n• **Stressor Evidence**: Document the traumatic event with as much detail as possible\n• **Medical Nexus**: Obtain a professional opinion linking PTSD to military service\n• **Current Symptoms**: Detailed records of ongoing psychological symptoms\n• **Functional Impact**: How PTSD affects daily life and work capacity\n\nWould you like me to search for recent PTSD case precedents or help draft documentation?"
    },
    {
      trigger: ['rating', 'percentage', 'disability'],
      response: "📊 VA disability ratings are based on the severity of symptoms and functional impairment:\n\n**Rating Scale:**\n• 10%: Mild symptoms, minimal impact\n• 30%: Moderate symptoms, some functional loss\n• 50%: Significant impairment in most areas\n• 70%: Severe symptoms, major functional loss\n• 100%: Total occupational and social impairment\n\nI can help calculate combined ratings or analyze your specific conditions. What would be most helpful?"
    },
    {
      trigger: ['case', 'precedent', 'research'],
      response: "⚖️ I'll help you find relevant case precedents! Here's what I can research:\n\n• **Federal Circuit decisions** - Binding nationwide precedents\n• **CAVC rulings** - Veterans-specific case law\n• **Regional office patterns** - Local decision trends\n• **Similar fact patterns** - Cases matching your situation\n\nPlease describe the case facts or legal issue you're researching, and I'll find the most relevant precedents."
    },
    {
      trigger: ['nexus', 'medical', 'opinion'],
      response: "🩺 A strong nexus letter should include:\n\n**Essential Elements:**\n1. Doctor's qualifications and expertise\n2. Review of military and medical records\n3. Current diagnosis with DSM-5/ICD-10 codes\n4. Opinion on causation with medical certainty\n5. Rationale based on medical literature\n\n**Key Phrases:**\n• \"More likely than not\" (>50% probability)\n• \"At least as likely as not\" (≥50% probability)\n• \"Based on medical probability\"\n\nWould you like me to draft a template or review specific medical evidence?"
    }
  ]

  /**
   * Scrolls to bottom of messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  /**
   * Plays notification sound
   */
  const playSound = (type = 'message') => {
    if (!soundEnabled) return
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    if (type === 'message') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    } else {
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }

  /**
   * Generates AI response based on message content
   */
  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Find matching response
    const matchingResponse = aiResponses.find(response =>
      response.trigger.some(trigger => lowerMessage.includes(trigger))
    )
    
    if (matchingResponse) {
      return matchingResponse.response
    }
    
    // Default responses
    const defaultResponses = [
      "🤖 I understand you're asking about VA legal matters. While I can provide general guidance, please remember that each case is unique. Would you like me to search for relevant regulations or case precedents?",
      "⚡ That's an excellent question! I can help research VA policies, case law, and best practices. Could you provide more specific details about your situation?",
      "🎯 I'm here to assist with your VA legal research needs. I can help with case precedents, regulatory analysis, claim strategies, and documentation review. What specific area would you like to explore?",
      "🔍 Let me help you find the information you need. I have access to extensive VA legal databases, case precedents, and regulatory guidance. What would be most helpful for your case?"
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  /**
   * Handles sending messages
   */
  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)
    
    playSound('message')

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(message),
        timestamp: new Date(),
        suggestions: [
          "Tell me more about this",
          "Show relevant cases",
          "Draft documentation",
          "Calculate ratings"
        ]
      }

      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
      playSound('ai')
    }, Math.random() * 2000 + 1000)
  }

  /**
   * Handles suggestion clicks
   */
  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion)
  }

  /**
   * Copies message content
   */
  const copyMessage = (content) => {
    navigator.clipboard.writeText(content)
  }

  /**
   * Chat bubble component
   */
  const ChatBubble = ({ message: msg, isAI }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`flex max-w-[85%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isAI ? 'mr-3' : 'ml-3'}`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${
            isAI 
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
              : 'bg-gradient-to-br from-purple-500 to-pink-600'
          }`}>
            {isAI ? (
              <Bot className="h-4 w-4 text-white" />
            ) : (
              <User className="h-4 w-4 text-white" />
            )}
          </div>
        </div>

        {/* Message bubble */}
        <div className={`relative px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${
          isAI 
            ? 'bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-white/10 text-white' 
            : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
        }`}>
          <div className="whitespace-pre-wrap leading-relaxed">
            {msg.content}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 opacity-70 ${
            isAI ? 'text-slate-400' : 'text-cyan-100'
          }`}>
            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={() => copyMessage(msg.content)}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <Copy className="h-3 w-3" />
            </button>
            {isAI && (
              <button className="opacity-50 hover:opacity-100 transition-opacity">
                <Download className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Suggestions for AI messages */}
          {isAI && msg.suggestions && (
            <div className="flex flex-wrap gap-2 mt-3">
              {msg.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-all duration-200 border border-white/20 hover:border-white/30"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-cyan-500/25 flex items-center justify-center z-50 group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
            
            {/* Icon */}
            <div className="relative">
              <Bot className="h-8 w-8 text-white drop-shadow-lg" />
              
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </div>

            {/* Sparkle effects */}
            <div className="absolute -top-1 -left-1 w-4 h-4">
              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: isMinimized ? 0.3 : 1, 
              y: isMinimized ? 40 : 0,
              x: isMinimized ? 200 : 0
            }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-6 right-6 w-96 bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl z-50 ${
              isMinimized ? 'h-20 overflow-hidden pointer-events-none' : 'h-[600px]'
            }`}
          >
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-40 rounded-3xl" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
            
            {/* Header */}
            <div className="relative flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                {/* QBit Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 shadow-lg animate-pulse" />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">QBit AI</span>
                    <div className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs text-white font-medium">
                      Online
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-yellow-400" />
                    <span>VA Legal Assistant</span>
                  </div>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl flex items-center justify-center transition-colors"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-slate-400" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl flex items-center justify-center transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Minimize2 className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-red-600/20 hover:bg-red-600/30 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} isAI={msg.type === 'ai'} />
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start mb-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-slate-800/80 rounded-2xl px-4 py-3 border border-white/10">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="relative p-4 border-t border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask QBit about VA law, cases, claims..."
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                      />
                    </div>
                    
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isTyping}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}

            {/* Floating glow effects */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default QBitChat