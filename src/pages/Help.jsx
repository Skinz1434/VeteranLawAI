import React, { useState } from 'react'
import { HelpCircle, Book, MessageCircle, Phone, Mail, FileText, Video, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Help = () => {
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = [
    {
      id: 1,
      question: 'How do I upload and scan VA documents?',
      answer: 'Navigate to the Document Scanner tool from the sidebar. You can either upload files directly or use your camera to capture documents. Our AI will automatically detect VA form numbers and extract relevant information.'
    },
    {
      id: 2,
      question: 'What types of VA claims does the platform support?',
      answer: 'VeteranLawAI supports all major VA disability claim types including: PTSD, physical injuries, hearing loss, TBI, MST claims, and secondary conditions. Our database covers over 18,500 regulations and precedents.'
    },
    {
      id: 3,
      question: 'How accurate is the legal research tool?',
      answer: 'Our AI-powered legal research tool has a 99.7% accuracy rate for VA form recognition and maintains up-to-date information from the Board of Veterans Appeals, Court of Appeals for Veterans Claims, and Federal Circuit decisions.'
    },
    {
      id: 4,
      question: 'Can I export reports for my clients?',
      answer: 'Yes, all tools include comprehensive export features. You can generate PDF reports, Word documents, and structured data exports for case management systems.'
    },
    {
      id: 5,
      question: 'Is my client data secure?',
      answer: 'Absolutely. We use military-grade encryption, HIPAA-compliant storage, and SOC 2 Type II certified infrastructure. All data is encrypted at rest and in transit.'
    }
  ]

  const resources = [
    { icon: Book, title: 'Documentation', description: 'Comprehensive guides and tutorials', link: '#' },
    { icon: Video, title: 'Video Tutorials', description: 'Step-by-step video walkthroughs', link: '#' },
    { icon: FileText, title: 'Best Practices', description: 'Tips for maximizing success rates', link: '#' },
    { icon: MessageCircle, title: 'Community Forum', description: 'Connect with other VA attorneys', link: '#' }
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Help Center</h1>
              <p className="text-slate-400">Get support and learn how to use VeteranLawAI effectively</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <motion.a
                key={resource.title}
                href={resource.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700 hover:border-cyan-500 transition-all duration-300 group"
              >
                <Icon className="h-8 w-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold mb-1">{resource.title}</h3>
                <p className="text-slate-400 text-sm">{resource.description}</p>
              </motion.a>
            )
          })}
        </div>

        {/* FAQs */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-slate-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-4 py-3 bg-slate-900/50 hover:bg-slate-900/70 transition-colors flex items-center justify-between text-left"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-slate-900/30 text-slate-300">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">Need More Help?</h2>
          <p className="text-slate-300 mb-6">Our support team is available 24/7 to assist you with any questions.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="mailto:support@veteranlawai.com"
              className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors group"
            >
              <Mail className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-white font-medium">Email Support</div>
                <div className="text-slate-400 text-sm">support@veteranlawai.com</div>
              </div>
            </a>
            <a
              href="tel:1-800-VET-HELP"
              className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors group"
            >
              <Phone className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-white font-medium">Phone Support</div>
                <div className="text-slate-400 text-sm">1-800-VET-HELP</div>
              </div>
            </a>
            <button className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors group">
              <MessageCircle className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-white font-medium">Live Chat</div>
                <div className="text-slate-400 text-sm">Available 24/7</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help