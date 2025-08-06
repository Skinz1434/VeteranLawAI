// Core type definitions for VAadvocate platform

export interface VeteranInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  ssn: string
  phoneNumber: string
  email: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

export interface MilitaryService {
  branch: 'Army' | 'Navy' | 'Air Force' | 'Marines' | 'Coast Guard' | 'Space Force'
  startDate: string
  endDate: string
  rank: string
  serviceNumber: string
  deployments: Deployment[]
}

export interface Deployment {
  location: string
  startDate: string
  endDate: string
  combatExposure: boolean
}

export interface Condition {
  name: string
  description: string
  serviceConnection: boolean
  currentRating: number
  symptoms: string[]
  limitations: string[]
  medicalEvidence: string[]
}

export interface ClaimData {
  veteran: VeteranInfo
  military: MilitaryService
  conditions: Condition[]
  evidence: Evidence[]
  filingType: 'initial' | 'increase' | 'reopened'
  priority: 'standard' | 'expedited' | 'fully_developed'
}

export interface Evidence {
  type: 'medical' | 'buddy_statement' | 'service_record' | 'private_medical'
  description: string
  dateObtained: string
  relevantTo: string[]
  confidence: number
}

// Analytics Types
export interface AnalyticsMetric {
  title: string
  value: string | number
  change: string
  icon: string
  color: string
}

export interface AnalyticsData {
  overview: OverviewMetrics
  performance: PerformanceMetrics
  cases: CaseData[]
  conditions: ConditionPerformance[]
  vaRegions: RegionalData[]
  insights: Insight[]
}

export interface OverviewMetrics {
  totalCases: number
  successRate: number
  avgProcessingTime: number
  totalAwarded: number
  activeClaims: number
  pendingAppeals: number
  trends: {
    cases: number
    success: number
    time: number
    awarded: number
    active: number
    appeals: number
  }
}

export interface PerformanceMetrics {
  casesThisMonth: number
  successThisMonth: number
  avgTimeThisMonth: number
}

export interface CaseData {
  month: string
  filed: number
  won: number
  appeals: number
}

export interface ConditionPerformance {
  name: string
  cases: number
  success: number
  avgRating: number
  avgValue: number
  difficulty: 'easy' | 'moderate' | 'hard'
  trendDirection: 'up' | 'down' | 'stable'
  commonEvidence: string[]
  keyPrecedents: string[]
}

export interface RegionalData {
  region: string
  cases: number
  success: number
  avgTime: number
}

export interface Insight {
  type: 'trend' | 'alert' | 'opportunity'
  title: string
  description: string
  actionable: boolean
}

// OCR Types
export interface OCROptions {
  quality: 'standard' | 'high' | 'ultra'
  language: string
  enableVAFormRecognition: boolean
  confidenceThreshold: number
  onProgress?: (progress: number, status: string) => void
}

export interface ProcessedDocument {
  id: string
  timestamp: string
  filename: string
  type: string
  confidence: number
  extractedText: string
  originalText: string
  sections: DocumentSection[]
  metadata: DocumentMetadata
  structuredData?: Record<string, any>
  keywords: string[]
  vaTermsFound: string[]
}

export interface DocumentSection {
  name: string
  confidence: number
  extracted: boolean
}

export interface DocumentMetadata {
  formType: string
  priority: string
  vaTermsFound: number
  pages?: number
  words?: number
  confidence: number
}

export interface OCRServiceInfo {
  initialized: boolean
  capabilities: {
    vaFormRecognition: boolean
    multiPageSupport: boolean
    batchProcessing: boolean
  }
  vaFormsSupported: string
  maxFileSize: string
  supportedFormats: string[]
}

// Audio Transcription Types
export interface TranscriptData {
  id: string
  title: string
  type: 'cp_exam' | 'consultation' | 'recording' | 'deposition'
  date: string
  duration: string
  speakers: string[]
  status: 'completed' | 'processing' | 'failed'
  confidence: number
  language: string
  summary: string
  keyFindings: string[]
  transcript: string
  vaTerms: string[]
  precedents: string[]
  recommendations: string[]
}

export interface SpeechServiceInfo {
  capabilities: {
    realTimeTranscription: boolean
    fileProcessing: boolean
    speakerDetection: boolean
    vaTerminologyEnhancement: boolean
  }
  vaTermsCount: number
}

// Legal Research Types
export interface LegalDocument {
  id: string
  title: string
  type: 'regulation' | 'case_law' | 'manual' | 'guidance'
  category: string
  summary: string
  content: string
  lastUpdated: string
  relevanceScore?: number
  bookmarked: boolean
  tags: string[]
  section?: string
  keywords?: string[]
}

export interface SearchOptions {
  type: 'all' | 'regulation' | 'case_law' | 'manual' | 'guidance'
  dateRange?: {
    start: string
    end: string
  }
  jurisdiction?: string
  category?: string
}

// Common UI Types
export interface TabConfig {
  id: string
  label: string
  icon: React.ComponentType
  gradient: string
  description: string
}

export interface ServiceStatus {
  initialized: boolean
  capabilities: Record<string, boolean>
  [key: string]: any
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ProcessingProgress {
  progress: number
  status: string
  stage: string
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

// Theme and UI Types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}