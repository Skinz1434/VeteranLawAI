import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, Circle, AlertCircle, Clock, FileText, 
  Camera, Stethoscope, Users, Briefcase, Shield,
  ChevronDown, ChevronRight, Info
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

const ClaimChecklist = ({ claimType = 'disability' }) => {
  const [expandedSections, setExpandedSections] = useState([])
  const [checkedItems, setCheckedItems] = useState([])

  const checklistSections = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: Users,
      required: true,
      items: [
        { id: 'personal-1', label: 'Full legal name matches DD-214', required: true },
        { id: 'personal-2', label: 'Social Security Number verified', required: true },
        { id: 'personal-3', label: 'Current contact information updated', required: true },
        { id: 'personal-4', label: 'Power of Attorney (if applicable)', required: false }
      ]
    },
    {
      id: 'military',
      title: 'Military Service Records',
      icon: Shield,
      required: true,
      items: [
        { id: 'military-1', label: 'DD-214 (Member Copy 4)', required: true },
        { id: 'military-2', label: 'Service treatment records', required: true },
        { id: 'military-3', label: 'Personnel records', required: false },
        { id: 'military-4', label: 'Awards and decorations', required: false }
      ]
    },
    {
      id: 'medical',
      title: 'Medical Evidence',
      icon: Stethoscope,
      required: true,
      items: [
        { id: 'medical-1', label: 'Current diagnosis from healthcare provider', required: true },
        { id: 'medical-2', label: 'Medical nexus letter', required: true },
        { id: 'medical-3', label: 'Treatment records (past 12 months)', required: true },
        { id: 'medical-4', label: 'C&P exam scheduled/completed', required: false },
        { id: 'medical-5', label: 'Buddy statements', required: false }
      ]
    },
    {
      id: 'forms',
      title: 'VA Forms',
      icon: FileText,
      required: true,
      items: [
        { id: 'forms-1', label: 'VA Form 21-526EZ (Application)', required: true },
        { id: 'forms-2', label: 'VA Form 21-4138 (Statement in Support)', required: false },
        { id: 'forms-3', label: 'VA Form 21-0781 (PTSD Statement)', required: false },
        { id: 'forms-4', label: 'VA Form 21-8940 (Intent to File)', required: true }
      ]
    },
    {
      id: 'supporting',
      title: 'Supporting Documentation',
      icon: Briefcase,
      required: false,
      items: [
        { id: 'supporting-1', label: 'Employment records showing impact', required: false },
        { id: 'supporting-2', label: 'Lay statements from family/friends', required: false },
        { id: 'supporting-3', label: 'Photos of conditions/injuries', required: false },
        { id: 'supporting-4', label: 'Private medical opinions', required: false }
      ]
    }
  ]

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const toggleItem = (itemId) => {
    setCheckedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const getSectionProgress = (section) => {
    const sectionItems = section.items.map(item => item.id)
    const checkedCount = sectionItems.filter(id => checkedItems.includes(id)).length
    return Math.round((checkedCount / section.items.length) * 100)
  }

  const getOverallProgress = () => {
    const totalItems = checklistSections.flatMap(section => section.items).length
    const checkedCount = checkedItems.length
    return Math.round((checkedCount / totalItems) * 100)
  }

  const getRequiredItemsStatus = () => {
    const requiredItems = checklistSections
      .flatMap(section => section.items)
      .filter(item => item.required)
    const checkedRequiredItems = requiredItems.filter(item => checkedItems.includes(item.id))
    return {
      completed: checkedRequiredItems.length,
      total: requiredItems.length
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Claim Status Checklist</CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              Track your claim preparation progress
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{getOverallProgress()}%</div>
            <p className="text-xs text-slate-400">Overall Progress</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>Required Items: {getRequiredItemsStatus().completed}/{getRequiredItemsStatus().total}</span>
            <span>{getOverallProgress()}% Complete</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getOverallProgress()}%` }}
            />
          </div>
        </div>

        {/* Checklist Sections */}
        <div className="space-y-4">
          {checklistSections.map((section) => {
            const Icon = section.icon
            const isExpanded = expandedSections.includes(section.id)
            const progress = getSectionProgress(section)
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-800/30 rounded-xl overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      progress === 100 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-br from-slate-600 to-slate-700'
                    }`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        {section.title}
                        {section.required && (
                          <Badge variant="primary" size="small">Required</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {section.items.filter(item => checkedItems.includes(item.id)).length}/{section.items.length} items completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">{progress}%</div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Section Items */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-700/50"
                    >
                      <div className="p-4 space-y-3">
                        {section.items.map((item) => {
                          const isChecked = checkedItems.includes(item.id)
                          
                          return (
                            <label
                              key={item.id}
                              className="flex items-start space-x-3 cursor-pointer group"
                            >
                              <button
                                type="button"
                                onClick={() => toggleItem(item.id)}
                                className="mt-0.5"
                              >
                                {isChecked ? (
                                  <CheckCircle className="h-5 w-5 text-green-400" />
                                ) : (
                                  <Circle className="h-5 w-5 text-slate-500 group-hover:text-slate-400" />
                                )}
                              </button>
                              <div className="flex-1">
                                <span className={`text-sm ${
                                  isChecked ? 'text-slate-400 line-through' : 'text-white'
                                }`}>
                                  {item.label}
                                </span>
                                {item.required && !isChecked && (
                                  <Badge variant="danger" size="small" className="ml-2">
                                    Required
                                  </Badge>
                                )}
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" size="small" icon={FileText}>
            Export Checklist
          </Button>
          <Button 
            variant="primary" 
            size="small"
            disabled={getRequiredItemsStatus().completed < getRequiredItemsStatus().total}
          >
            Submit Claim
          </Button>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-blue-400 mb-1">Pro Tip</p>
              <p>Complete all required items before submitting your claim to avoid delays. Optional items can strengthen your case but aren't mandatory for filing.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClaimChecklist