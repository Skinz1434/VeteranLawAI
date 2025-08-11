/**
 * @fileoverview VA Form Generation Utility
 * @author VeteranLawAI Platform
 * @version 1.0.0
 * 
 * Generates populated VA forms based on claim data
 */

export class VAFormGenerator {
  constructor() {
    this.formTemplates = this.initializeFormTemplates()
  }

  initializeFormTemplates() {
    return {
      '21-526EZ': {
        name: 'Application for Disability Compensation',
        sections: [
          'veteranInformation',
          'militaryService',
          'disabilityInformation',
          'treatmentHistory',
          'employment',
          'directDeposit'
        ],
        requiredFields: [
          'ssn', 'firstName', 'lastName', 'dateOfBirth',
          'serviceNumber', 'branch', 'activeDutyStart', 'activeDutyEnd',
          'conditions', 'currentAddress', 'phoneNumber'
        ]
      },
      '21-4142': {
        name: 'Authorization to Release Medical Records',
        sections: [
          'veteranInformation',
          'medicalProviders',
          'conditionsTreated',
          'authorization'
        ],
        requiredFields: [
          'ssn', 'firstName', 'lastName', 'dateOfBirth',
          'providerName', 'providerAddress', 'treatmentDates'
        ]
      },
      '21-0781': {
        name: 'Statement in Support of Claim for PTSD',
        sections: [
          'veteranInformation',
          'stressorInformation',
          'combatInformation',
          'unitInformation',
          'treatmentInformation'
        ],
        requiredFields: [
          'ssn', 'firstName', 'lastName',
          'stressorDescription', 'stressorDate', 'stressorLocation'
        ]
      },
      '21-4138': {
        name: 'Statement in Support of Claim',
        sections: [
          'veteranInformation',
          'statementDetails'
        ],
        requiredFields: [
          'ssn', 'firstName', 'lastName',
          'statement'
        ]
      }
    }
  }

  /**
   * Generates a populated VA form
   * @param {string} formType - Form number (e.g., '21-526EZ')
   * @param {Object} claimData - Data to populate the form
   * @returns {Object} Generated form data
   */
  generateForm(formType, claimData) {
    const template = this.formTemplates[formType]
    if (!template) {
      throw new Error(`Unknown form type: ${formType}`)
    }

    const formData = {
      formType,
      formName: template.name,
      generatedDate: new Date().toISOString(),
      sections: {}
    }

    // Generate each section
    template.sections.forEach(section => {
      formData.sections[section] = this.generateSection(section, claimData)
    })

    // Validate required fields
    const validation = this.validateForm(formType, formData)
    formData.validation = validation

    return formData
  }

  /**
   * Generates a specific form section
   */
  generateSection(sectionType, claimData) {
    switch (sectionType) {
      case 'veteranInformation':
        return {
          ssn: claimData.veteran?.ssn || '',
          firstName: claimData.veteran?.firstName || '',
          middleName: claimData.veteran?.middleName || '',
          lastName: claimData.veteran?.lastName || '',
          dateOfBirth: claimData.veteran?.dateOfBirth || '',
          vaFileNumber: claimData.veteran?.vaFileNumber || '',
          currentAddress: {
            street: claimData.veteran?.address?.street || '',
            city: claimData.veteran?.address?.city || '',
            state: claimData.veteran?.address?.state || '',
            zipCode: claimData.veteran?.address?.zipCode || ''
          },
          phoneNumber: claimData.veteran?.phoneNumber || '',
          email: claimData.veteran?.email || ''
        }

      case 'militaryService':
        return {
          serviceNumber: claimData.military?.serviceNumber || '',
          branch: claimData.military?.branch || '',
          activeDutyPeriods: claimData.military?.servicePeriods?.map(period => ({
            startDate: period.startDate,
            endDate: period.endDate,
            serviceType: period.serviceType || 'Active Duty',
            branch: period.branch || claimData.military?.branch
          })) || [],
          combatService: claimData.military?.combatService || false,
          specialCircumstances: claimData.military?.specialCircumstances || []
        }

      case 'disabilityInformation':
        return {
          claimedConditions: claimData.conditions?.map(condition => ({
            name: condition.name,
            diagnosticCode: condition.diagnosticCode,
            dateDiagnosed: condition.dateDiagnosed || '',
            treatedDuringService: condition.treatedDuringService || false,
            currentlyBeingTreated: condition.currentlyBeingTreated || true,
            medications: condition.medications || [],
            functionalImpact: condition.functionalImpact || '',
            serviceConnection: condition.serviceConnection || 'direct'
          })) || [],
          secondaryConditions: claimData.secondaryConditions || [],
          unemployability: claimData.unemployability || false
        }

      case 'treatmentHistory':
        return {
          vaFacilities: claimData.treatment?.vaFacilities?.map(facility => ({
            name: facility.name,
            location: facility.location,
            treatmentDates: facility.treatmentDates,
            conditionsTreated: facility.conditionsTreated
          })) || [],
          privateFacilities: claimData.treatment?.privateFacilities?.map(facility => ({
            providerName: facility.providerName,
            providerAddress: facility.providerAddress,
            phoneNumber: facility.phoneNumber,
            treatmentDates: facility.treatmentDates,
            conditionsTreated: facility.conditionsTreated
          })) || []
        }

      case 'employment':
        return {
          currentlyEmployed: claimData.employment?.currentlyEmployed || false,
          employer: claimData.employment?.employer || '',
          occupation: claimData.employment?.occupation || '',
          monthlyIncome: claimData.employment?.monthlyIncome || 0,
          missedWorkDays: claimData.employment?.missedWorkDays || 0,
          accommodations: claimData.employment?.accommodations || []
        }

      case 'stressorInformation':
        return {
          stressors: claimData.stressors?.map(stressor => ({
            description: stressor.description,
            date: stressor.date,
            location: stressor.location,
            unit: stressor.unit,
            witnesses: stressor.witnesses || [],
            documentation: stressor.documentation || ''
          })) || []
        }

      default:
        return {}
    }
  }

  /**
   * Validates form completeness
   */
  validateForm(formType, formData) {
    const template = this.formTemplates[formType]
    const missingFields = []
    const warnings = []

    // Check required fields
    template.requiredFields.forEach(field => {
      if (!this.hasFieldValue(formData, field)) {
        missingFields.push(field)
      }
    })

    // Form-specific validations
    if (formType === '21-526EZ') {
      if (!formData.sections.disabilityInformation?.claimedConditions?.length) {
        warnings.push('No conditions claimed')
      }
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings,
      completeness: Math.round(
        ((template.requiredFields.length - missingFields.length) / 
         template.requiredFields.length) * 100
      )
    }
  }

  /**
   * Checks if a field has a value in the form data
   */
  hasFieldValue(formData, fieldPath) {
    const paths = fieldPath.split('.')
    let current = formData.sections

    for (const path of paths) {
      if (!current || !current[path]) return false
      current = current[path]
    }

    return current !== '' && current !== null && current !== undefined
  }

  /**
   * Generates a statement in support of claim
   */
  generateStatement(claimData) {
    const { conditions, veteran, military } = claimData
    
    let statement = `I, ${veteran.firstName} ${veteran.lastName}, hereby submit this statement in support of my claim for VA disability compensation.\n\n`
    
    statement += `Military Service:\n`
    statement += `I served in the ${military.branch} from ${military.servicePeriods[0].startDate} to ${military.servicePeriods[0].endDate}.`
    if (military.combatService) {
      statement += ` During my service, I was deployed to a combat zone.`
    }
    statement += `\n\n`
    
    statement += `Claimed Conditions:\n`
    conditions.forEach(condition => {
      statement += `\n${condition.name}:\n`
      statement += `This condition began during my military service. `
      statement += `${condition.description || ''} `
      statement += `This condition has significantly impacted my daily life and ability to work.\n`
    })
    
    statement += `\nI certify that the statements made herein are true and correct to the best of my knowledge and belief.\n`
    
    return statement
  }

  /**
   * Exports form data to various formats
   */
  exportForm(formData, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(formData, null, 2)
        
      case 'text':
        return this.formatAsText(formData)
        
      case 'html':
        return this.formatAsHTML(formData)
        
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  /**
   * Formats form data as plain text
   */
  formatAsText(formData) {
    let text = `VA Form ${formData.formType}: ${formData.formName}\n`
    text += `Generated: ${new Date(formData.generatedDate).toLocaleDateString()}\n`
    text += `${'='.repeat(50)}\n\n`
    
    Object.entries(formData.sections).forEach(([sectionName, sectionData]) => {
      text += `${this.formatSectionName(sectionName)}:\n`
      text += `${'-'.repeat(30)}\n`
      text += this.formatSectionData(sectionData) + '\n\n'
    })
    
    return text
  }

  /**
   * Formats form data as HTML
   */
  formatAsHTML(formData) {
    let html = `
      <div class="va-form">
        <h1>VA Form ${formData.formType}: ${formData.formName}</h1>
        <p>Generated: ${new Date(formData.generatedDate).toLocaleDateString()}</p>
        <hr>
    `
    
    Object.entries(formData.sections).forEach(([sectionName, sectionData]) => {
      html += `
        <section class="form-section">
          <h2>${this.formatSectionName(sectionName)}</h2>
          ${this.formatSectionDataHTML(sectionData)}
        </section>
      `
    })
    
    html += `</div>`
    
    return html
  }

  /**
   * Helper method to format section names
   */
  formatSectionName(name) {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  /**
   * Helper method to format section data as text
   */
  formatSectionData(data, indent = '') {
    let text = ''
    
    Object.entries(data).forEach(([key, value]) => {
      const formattedKey = this.formatSectionName(key)
      
      if (Array.isArray(value)) {
        text += `${indent}${formattedKey}:\n`
        value.forEach((item, index) => {
          text += `${indent}  ${index + 1}. ${JSON.stringify(item)}\n`
        })
      } else if (typeof value === 'object' && value !== null) {
        text += `${indent}${formattedKey}:\n`
        text += this.formatSectionData(value, indent + '  ')
      } else {
        text += `${indent}${formattedKey}: ${value || 'Not provided'}\n`
      }
    })
    
    return text
  }

  /**
   * Helper method to format section data as HTML
   */
  formatSectionDataHTML(data) {
    let html = '<dl class="form-data">'
    
    Object.entries(data).forEach(([key, value]) => {
      const formattedKey = this.formatSectionName(key)
      html += `<dt>${formattedKey}</dt>`
      
      if (Array.isArray(value)) {
        html += '<dd><ul>'
        value.forEach(item => {
          html += `<li>${JSON.stringify(item)}</li>`
        })
        html += '</ul></dd>'
      } else if (typeof value === 'object' && value !== null) {
        html += '<dd>' + this.formatSectionDataHTML(value) + '</dd>'
      } else {
        html += `<dd>${value || '<em>Not provided</em>'}</dd>`
      }
    })
    
    html += '</dl>'
    return html
  }

  /**
   * Generates DBQ (Disability Benefits Questionnaire) recommendations
   */
  generateDBQRecommendations(conditions) {
    const recommendations = []
    
    conditions.forEach(condition => {
      const dbq = this.getDBQForCondition(condition)
      if (dbq) {
        recommendations.push({
          condition: condition.name,
          dbqName: dbq.name,
          dbqNumber: dbq.number,
          requiredExams: dbq.requiredExams,
          keyQuestions: dbq.keyQuestions
        })
      }
    })
    
    return recommendations
  }

  /**
   * Maps conditions to appropriate DBQs
   */
  getDBQForCondition(condition) {
    const dbqMap = {
      'ptsd': {
        name: 'PTSD DBQ',
        number: 'VA Form 21-0960P-3',
        requiredExams: ['Mental health evaluation'],
        keyQuestions: [
          'Frequency and severity of symptoms',
          'Impact on occupational functioning',
          'Impact on social functioning'
        ]
      },
      'back_pain': {
        name: 'Back (Thoracolumbar Spine) DBQ',
        number: 'VA Form 21-0960M-14',
        requiredExams: ['Range of motion testing', 'Neurological exam'],
        keyQuestions: [
          'Range of motion measurements',
          'Pain on motion',
          'Additional limitation after repetitive use'
        ]
      },
      'hearing_loss': {
        name: 'Hearing Loss and Tinnitus DBQ',
        number: 'VA Form 21-0960N-1',
        requiredExams: ['Audiometric testing', 'Maryland CNC test'],
        keyQuestions: [
          'Pure tone thresholds',
          'Speech discrimination scores',
          'Impact on daily communication'
        ]
      }
      // Add more DBQ mappings as needed
    }
    
    return dbqMap[condition.id]
  }
}

// Create singleton instance
export const formGenerator = new VAFormGenerator()