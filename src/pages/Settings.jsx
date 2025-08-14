import React from 'react'
import { Settings as SettingsIcon, User, Bell, Shield, Database, Globe, Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

const Settings = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
              <p className="text-slate-400">Configure your preferences and account settings</p>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-4">
              <User className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            <div className="space-y-3">
              {['Email notifications', 'Push notifications', 'Case updates', 'System alerts'].map((item) => (
                <label key={item} className="flex items-center justify-between">
                  <span className="text-slate-300">{item}</span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 bg-slate-900 border-slate-600 text-cyan-500 rounded focus:ring-cyan-500"
                    defaultChecked
                  />
                </label>
              ))}
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
            </div>
            <div className="space-y-3">
              {['Two-factor authentication', 'Session timeout', 'Data encryption', 'Activity logging'].map((item) => (
                <label key={item} className="flex items-center justify-between">
                  <span className="text-slate-300">{item}</span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 bg-slate-900 border-slate-600 text-cyan-500 rounded focus:ring-cyan-500"
                    defaultChecked
                  />
                </label>
              ))}
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Data Management</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors">
                Export Data
              </button>
              <button className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors">
                Clear Cache
              </button>
              <button className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-end"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300">
            Save Changes
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings