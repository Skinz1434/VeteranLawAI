import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Activity } from 'lucide-react'
import { healthCheck } from '../api/health'

const HealthCheck = () => {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await healthCheck()
      setHealth(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-6 w-6 text-green-400" />
      case 'unhealthy':
        return <XCircle className="h-6 w-6 text-red-400" />
      case 'degraded':
        return <AlertCircle className="h-6 w-6 text-yellow-400" />
      default:
        return <AlertCircle className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'unhealthy':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'degraded':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-cyan-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">System Health Check</h1>
                <p className="text-slate-400">VeteranLawAI Platform Status</p>
              </div>
            </div>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700/70 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Main Status */}
          {loading && !health ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-300">Checking system health...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 font-medium">Health check failed</p>
              <p className="text-slate-400 text-sm mt-2">{error}</p>
            </div>
          ) : health ? (
            <>
              {/* Overall Status */}
              <div className={`rounded-2xl p-6 border ${getStatusColor(health.status)} mb-8`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(health.status)}
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        System Status: {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                      </h2>
                      <p className="text-slate-400 text-sm">Last checked: {new Date(health.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300 text-sm">Version: {health.version}</p>
                    <p className="text-slate-400 text-sm">Environment: {health.environment}</p>
                  </div>
                </div>
              </div>

              {/* Service Checks */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">Service Status</h3>
                
                {Object.entries(health.checks).map(([service, check]) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-700/30 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <h4 className="text-white font-medium capitalize">
                            {service.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {check.error && (
                            <p className="text-red-400 text-sm mt-1">{check.error}</p>
                          )}
                          {check.responseTime && (
                            <p className="text-slate-400 text-sm mt-1">Response time: {check.responseTime}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        check.status === 'healthy' ? 'bg-green-400/20 text-green-400' :
                        check.status === 'unhealthy' ? 'bg-red-400/20 text-red-400' :
                        check.status === 'unconfigured' ? 'bg-gray-400/20 text-gray-400' :
                        'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {check.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-slate-700/20 rounded-xl">
                <p className="text-slate-400 text-sm">
                  This health check endpoint can be used for monitoring and alerting. 
                  Access it programmatically at <code className="text-cyan-400">/api/health</code>
                </p>
              </div>
            </>
          ) : null}
        </motion.div>
      </div>
    </div>
  )
}

export default HealthCheck