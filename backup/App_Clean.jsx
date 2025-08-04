import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import LoginScreen from './components/LoginScreen';
import SubscriptionGate from './components/SubscriptionGate';
import CameraOCR from './components/CameraOCR';
import LegalKnowledgeBase from './components/LegalKnowledgeBase';
import ClaimGuidance from './components/ClaimGuidance';
import AudioTranscription from './components/AudioTranscription';
import CaseResearch from './components/CaseResearch';
import ClaimAnalytics from './components/ClaimAnalytics';
import { 
  Scale, 
  Menu, 
  ChevronDown, 
  User, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  Camera,
  BookOpen,
  FileText,
  Mic,
  Search,
  BarChart3,
  Shield,
  Award,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import './App.css';

const ProtectedRoute = ({ children, feature }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ExpertHeader = () => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-xl border-b border-slate-700/30 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Professional Logo Section */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-4 group">
            <div className="relative">
              <Scale className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-cyan-400 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                VeteranLawAI
              </span>
              <span className="text-xs sm:text-sm text-cyan-400 font-medium hidden sm:block">
                VA Legal Specialists
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button 
              onClick={() => scrollToSection('features')}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 rounded-xl transition-all duration-300 font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 rounded-xl transition-all duration-300 font-medium"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 rounded-xl transition-all duration-300 font-medium"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-cyan-500/10 rounded-xl transition-all duration-300 font-medium"
            >
              Contact
            </button>
          </nav>

          {/* User Profile & Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-2 border border-slate-600/50 hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-base">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-white font-medium text-sm">
                    {user?.name || 'User'}
                  </span>
                  <span className="text-cyan-400 text-xs">
                    {user?.subscription || 'Enterprise'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 sm:w-56 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-700/50">
                    <p className="text-white font-medium text-sm">{user?.name || 'User'}</p>
                    <p className="text-gray-400 text-xs">{user?.email || 'user@example.com'}</p>
                  </div>
                  
                  <button className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200 flex items-center space-x-3">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Account Settings</span>
                  </button>
                  
                  <button className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200 flex items-center space-x-3">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm">Billing</span>
                  </button>
                  
                  <button className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200 flex items-center space-x-3">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Preferences</span>
                  </button>
                  
                  <button className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200 flex items-center space-x-3">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm">Help & Support</span>
                  </button>
                  
                  <div className="border-t border-slate-700/50 mt-2 pt-2">
                    <button 
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200 flex items-center space-x-3"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-300"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-700/50 py-4 space-y-2"
          >
            <button 
              onClick={() => {
                scrollToSection('features');
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 rounded-xl transition-all duration-300 font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => {
                scrollToSection('pricing');
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 rounded-xl transition-all duration-300 font-medium"
            >
              Pricing
            </button>
            <button 
              onClick={() => {
                scrollToSection('testimonials');
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 rounded-xl transition-all duration-300 font-medium"
            >
              Testimonials
            </button>
            <button 
              onClick={() => {
                scrollToSection('contact');
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-cyan-500/10 rounded-xl transition-all duration-300 font-medium"
            >
              Contact
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
};

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const tools = [
    {
      id: 'camera-ocr',
      title: 'Camera OCR Processing',
      description: 'Capture and process VA documents with advanced OCR technology. Automatically extract text and store securely in Google Drive.',
      icon: Camera,
      path: '/camera-ocr',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'legal-knowledge',
      title: 'VA Legal Knowledge Base',
      description: 'Access 14,500+ CFR regulations, M21 procedures, and VASRD codes with AI-powered search and expert commentary.',
      icon: BookOpen,
      path: '/legal-knowledge',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'claim-guidance',
      title: 'Step-by-Step Claim Guidance',
      description: 'AI-powered analysis of VA paperwork with personalized recommendations and evidence gap identification.',
      icon: FileText,
      path: '/claim-guidance',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'audio-transcription',
      title: 'Legal Audio Transcription',
      description: 'Record and transcribe legal consultations with VA-specific terminology recognition and speaker identification.',
      icon: Mic,
      path: '/audio-transcription',
      gradient: 'from-pink-500 to-red-600'
    },
    {
      id: 'case-research',
      title: 'Case Precedent Research',
      description: 'Search 10,000+ VA legal precedents with AI-powered relevance scoring and citation management.',
      icon: Search,
      path: '/case-research',
      gradient: 'from-red-500 to-orange-600'
    },
    {
      id: 'analytics',
      title: 'Claim Success Analytics',
      description: 'Track performance metrics, success rates, and optimize your VA claims strategy with comprehensive analytics.',
      icon: BarChart3,
      path: '/analytics',
      gradient: 'from-orange-500 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <ExpertHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 pb-24 sm:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6 sm:mb-8"
            >
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 mr-2" />
              <span className="text-cyan-300 font-medium text-sm sm:text-base">Built by VA Legal Experts</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                VeteranLawAI
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
            >
              The most advanced AI-powered legal platform designed exclusively for 
              attorneys representing Veterans in VA disability claims. Built by VA legal 
              experts, fine-tuned by specialists.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16"
            >
              <button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="w-full sm:w-auto bg-slate-800/50 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-2xl border border-slate-600 hover:bg-slate-700/50 transition-all duration-300 hover:border-slate-500">
                Try Tools Now
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>256-bit Encryption</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Professional VA Legal Tools
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              Six specialized tools designed by VA legal experts to streamline your practice and increase claim success rates.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${tool.gradient} rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {tool.title}
                </h3>
                
                <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                  {tool.description}
                </p>
                
                <button
                  onClick={() => navigate(tool.path)}
                  className="w-full bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-white font-medium py-3 px-6 rounded-xl hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 border border-slate-600/50 hover:border-cyan-500/50 group-hover:shadow-lg group-hover:shadow-cyan-500/25"
                >
                  Launch Tool
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Professional Pricing
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              Choose the plan that fits your practice. All plans include access to our complete VA legal toolkit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Solo Practitioner */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Solo Practitioner</h3>
              <p className="text-slate-300 mb-6">Perfect for individual attorneys</p>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-6">
                $199<span className="text-lg text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  All 6 professional tools
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Google Drive integration
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Email support
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300">
                Start Free Trial
              </button>
            </div>

            {/* Law Firm */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-cyan-500/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Law Firm</h3>
              <p className="text-slate-300 mb-6">For small to medium law firms</p>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-6">
                $499<span className="text-lg text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Everything in Solo
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Team collaboration
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Priority support
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Advanced analytics
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-slate-300 mb-6">For large firms and organizations</p>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Custom<span className="text-lg text-slate-400"> pricing</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Everything in Law Firm
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  White-label options
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  API access
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Dedicated support
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold py-3 px-6 rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-300 border border-slate-600">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Trusted by VA Legal Experts
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              See what attorneys are saying about VeteranLawAI and how it's transforming their practice.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                "VeteranLawAI has revolutionized our practice. The OCR tool alone saves us 10 hours per week, and the legal database is incredibly comprehensive."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">MJ</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Michael Johnson</p>
                  <p className="text-slate-400 text-sm">Partner, Johnson & Associates</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                "The claim guidance system is phenomenal. It's like having a VA expert reviewing every case. Our success rate has increased by 15%."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">SR</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Sarah Rodriguez</p>
                  <p className="text-slate-400 text-sm">Senior Attorney, Veterans Legal Aid</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                "Finally, a platform built specifically for VA law. The case research tool has access to precedents I couldn't find anywhere else."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">DT</span>
                </div>
                <div>
                  <p className="text-white font-semibold">David Thompson</p>
                  <p className="text-slate-400 text-sm">Solo Practitioner, VA Disability Law</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Get Started Today
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              Ready to revolutionize your VA legal practice? Contact our team or start your free trial.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Phone</p>
                  <p className="text-slate-300">1-800-VETERAN (1-800-838-3726)</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Email</p>
                  <p className="text-slate-300">support@veteranlawai.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Address</p>
                  <p className="text-slate-300">1776 Veterans Way, Suite 100<br />Washington, DC 20001</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Start Your Free Trial</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Law Firm Name"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="h-8 w-8 text-cyan-400" />
                <span className="text-xl font-bold text-white">VeteranLawAI</span>
              </div>
              <p className="text-slate-300 mb-4 max-w-md">
                The most advanced AI-powered legal platform designed exclusively for attorneys representing Veterans in VA disability claims.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors" />
                <Linkedin className="h-6 w-6 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors" />
                <Youtube className="h-6 w-6 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">Security</a></li>
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 VeteranLawAI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">GDPR</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          } />
          <Route path="/camera-ocr" element={
            <ProtectedRoute>
              <CameraOCR />
            </ProtectedRoute>
          } />
          <Route path="/legal-knowledge" element={
            <ProtectedRoute>
              <LegalKnowledgeBase />
            </ProtectedRoute>
          } />
          <Route path="/claim-guidance" element={
            <ProtectedRoute>
              <ClaimGuidance />
            </ProtectedRoute>
          } />
          <Route path="/audio-transcription" element={
            <ProtectedRoute>
              <AudioTranscription />
            </ProtectedRoute>
          } />
          <Route path="/case-research" element={
            <ProtectedRoute>
              <CaseResearch />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <ClaimAnalytics />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

