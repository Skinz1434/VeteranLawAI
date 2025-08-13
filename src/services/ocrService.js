/**
 * @fileoverview OCR Service for VeteranLawAI Platform
 * @author VeteranLawAI Platform
 * @version 1.0.0
 *
 * Advanced OCR service with VA form recognition and legal document processing.
 * Integrates with Tesseract.js for client-side OCR processing.
 */

import { announceToScreenReader } from '../utils/accessibility'

/**
 * VA Form Recognition Patterns
 */
const VA_FORM_PATTERNS = {
  '21-526EZ': {
    name: 'Application for Disability Compensation',
    keywords: ['disability compensation', '21-526ez', 'veteran compensation', 'service-connected'],
    priority: 'high',
    sections: ['personal_info', 'service_history', 'medical_conditions', 'signatures'],
  },
  '21-4142': {
    name: 'Authorization to Disclose Information',
    keywords: ['authorization', 'disclose', '21-4142', 'medical records'],
    priority: 'high',
    sections: ['authorization', 'provider_info', 'signature'],
  },
  '21-0781': {
    name: 'Statement in Support of Claim for PTSD',
    keywords: ['ptsd', 'post-traumatic stress', '21-0781', 'stressor'],
    priority: 'high',
    sections: ['stressor_info', 'incident_details', 'medical_treatment'],
  },
  '21-8940': {
    name: 'Veterans Application for Increased Compensation',
    keywords: ['increased compensation', '21-8940', 'rating increase'],
    priority: 'medium',
    sections: ['current_conditions', 'new_evidence', 'medical_records'],
  },
  10182: {
    name: 'Decision Review Request',
    keywords: ['decision review', '10182', 'supplemental claim', 'higher level review'],
    priority: 'high',
    sections: ['review_type', 'issues', 'evidence'],
  },
  DBQ: {
    name: 'Disability Benefits Questionnaire',
    keywords: ['disability benefits questionnaire', 'dbq', 'medical examination'],
    priority: 'high',
    sections: ['medical_history', 'examination', 'diagnosis', 'opinion'],
  },
  'C&P': {
    name: 'Compensation & Pension Examination',
    keywords: ['compensation pension', 'c&p exam', 'medical examination'],
    priority: 'high',
    sections: ['examination_results', 'diagnosis', 'functional_assessment'],
  },
}

/**
 * Medical and Legal Keywords for Enhanced Recognition
 */
const MEDICAL_LEGAL_KEYWORDS = {
  conditions: [
    'PTSD',
    'TBI',
    'traumatic brain injury',
    'depression',
    'anxiety',
    'back pain',
    'knee pain',
    'hearing loss',
    'tinnitus',
    'sleep apnea',
    'diabetes',
    'hypertension',
    'heart condition',
    'migraine',
    'arthritis',
  ],
  legal: [
    'service connected',
    'nexus letter',
    'medical opinion',
    'lay evidence',
    'buddy statement',
    'stressor',
    'aggravation',
    'secondary condition',
    'individual unemployability',
    'TDIU',
    'rating',
    'effective date',
  ],
  administrative: [
    'VA regional office',
    'VBA',
    'BVA',
    'CAVC',
    'decision review officer',
    'rating decision',
    'notice of disagreement',
    'supplemental claim',
  ],
}

/**
 * OCR Configuration for different quality levels
 */
const OCR_CONFIG = {
  standard: {
    tesseractOptions: {
      logger: m => console.log(m),
      tessedit_char_whitelist:
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,!?@#$%^&*()_+-=[]{}|;\':"<>/\\',
      tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
    },
  },
  high: {
    tesseractOptions: {
      logger: m => console.log(m),
      tessedit_char_whitelist:
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,!?@#$%^&*()_+-=[]{}|;\':"<>/\\',
      tessedit_pageseg_mode: '3', // Fully automatic page segmentation
      preserve_interword_spaces: '1',
    },
  },
  ultra: {
    tesseractOptions: {
      logger: m => console.log(m),
      tessedit_char_whitelist:
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,!?@#$%^&*()_+-=[]{}|;\':"<>/\\',
      tessedit_pageseg_mode: '1',
      preserve_interword_spaces: '1',
      textord_heavy_nr: '1',
    },
  },
}

/**
 * OCR Service Class
 */
export class OCRService {
  constructor() {
    this.tesseractWorker = null
    this.isInitialized = false
    this.processing = false
  }

  /**
   * Initialize Tesseract worker
   */
  async initialize() {
    try {
      // For demo purposes, we'll simulate Tesseract initialization
      // In production, this would initialize the actual Tesseract.js worker
      console.log('OCR Service: Initializing Tesseract worker...')

      // Simulate initialization time
      await this.simulateDelay(1000)

      this.isInitialized = true
      announceToScreenReader('OCR service initialized and ready for document processing')

      return {
        success: true,
        engine: 'Tesseract.js',
        languages: ['eng'],
        capabilities: {
          textExtraction: true,
          vaFormRecognition: true,
          confidenceScoring: true,
          structuredData: true,
        },
      }
    } catch (error) {
      console.error('Failed to initialize OCR service:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Process image or PDF for OCR
   */
  async processDocument(input, options = {}) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    const {
      quality = 'high',
      language = 'eng',
      onProgress = null,
      enableVAFormRecognition = true,
      confidenceThreshold = 0.7,
    } = options

    this.processing = true

    try {
      // Validate input
      this.validateInput(input)

      if (onProgress) onProgress(10, 'Preparing image for processing...')

      // Preprocess image for better OCR results
      const preprocessedImage = await this.preprocessImage(input)
      if (onProgress) onProgress(25, 'Image preprocessing complete')

      // Perform OCR
      if (onProgress) onProgress(40, 'Extracting text from document...')
      const ocrResult = await this.performOCR(preprocessedImage, quality)
      if (onProgress) onProgress(70, 'Text extraction complete')

      // Recognize VA forms if enabled
      let formType = null
      let structuredData = null
      if (enableVAFormRecognition) {
        if (onProgress) onProgress(80, 'Analyzing document structure...')
        formType = this.recognizeVAForm(ocrResult.text)
        structuredData = this.extractStructuredData(ocrResult.text, formType)
      }

      // Post-process and enhance text
      if (onProgress) onProgress(90, 'Enhancing extracted text...')
      const enhancedText = this.enhanceExtractedText(ocrResult.text)

      // Calculate overall confidence
      const confidence = this.calculateConfidence(ocrResult, formType)

      if (onProgress) onProgress(100, 'Processing complete')

      const result = {
        success: true,
        extractedText: enhancedText,
        originalText: ocrResult.text,
        confidence,
        formType,
        structuredData,
        metadata: {
          processingTime: Date.now(),
          quality,
          language,
          wordCount: enhancedText.split(/\s+/).length,
          characterCount: enhancedText.length,
        },
        sections: this.analyzeSections(enhancedText, formType),
        keywords: this.extractKeywords(enhancedText),
        vaTermsFound: this.findVATerms(enhancedText),
      }

      announceToScreenReader(
        `OCR processing completed with ${Math.round(confidence * 100)}% confidence`
      )

      return result
    } catch (error) {
      console.error('OCR processing failed:', error)
      throw new Error(`OCR processing failed: ${error.message}`)
    } finally {
      this.processing = false
    }
  }

  /**
   * Validate input file or image data
   */
  validateInput(input) {
    if (!input) {
      throw new Error('No input provided for OCR processing')
    }

    if (input instanceof File) {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/tiff',
        'image/bmp',
        'image/webp',
        'application/pdf',
      ]

      if (!allowedTypes.includes(input.type)) {
        throw new Error(`Unsupported file type: ${input.type}`)
      }

      // Check file size (max 10MB)
      if (input.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit')
      }
    }
  }

  /**
   * Preprocess image for better OCR results
   */
  async preprocessImage(input) {
    // In production, this would perform actual image preprocessing:
    // - Noise reduction
    // - Contrast enhancement
    // - Deskewing
    // - Border removal

    // For demo, we'll simulate preprocessing
    await this.simulateDelay(500)

    return input
  }

  /**
   * Perform actual OCR using Tesseract (simulated for demo)
   */
  async performOCR(image, quality) {
    // In production, this would use actual Tesseract.js:
    // const result = await this.tesseractWorker.recognize(image, config)

    // For demo purposes, generate realistic OCR result
    const mockResults = [
      {
        text: `DEPARTMENT OF VETERANS AFFAIRS
APPLICATION FOR DISABILITY COMPENSATION AND RELATED COMPENSATION BENEFITS

VETERAN'S INFORMATION:
First Name: John               Middle Initial: A               Last Name: Veteran
Social Security Number: XXX-XX-1234                          Date of Birth: 01/15/1980
Military Service: US Army                                     Service Dates: 01/2000 - 12/2008

CLAIMED CONDITIONS:
1. Chronic lower back pain (lumbar spine injury)
2. Post-traumatic stress disorder (PTSD)
3. Bilateral hearing loss (noise-induced)
4. Sleep apnea (secondary to PTSD)
5. Chronic knee pain (left knee injury)

MILITARY HISTORY:
Branch: United States Army
Dates of Service: January 2000 - December 2008
Military Occupational Specialty: 11B Infantry
Deployments: Iraq (2003-2004), Afghanistan (2006-2007)

SUPPORTING EVIDENCE:
☑ Service treatment records
☑ VA medical records
☑ Private medical records
☑ Buddy statements
☑ Nexus letter from Dr. Smith

I CERTIFY THAT the statements made in this application are true and complete to the best of my knowledge and belief.

Veteran Signature: John A. Veteran                           Date: 03/15/2024`,
        confidence: 0.94,
      },
      {
        text: `AUTHORIZATION AND CONSENT TO RELEASE INFORMATION TO THE
DEPARTMENT OF VETERANS AFFAIRS (VA)

SECTION I - VETERAN/CLAIMANT INFORMATION
Name: Maria Elena Rodriguez
SSN: XXX-XX-5678
Date of Birth: 05/22/1985
Address: 123 Main Street, Anytown, ST 12345

SECTION II - INFORMATION TO BE RELEASED
I authorize the disclosure of information from records of:
Healthcare Provider: Dr. Jennifer Thompson, MD
Address: 456 Medical Plaza, Suite 200, Anytown, ST 12345
Phone: (555) 123-4567

TYPE OF INFORMATION TO BE DISCLOSED:
☑ Complete medical records
☑ Treatment records
☑ Diagnostic test results
☑ Progress notes
☑ Discharge summaries

PURPOSE: In connection with my claim for VA disability compensation benefits.

This authorization will remain in effect for one year from the date signed below unless I revoke it in writing.

Signature: Maria E. Rodriguez                    Date: 03/20/2024`,
        confidence: 0.97,
      },
    ]

    // Simulate processing time
    await this.simulateDelay(2000)

    // Return random mock result
    return mockResults[Math.floor(Math.random() * mockResults.length)]
  }

  /**
   * Recognize VA form type from extracted text
   */
  recognizeVAForm(text) {
    if (!text) return null

    const lowerText = text.toLowerCase()
    let bestMatch = null
    let highestScore = 0

    Object.entries(VA_FORM_PATTERNS).forEach(([formId, formData]) => {
      let score = 0

      formData.keywords.forEach(keyword => {
        if (lowerText.includes(keyword.toLowerCase())) {
          score += 1
        }
      })

      // Bonus for exact form number match
      if (lowerText.includes(formId.toLowerCase())) {
        score += 3
      }

      if (score > highestScore) {
        highestScore = score
        bestMatch = {
          id: formId,
          name: formData.name,
          priority: formData.priority,
          confidence: Math.min(0.95, score * 0.2),
        }
      }
    })

    return bestMatch
  }

  /**
   * Extract structured data based on form type
   */
  extractStructuredData(text, formType) {
    if (!formType || !text) return null

    const data = {}
    const lines = text.split('\n')

    // Extract common fields based on form type
    switch (formType.id) {
      case '21-526EZ':
        data.personalInfo = this.extractPersonalInfo(text)
        data.claimedConditions = this.extractClaimedConditions(text)
        data.serviceHistory = this.extractServiceHistory(text)
        data.signatures = this.extractSignatures(text)
        break

      case '21-4142':
        data.authorization = this.extractAuthorizationInfo(text)
        data.providerInfo = this.extractProviderInfo(text)
        data.disclosureType = this.extractDisclosureType(text)
        break

      case '21-0781':
        data.stressorInfo = this.extractStressorInfo(text)
        data.incidentDetails = this.extractIncidentDetails(text)
        break

      default:
        data.generalInfo = this.extractGeneralInfo(text)
    }

    return data
  }

  /**
   * Extract personal information from text
   */
  extractPersonalInfo(text) {
    const info = {}

    // Extract name
    const nameMatch = text.match(/(?:name|first name)[:\s]*([a-zA-Z\s]+)/i)
    if (nameMatch) info.name = nameMatch[1].trim()

    // Extract SSN (partially redacted)
    const ssnMatch = text.match(/(?:ssn|social security)[:\s]*([X\d-]+)/i)
    if (ssnMatch) info.ssn = ssnMatch[1].trim()

    // Extract date of birth
    const dobMatch = text.match(/(?:date of birth|dob)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i)
    if (dobMatch) info.dateOfBirth = dobMatch[1].trim()

    return info
  }

  /**
   * Extract claimed conditions
   */
  extractClaimedConditions(text) {
    const conditions = []
    const lines = text.split('\n')

    let inConditionsSection = false

    lines.forEach(line => {
      if (
        line.toLowerCase().includes('claimed conditions') ||
        line.toLowerCase().includes('conditions claimed')
      ) {
        inConditionsSection = true
        return
      }

      if (inConditionsSection) {
        // Look for numbered or bulleted conditions
        const conditionMatch = line.match(/^\s*[\d\.\)\-\*•]\s*(.+)/i)
        if (conditionMatch) {
          conditions.push(conditionMatch[1].trim())
        }

        // Stop if we hit another section
        if (line.match(/^[A-Z\s]+:/) && !line.toLowerCase().includes('condition')) {
          inConditionsSection = false
        }
      }
    })

    return conditions
  }

  /**
   * Extract service history
   */
  extractServiceHistory(text) {
    const history = {}

    const branchMatch = text.match(/(?:branch|service)[:\s]*([a-zA-Z\s]+)/i)
    if (branchMatch) history.branch = branchMatch[1].trim()

    const datesMatch = text.match(/(?:service dates|dates of service)[:\s]*([0-9\/\-\s]+)/i)
    if (datesMatch) history.serviceDates = datesMatch[1].trim()

    return history
  }

  /**
   * Extract signatures
   */
  extractSignatures(text) {
    const signatures = []
    const lines = text.split('\n')

    lines.forEach(line => {
      if (line.toLowerCase().includes('signature') && line.includes('date')) {
        signatures.push(line.trim())
      }
    })

    return signatures
  }

  /**
   * Enhance extracted text with corrections and formatting
   */
  enhanceExtractedText(text) {
    if (!text) return ''

    let enhanced = text

    // Fix common OCR errors
    const corrections = {
      'DEPARTM ENT': 'DEPARTMENT',
      'VETERA NS': 'VETERANS',
      'AFFA IRS': 'AFFAIRS',
      'INFORMA TION': 'INFORMATION',
      'APPLICA TION': 'APPLICATION',
      'COMPENSA TION': 'COMPENSATION',
      'DISABIL ITY': 'DISABILITY',
      0: 'O', // Context-dependent
      5: 'S', // Context-dependent
      1: 'I', // Context-dependent
    }

    // Apply corrections (carefully to avoid over-correction)
    Object.entries(corrections).forEach(([error, correction]) => {
      const regex = new RegExp(error, 'gi')
      enhanced = enhanced.replace(regex, correction)
    })

    // Clean up spacing
    enhanced = enhanced.replace(/\s+/g, ' ')
    enhanced = enhanced.replace(/\n\s*\n/g, '\n\n')

    // Capitalize proper nouns and section headers
    enhanced = enhanced.replace(/^([A-Z\s]+):$/gm, match => {
      return match.toUpperCase()
    })

    return enhanced.trim()
  }

  /**
   * Calculate overall confidence score
   */
  calculateConfidence(ocrResult, formType) {
    let confidence = ocrResult.confidence || 0.8

    // Boost confidence if form type was recognized
    if (formType && formType.confidence > 0.7) {
      confidence = Math.min(0.99, confidence + 0.05)
    }

    // Reduce confidence for very short text
    if (ocrResult.text && ocrResult.text.length < 100) {
      confidence *= 0.8
    }

    return Math.round(confidence * 100) / 100
  }

  /**
   * Analyze document sections
   */
  analyzeSections(text, formType) {
    const sections = []

    if (!text) return sections

    // Default sections for any document
    const defaultSections = [
      { name: 'Header Information', confidence: 0.9, extracted: true },
      { name: 'Main Content', confidence: 0.85, extracted: true },
      {
        name: 'Signatures/Dates',
        confidence: 0.8,
        extracted: text.toLowerCase().includes('signature'),
      },
    ]

    // Form-specific sections
    if (formType && VA_FORM_PATTERNS[formType.id]) {
      const formSections = VA_FORM_PATTERNS[formType.id].sections

      return formSections.map(sectionId => {
        const extracted = this.checkSectionExtracted(text, sectionId)
        return {
          name: this.getSectionDisplayName(sectionId),
          confidence: extracted ? 0.85 + Math.random() * 0.1 : 0.6,
          extracted,
        }
      })
    }

    return defaultSections
  }

  /**
   * Check if section was successfully extracted
   */
  checkSectionExtracted(text, sectionId) {
    const sectionKeywords = {
      personal_info: ['name', 'social security', 'date of birth'],
      service_history: ['service', 'military', 'branch'],
      medical_conditions: ['condition', 'disability', 'injury'],
      signatures: ['signature', 'date', 'certify'],
      authorization: ['authorize', 'consent', 'disclosure'],
      provider_info: ['provider', 'doctor', 'clinic'],
    }

    const keywords = sectionKeywords[sectionId] || []
    const lowerText = text.toLowerCase()

    return keywords.some(keyword => lowerText.includes(keyword))
  }

  /**
   * Get display name for section
   */
  getSectionDisplayName(sectionId) {
    const displayNames = {
      personal_info: 'Personal Information',
      service_history: 'Service History',
      medical_conditions: 'Medical Conditions',
      signatures: 'Signatures',
      authorization: 'Authorization',
      provider_info: 'Provider Information',
      stressor_info: 'Stressor Information',
      incident_details: 'Incident Details',
    }

    return (
      displayNames[sectionId] || sectionId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    )
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text) {
    if (!text) return []

    const allKeywords = [
      ...MEDICAL_LEGAL_KEYWORDS.conditions,
      ...MEDICAL_LEGAL_KEYWORDS.legal,
      ...MEDICAL_LEGAL_KEYWORDS.administrative,
    ]

    const foundKeywords = []
    const lowerText = text.toLowerCase()

    allKeywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword)
      }
    })

    return [...new Set(foundKeywords)] // Remove duplicates
  }

  /**
   * Find VA-specific terms in text
   */
  findVATerms(text) {
    const vaTerms = []
    const lowerText = text.toLowerCase()

    // Check for form numbers
    Object.keys(VA_FORM_PATTERNS).forEach(formId => {
      if (lowerText.includes(formId.toLowerCase())) {
        vaTerms.push(formId)
      }
    })

    // Check for common VA terms
    const commonVATerms = [
      'VA',
      'Department of Veterans Affairs',
      'VBA',
      'Veterans Benefits Administration',
      'C&P examination',
      'DBQ',
      'service connection',
      'disability rating',
      'PTSD',
      'TBI',
      'Individual unemployability',
      'TDIU',
    ]

    commonVATerms.forEach(term => {
      if (lowerText.includes(term.toLowerCase())) {
        vaTerms.push(term)
      }
    })

    return [...new Set(vaTerms)]
  }

  /**
   * Get service capabilities and status
   */
  getServiceInfo() {
    return {
      initialized: this.isInitialized,
      processing: this.processing,
      supportedFormats: ['image/jpeg', 'image/png', 'image/tiff', 'image/bmp', 'application/pdf'],
      languages: ['eng'],
      capabilities: {
        textExtraction: true,
        vaFormRecognition: true,
        structuredDataExtraction: true,
        confidenceScoring: true,
        keywordExtraction: true,
      },
      vaFormsSupported: Object.keys(VA_FORM_PATTERNS).length,
      maxFileSize: '10MB',
    }
  }

  /**
   * Utility function for simulating delays
   */
  simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Placeholder methods for additional structured data extraction
  extractAuthorizationInfo(text) {
    return { type: 'medical_records', scope: 'complete' }
  }
  extractProviderInfo(text) {
    return { name: 'Healthcare Provider', address: 'Address extracted' }
  }
  extractDisclosureType(text) {
    return ['medical_records', 'treatment_records']
  }
  extractStressorInfo(text) {
    return { type: 'combat', location: 'Iraq/Afghanistan' }
  }
  extractIncidentDetails(text) {
    return { date: 'Service period', description: 'Combat stressor' }
  }
  extractGeneralInfo(text) {
    return { documentType: 'VA Form', extracted: true }
  }
}

// Create singleton instance
export const ocrService = new OCRService()

// Export utility functions
export const initializeOCR = async () => {
  return await ocrService.initialize()
}

export const processDocumentOCR = async (input, options = {}) => {
  return await ocrService.processDocument(input, options)
}

export const getOCRServiceInfo = () => {
  return ocrService.getServiceInfo()
}
