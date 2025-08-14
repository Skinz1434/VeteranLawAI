import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Scale, Camera, BookOpen, FileText, Mic, Search, BarChart3, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// CORRECTED IMPORT PATH
import { SimpleAuthProvider as AuthProvider, useAuth } from './contexts/SimpleAuthContext';

import { Button, Tooltip, LoadingSpinner, PageShell, SectionHeader, IconTile } from './shared/ui';
import WelcomeModal from './components/modals/WelcomeModal';
import LoginModal from './components/modals/QuickLoginModal';
import Layout from './components/layout/Layout';

const DocumentScanner = lazy(() => import('./components/tools/DocumentScannerProV2'));
const LegalKnowledgeBase = lazy(() => import('./components/tools/LegalKnowledgeBase/LegalKnowledgeBase'));
const ClaimGuidance = lazy(() => import('./components/tools/ClaimGuidance'));
const AudioTranscription = lazy(() => import('./components/tools/AudioTranscription/AudioTranscription'));
const CaseResearch = lazy(() => import('./components/tools/CaseResearch'));
const Analytics = lazy(() => import('./components/tools/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const Help = lazy(() => import('./pages/Help'));

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

// ... (rest of the App.jsx file remains the same)
