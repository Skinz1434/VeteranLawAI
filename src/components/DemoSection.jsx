import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Mic, FileText, Search, Camera, Play, Pause, Square, Download, Copy, ExternalLink, BookOpen, Scale, Gavel } from 'lucide-react'
// import CameraOCR from './CameraOCR.jsx'
// import LegalKnowledgeBase from './LegalKnowledgeBase.jsx'

const DemoSection = () => {
  const [activeTab, setActiveTab] = useState('camera')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcriptText, setTranscriptText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const recordingInterval = useRef(null)

  // Recording simulation
  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
        
        // Simulate real-time transcription
        const transcriptParts = [
          "Good morning, Mr. Johnson. Thank you for coming in today.",
          " I understand you're filing a claim for PTSD related to your service in Afghanistan.",
          " Can you tell me about the specific incidents that led to your condition?",
          " I was deployed to Kandahar in 2010 as part of Operation Enduring Freedom.",
          " Our convoy was hit by an IED on March 15th, 2011.",
          " I lost two of my closest friends in that attack.",
          " Since then, I've been experiencing nightmares, flashbacks, and severe anxiety.",
          " I have trouble sleeping and concentrating.",
          " The VA medical records show I've been receiving treatment since 2012.",
          " Dr. Smith diagnosed me with PTSD and recommended a 70% disability rating."
        ]
        
        const currentIndex = Math.floor(recordingTime / 3)
        if (currentIndex < transcriptParts.length) {
          setTranscriptText(transcriptParts.slice(0, currentIndex + 1).join(''))
        }
      }, 1000)
    } else {
      clearInterval(recordingInterval.current)
    }

    return () => clearInterval(recordingInterval.current)
  }, [isRecording, recordingTime])

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    setTranscriptText('')
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockResults = [
      {
        title: "Caluza v. Brown",
        citation: "7 Vet.App. 498 (1995)",
        relevance: 95,
        summary: "Establishes that PTSD can be service-connected based on personal assault during military service.",
        keyPoints: ["Personal assault", "PTSD diagnosis", "Service connection"],
        url: "https://www.va.gov/vetapp95/files1/9508048.txt"
      },
      {
        title: "Patton v. West", 
        citation: "12 Vet.App. 272 (1999)",
        relevance: 88,
        summary: "Clarifies the standard for establishing service connection for PTSD without combat exposure.",
        keyPoints: ["Non-combat PTSD", "Stressor verification", "Medical evidence"],
        url: "https://www.va.gov/vetapp99/files1/9908272.txt"
      },
      {
        title: "Cohen v. Brown",
        citation: "10 Vet.App. 128 (1997)", 
        relevance: 82,
        summary: "Addresses the requirements for PTSD stressor verification in combat veterans.",
        keyPoints: ["Combat stressor", "Verification requirements", "Credible evidence"],
        url: "https://www.va.gov/vetapp97/files1/9708128.txt"
      }
    ]
    
    setSearchResults(mockResults)
    setIsSearching(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const tabs = [
    { id: 'camera', label: 'Camera OCR', icon: Camera, color: 'from-cyan-500 to-blue-600' },
    { id: 'ocr', label: 'OCR Demo', icon: Upload, color: 'from-cyan-500 to-blue-600' },
    { id: 'transcription', label: 'Transcription', icon: Mic, color: 'from-teal-500 to-cyan-600' },
    { id: 'analysis', label: 'Claim Analysis', icon: FileText, color: 'from-blue-500 to-indigo-600' },
    { id: 'search', label: 'Case Search', icon: Search, color: 'from-indigo-500 to-purple-600' },
    { id: 'knowledge', label: 'Legal KB', icon: BookOpen, color: 'from-purple-500 to-pink-600' }
  ]

  return (
    <section id="demo" className="py-16 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-heading text-gradient-expert mb-4">
            Interactive AI Demos
          </h2>
          <p className="text-xl text-slate-300 font-legal max-w-3xl mx-auto">
            Experience the power of our AI tools with live, interactive demonstrations.
          </p>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-lg font-expert transition-all duration-300 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'gradient-trust text-white shadow-lg'
                  : 'glass-expert border border-cyan-500/20 text-slate-300 hover:border-cyan-500/40'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Demo Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-expert p-8 rounded-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Camera className="h-8 w-8 text-cyan-400" />
                <h3 className="text-2xl font-expert text-gradient">Camera OCR Processing</h3>
              </div>
              
              <p className="text-slate-300 font-legal mb-8">
                Camera OCR functionality coming soon...
              </p>
              
              {/* <CameraOCR /> */}
            </motion.div>
          )}

          {activeTab === 'ocr' && (
            <motion.div
              key="ocr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-expert p-8 rounded-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Upload className="h-8 w-8 text-cyan-400" />
                <h3 className="text-2xl font-expert text-gradient">OCR Document Processing</h3>
              </div>
              
              <p className="text-slate-300 font-legal mb-8">
                Upload VA forms, medical records, or legal documents for instant text extraction
              </p>

              <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-12 text-center hover:border-cyan-500/50 transition-colors">
                <Upload className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h4 className="text-xl font-expert text-white mb-2">Drag and drop your document here, or click to browse</h4>
                <p className="text-slate-400 mb-4">Supports PDF, JPG, PNG files up to 10MB</p>
                <button className="gradient-trust px-6 py-3 rounded-lg font-expert hover-expert">
                  Select File
                </button>
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-heading text-gradient mb-2">99.9%</div>
                  <div className="text-slate-400 font-expert">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-heading text-gradient mb-2">&lt;2s</div>
                  <div className="text-slate-400 font-expert">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-heading text-gradient mb-2">50+</div>
                  <div className="text-slate-400 font-expert">Document Types</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transcription' && (
            <motion.div
              key="transcription"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-expert p-8 rounded-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Mic className="h-8 w-8 text-cyan-400" />
                <h3 className="text-2xl font-expert text-gradient">Legal Audio Transcription</h3>
              </div>
              
              <p className="text-slate-300 font-legal mb-8">
                Real-time transcription with legal terminology recognition and speaker identification
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-expert text-white">Recording Controls</h4>
                    <div className="text-sm text-slate-400">
                      {formatTime(recordingTime)}
                    </div>
                  </div>
                  
                  <div className="glass-legal p-6 rounded-xl text-center">
                    <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                      isRecording ? 'bg-red-500/20 border-2 border-red-500' : 'bg-cyan-500/20 border-2 border-cyan-500'
                    }`}>
                      <Mic className={`h-12 w-12 ${isRecording ? 'text-red-400' : 'text-cyan-400'}`} />
                    </div>
                    
                    {isRecording && (
                      <motion.div
                        className="text-red-400 font-expert mb-4"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        Recording in progress...
                      </motion.div>
                    )}
                    
                    <div className="flex justify-center space-x-4">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="gradient-trust px-6 py-3 rounded-lg font-expert hover-expert flex items-center space-x-2"
                        >
                          <Play className="h-5 w-5" />
                          <span>Start Recording</span>
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-expert transition-colors flex items-center space-x-2"
                        >
                          <Square className="h-5 w-5" />
                          <span>Stop Recording</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-expert text-white">Live Transcript</h4>
                    <div className="text-sm text-cyan-400 font-expert">
                      98.7% Confidence
                    </div>
                  </div>
                  
                  <div className="legal-document p-6 rounded-xl min-h-[300px] max-h-[300px] overflow-y-auto">
                    {transcriptText ? (
                      <p className="text-slate-300 font-legal leading-relaxed">
                        {transcriptText}
                        {isRecording && (
                          <motion.span
                            className="inline-block w-2 h-5 bg-cyan-400 ml-1"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                        )}
                      </p>
                    ) : (
                      <p className="text-slate-400 text-center">Transcript will appear here as you speak...</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-expert p-8 rounded-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="h-8 w-8 text-cyan-400" />
                <h3 className="text-2xl font-expert text-gradient">Claim Categorization & Analysis</h3>
              </div>
              
              <p className="text-slate-300 font-legal mb-8">
                AI-powered analysis of VA claims with priority scoring
              </p>

              <div className="space-y-6">
                {[
                  { condition: 'PTSD', priority: 'High', confidence: 92, color: 'red' },
                  { condition: 'Tinnitus', priority: 'Medium', confidence: 88, color: 'yellow' },
                  { condition: 'Back Injury', priority: 'Medium', confidence: 85, color: 'blue' },
                  { condition: 'Sleep Disorder', priority: 'Low', confidence: 78, color: 'green' }
                ].map((claim, index) => (
                  <motion.div
                    key={index}
                    className="legal-document p-6 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-${claim.color}-500`}></div>
                        <h4 className="text-lg font-expert text-white">{claim.condition}</h4>
                        <span className="text-sm text-slate-400">Priority: {claim.priority}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-heading text-gradient">{claim.confidence}%</div>
                        <div className="text-sm text-slate-400">Confidence</div>
                      </div>
                    </div>
                    <Progress value={claim.confidence} className="mb-2" />
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 glass-legal p-6 rounded-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Scale className="h-5 w-5 text-cyan-400" />
                  <h4 className="font-expert text-gradient">AI Recommendation</h4>
                </div>
                <p className="text-slate-300 font-legal">
                  Focus on PTSD claim first - high confidence and priority. Gather additional medical evidence 
                  for tinnitus and back injury claims to strengthen case.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-expert p-8 rounded-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Search className="h-8 w-8 text-cyan-400" />
                <h3 className="text-2xl font-expert text-gradient">Case Precedent Search</h3>
              </div>
              
              <p className="text-slate-300 font-legal mb-8">
                Find relevant VA case law and precedents instantly
              </p>

              <div className="flex gap-4 mb-8">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for PTSD service connection cases..."
                  className="flex-1 bg-slate-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="gradient-trust px-6 py-3 rounded-lg font-expert hover-expert flex items-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>{isSearching ? 'Searching...' : 'Search'}</span>
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-6">
                  <div className="text-sm text-slate-400 mb-4">
                    Found {searchResults.length} relevant cases
                  </div>
                  
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={index}
                      className="legal-document p-6 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-expert text-gradient mb-1">{result.title}</h4>
                          <p className="text-sm text-slate-400">{result.citation}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-heading text-cyan-400">{result.relevance}%</div>
                          <div className="text-xs text-slate-400">match</div>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 font-legal mb-4">{result.summary}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {result.keyPoints.map((point, pointIndex) => (
                          <span
                            key={pointIndex}
                            className="badge-legal px-3 py-1 rounded-full text-xs font-expert"
                          >
                            {point}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 text-sm">
                          <ExternalLink className="h-4 w-4" />
                          <span>View Full Case</span>
                        </button>
                        <button className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 text-sm">
                          <Copy className="h-4 w-4" />
                          <span>Copy Citation</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'knowledge' && (
            <motion.div
              key="knowledge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-expert p-8 rounded-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="h-8 w-8 text-cyan-400" />
                <h3 className="text-2xl font-expert text-gradient">Legal Knowledge Base</h3>
              </div>
              
              <p className="text-slate-300 font-legal mb-8">
                Comprehensive VA legal knowledge base coming soon...
              </p>
              
              {/* <LegalKnowledgeBase /> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default DemoSection

