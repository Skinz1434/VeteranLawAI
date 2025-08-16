import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { Button, LoadingSpinner, PageShell, SectionHeader, IconTile, Tooltip } from './shared/ui';
import LoginModal from './components/modals/LoginModal.jsx';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import { Camera, BookOpen, Mic, FileText, Search, BarChart3 } from 'lucide-react';

const DocumentScanner = lazy(() => import('./components/tools/DocumentScannerProV2'));
const LegalKnowledgeBase = lazy(() => import('./components/tools/LegalKnowledgeBase'));
const AudioTranscription = lazy(() => import('./components/tools/AudioTranscription/AudioTranscription'));
const CaseResearch = lazy(() => import('./components/tools/CaseResearch/CaseResearch'));
const ClaimGuidance = lazy(() => import('./components/tools/ClaimGuidance/ClaimGuidance'));
const Analytics = lazy(() => import('./components/tools/Analytics/Analytics'));
const CameraOCR = lazy(() => import('./components/tools/OcrTool'));


function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            <AppContent />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { currentUser, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <Routes>
        <Route path="/" element={!currentUser ? <LandingPage onLogin={() => setShowLoginModal(true)} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/document-scanner" element={<ProtectedRoute><Layout><Suspense fallback={<ToolLoading />}><DocumentScanner /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/legal-knowledge" element={<ProtectedRoute><Layout><Suspense fallback={<ToolLoading />}><LegalKnowledgeBase /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/audio-transcription" element={<ProtectedRoute><Layout><Suspense fallback={<ToolLoading />}><AudioTranscription /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/case-research" element={<ProtectedRoute><Layout><Suspense fallback={<ToolLoading />}><CaseResearch /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/claim-guidance" element={<ProtectedRoute><Layout><Suspense fallback={<ToolLoading />}><ClaimGuidance /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Layout><Suspense fallback={<ToolLoading />}><Analytics /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/camera-ocr" element={<ProtectedRoute><Layout><Suspense fallback={<ToolLoading />}><CameraOCR /></Suspense></Layout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/"} />} />
      </Routes>
    </>
  );
}

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/" replace />;
  return children;
}

function LandingPage({ onLogin }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
          <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-200 via-cyan-300 to-purple-400 bg-clip-text text-transparent" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            VeteranLawAI
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            The enterprise-grade legal SaaS solution for attorneys representing Veterans.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Button onClick={onLogin} size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500">
              Continue with Google
            </Button>
          </motion.div>
        </div>
      );
}

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const tools = [
    { title: 'Document Scanner', href: '/document-scanner', icon: Camera, description: 'Digitize VA forms and records with 99.7% accuracy.' },
    { title: 'Legal Knowledge Base', href: '/legal-knowledge', icon: BookOpen, description: 'Access 14,500+ VA regulations and precedents.' },
    { title: 'Audio Transcription', href: '/audio-transcription', icon: Mic, description: 'Professional legal transcription services.' },
    { title: 'Case Research', href: '/case-research', icon: Search, description: 'Find relevant case precedents and legal rulings.' },
    { title: 'Claim Guidance', href: '/claim-guidance', icon: FileText, description: 'Step-by-step assistance for disability claims.' },
    { title: 'Analytics Dashboard', href: '/analytics', icon: BarChart3, description: 'Track performance and success metrics.' },
    
  ];

  return (
      <PageShell
        header={
          <SectionHeader
            title="Command Center"
            subtitle={`Welcome, ${currentUser?.displayName || currentUser?.email || 'Attorney'}`}
            actions={<Button onClick={logout} variant="outline">Sign Out</Button>}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Tooltip key={tool.title} content={`Click to open ${tool.title}`} side="top">
              <Link to={tool.href} className="focus-ring rounded-lg block">
                <motion.div className="bg-slate-800/50 p-6 rounded-lg h-full hover:bg-slate-800" whileHover={{ scale: 1.03 }}>
                  <IconTile icon={tool.icon} size="md" className="mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-slate-300">{tool.description}</p>
                </motion.div>
              </Link>
            </Tooltip>
          ))}
        </div>
      </PageShell>
  );
}

const LoadingScreen = () => <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="xlarge" label="Loading Environment..." /></div>;
const ToolLoading = () => <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="large" label="Loading Tool..." /></div>;

export default App;
