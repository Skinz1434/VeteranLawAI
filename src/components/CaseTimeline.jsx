import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, FileText, AlertCircle, CheckCircle, 
  User, Paperclip, MessageSquare, TrendingUp, Target
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

const CaseTimeline = ({ caseId }) => {
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Mock timeline data
  const timelineEvents = [
    {
      id: 1,
      date: '2024-01-20',
      time: '10:30 AM',
      type: 'milestone',
      title: 'Initial Claim Filed',
      description: 'VA Form 21-526EZ submitted with supporting documentation',
      status: 'completed',
      user: 'Sarah Mitchell',
      attachments: ['Form 21-526EZ.pdf', 'DD214.pdf', 'Medical Records.pdf'],
      icon: FileText,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 2,
      date: '2024-01-22',
      time: '2:15 PM',
      type: 'communication',
      title: 'VA Acknowledgment Received',
      description: 'Claim acknowledged by VA Regional Office',
      status: 'completed',
      user: 'VA System',
      icon: MessageSquare,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 3,
      date: '2024-01-25',
      time: '11:00 AM',
      type: 'task',
      title: 'Medical Evidence Review',
      description: 'Reviewing C&P exam results and private medical records',
      status: 'in-progress',
      user: 'Dr. James Wilson',
      progress: 75,
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 4,
      date: '2024-01-28',
      time: '3:00 PM',
      type: 'deadline',
      title: 'Evidence Submission Deadline',
      description: 'Final deadline for additional evidence submission',
      status: 'upcoming',
      user: 'System Generated',
      daysRemaining: 3,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 5,
      date: '2024-02-05',
      time: 'TBD',
      type: 'milestone',
      title: 'Rating Decision Expected',
      description: 'VA rating decision anticipated based on average processing time',
      status: 'pending',
      user: 'VA System',
      icon: Target,
      color: 'from-purple-500 to-pink-600'
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      completed: { variant: 'success', label: 'Completed' },
      'in-progress': { variant: 'warning', label: 'In Progress' },
      upcoming: { variant: 'danger', label: 'Upcoming' },
      pending: { variant: 'secondary', label: 'Pending' }
    }
    return variants[status] || { variant: 'default', label: status }
  }

  return (
    <Card className="p-0">
      <CardHeader className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <CardTitle>Case Timeline</CardTitle>
          <Button variant="outline" size="small" icon={Calendar}>
            Export Timeline
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700"></div>

          {/* Timeline events */}
          <div className="space-y-6">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon
              const statusInfo = getStatusBadge(event.status)
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`relative flex items-start space-x-4 ${
                    selectedEvent?.id === event.id ? 'bg-slate-800/30 -mx-4 px-4 py-2 rounded-xl' : ''
                  }`}
                  onClick={() => setSelectedEvent(event)}
                  role="button"
                  tabIndex={0}
                >
                  {/* Timeline dot/icon */}
                  <div className={`relative z-10 w-16 h-16 bg-gradient-to-br ${event.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Event content */}
                  <div className="flex-1 bg-slate-800/30 rounded-xl p-4 hover:bg-slate-800/40 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{event.description}</p>
                      </div>
                      <Badge variant={statusInfo.variant} size="small">
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-500 mt-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{event.user}</span>
                      </div>
                    </div>

                    {/* Progress bar for in-progress tasks */}
                    {event.progress && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>Progress</span>
                          <span>{event.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${event.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Attachments */}
                    {event.attachments && event.attachments.length > 0 && (
                      <div className="mt-3 flex items-center space-x-2">
                        <Paperclip className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-400">
                          {event.attachments.length} attachment{event.attachments.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    {/* Days remaining for deadlines */}
                    {event.daysRemaining && (
                      <div className="mt-3">
                        <Badge variant="danger" size="small">
                          {event.daysRemaining} days remaining
                        </Badge>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Selected event details */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
          >
            <h4 className="text-white font-medium mb-2">Event Details</h4>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">{selectedEvent.description}</p>
              {selectedEvent.attachments && (
                <div className="pt-2">
                  <p className="text-slate-400 mb-2">Attachments:</p>
                  <div className="space-y-1">
                    {selectedEvent.attachments.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 cursor-pointer">
                        <FileText className="h-4 w-4" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

export default CaseTimeline