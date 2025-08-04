import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import Layout
import Layout from './components/Layout'

// Import pages
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import HealthCheck from './pages/HealthCheck'

// Import components for tool pages
import CameraOCR from './components/CameraOCR'
import LegalKnowledgeBase from './components/LegalKnowledgeBase'
import ClaimGuidance from './components/ClaimGuidance'
import AudioTranscription from './components/AudioTranscription'
import CaseResearch from './components/CaseResearch'
import ClaimAnalytics from './components/ClaimAnalytics'

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page without layout (has its own header) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dashboard for authenticated users */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Health check endpoint */}
        <Route path="/health" element={<HealthCheck />} />
        <Route path="/status" element={<HealthCheck />} />
        
        {/* Tool pages with shared layout */}
        <Route path="/camera-ocr" element={
          <Layout>
            <CameraOCR />
          </Layout>
        } />
        <Route path="/legal-knowledge" element={
          <Layout>
            <LegalKnowledgeBase />
          </Layout>
        } />
        <Route path="/claim-guidance" element={
          <Layout>
            <ClaimGuidance />
          </Layout>
        } />
        <Route path="/audio-transcription" element={
          <Layout>
            <AudioTranscription />
          </Layout>
        } />
        <Route path="/case-research" element={
          <Layout>
            <CaseResearch />
          </Layout>
        } />
        <Route path="/analytics" element={
          <Layout>
            <ClaimAnalytics />
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App