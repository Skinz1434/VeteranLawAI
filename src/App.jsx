import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { SimpleAuthProvider as AuthProvider, useAuth } from './contexts/SimpleAuthContext.jsx';
import { Button, LoadingSpinner, PageShell, SectionHeader, IconTile } from './shared/ui';
import WelcomeModal from './components/modals/WelcomeModal';
import LoginModal from './components/modals/QuickLoginModal';
import Layout from './components/layout/Layout';
import { Camera, BookOpen } from 'lucide-react';

const DocumentScanner = lazy(() => import('./components/tools/DocumentScannerProV2'));
const LegalKnowledgeBase = lazy(() => import('./components/tools/LegalKnowledgeBase/LegalKnowledgeBase'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <Routes>
        <Route path="/" element={!user ? <LandingPage onLogin={() => setShowLoginModal(true)} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/document-scanner" element={<ProtectedRoute><Layout><Suspense fallback={<ToolLoading />}><DocumentScanner /></Suspense></Layout></ProtectedRoute>} />
        <Route path="/legal-knowledge" element={<ProtectedRoute><Layout><Suspense fallback={<ToolLoading />}><LegalKnowledgeBase /></Suspense></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
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
              Access Demo Environment
            </Button>
          </motion.div>
        </div>
      );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const tools = [
    { title: 'Document Scanner', href: '/document-scanner', icon: Camera, description: 'Digitize VA forms and records.' },
    { title: 'Legal Knowledge', href: '/legal-knowledge', icon: BookOpen, description: 'Access 14,500+ VA regulations.' }
  ];

  return (
      <PageShell
        header={
          <SectionHeader
            title="Command Center"
            subtitle={`Welcome to the Demo, ${user.name || 'Attorney'}`}
            actions={<Button onClick={logout} variant="outline">Sign Out</Button>}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link to={tool.href} key={tool.title} className="focus-ring rounded-lg">
              <motion.div className="bg-slate-800/50 p-6 rounded-lg h-full hover:bg-slate-800" whileHover={{ scale: 1.03 }}>
                <IconTile icon={tool.icon} size="md" className="mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                <p className="text-slate-300">{tool.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </PageShell>
  );
}

const LoadingScreen = () => <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="xlarge" label="Loading Environment..." /></div>;
const ToolLoading = () => <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="large" label="Loading Tool..." /></div>;

export default App;
