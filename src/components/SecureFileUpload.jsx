import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, FileText, Image, Lock, Shield, CheckCircle, 
  XCircle, AlertCircle, Download, Trash2, Eye, X
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

const SecureFileUpload = ({ 
  onUpload, 
  maxFiles = 10, 
  maxSizeInMB = 25,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
}) => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return Image
    return FileText
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const validateFile = (file) => {
    const errors = []
    
    // Check file size
    if (file.size > maxSizeInBytes) {
      errors.push(`File size exceeds ${maxSizeInMB}MB limit`)
    }
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      errors.push(`File type ${fileExtension} not accepted`)
    }
    
    return errors
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => {
      const errors = validateFile(file)
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: errors.length > 0 ? 'error' : 'pending',
        errors,
        progress: 0,
        encrypted: false
      }
    })
    
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }
    
    setFiles(prev => [...prev, ...newFiles])
  }

  const uploadFile = async (fileObj) => {
    // Simulate encryption
    setFiles(prev => prev.map(f => 
      f.id === fileObj.id ? { ...f, status: 'encrypting' } : f
    ))
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setFiles(prev => prev.map(f => 
      f.id === fileObj.id ? { ...f, encrypted: true, status: 'uploading' } : f
    ))
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, progress: i } : f
      ))
    }
    
    setFiles(prev => prev.map(f => 
      f.id === fileObj.id ? { ...f, status: 'completed' } : f
    ))
    
    if (onUpload) {
      onUpload(fileObj)
    }
  }

  const uploadAllFiles = async () => {
    setUploading(true)
    const pendingFiles = files.filter(f => f.status === 'pending')
    
    for (const file of pendingFiles) {
      await uploadFile(file)
    }
    
    setUploading(false)
  }

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'encrypting':
      case 'uploading':
        return <Shield className="h-5 w-5 text-cyan-400 animate-pulse" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      completed: { variant: 'success', label: 'Uploaded' },
      error: { variant: 'danger', label: 'Error' },
      encrypting: { variant: 'primary', label: 'Encrypting' },
      uploading: { variant: 'warning', label: 'Uploading' },
      pending: { variant: 'secondary', label: 'Pending' }
    }
    return variants[status] || { variant: 'default', label: status }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Secure Document Upload</CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              All files are encrypted with AES-256 before upload
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-green-400" />
            <span className="text-sm text-green-400 font-medium">256-bit Encryption</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-cyan-500 bg-cyan-500/10' 
              : 'border-slate-600 hover:border-slate-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleChange}
            className="hidden"
          />
          
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Drop files here or click to upload
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Maximum {maxFiles} files, up to {maxSizeInMB}MB each
          </p>
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            icon={Upload}
          >
            Select Files
          </Button>
          
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-slate-500">
            <span>Accepted formats:</span>
            <span className="font-mono">{acceptedTypes.join(', ')}</span>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">
                Files ({files.length}/{maxFiles})
              </h3>
              <Button
                variant="primary"
                size="small"
                onClick={uploadAllFiles}
                disabled={uploading || files.every(f => f.status !== 'pending')}
                loading={uploading}
              >
                Upload All
              </Button>
            </div>
            
            <div className="space-y-3">
              {files.map((fileObj) => {
                const Icon = getFileIcon(fileObj.type)
                const statusInfo = getStatusBadge(fileObj.status)
                
                return (
                  <motion.div
                    key={fileObj.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-slate-800/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Icon className="h-8 w-8 text-slate-400" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-white font-medium truncate max-w-xs">
                              {fileObj.name}
                            </h4>
                            {fileObj.encrypted && (
                              <Lock className="h-4 w-4 text-green-400" />
                            )}
                          </div>
                          <p className="text-sm text-slate-400">
                            {formatFileSize(fileObj.size)}
                          </p>
                          {fileObj.errors.length > 0 && (
                            <p className="text-sm text-red-400 mt-1">
                              {fileObj.errors[0]}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge {...statusInfo} size="small" />
                        {getStatusIcon(fileObj.status)}
                        
                        <div className="flex items-center space-x-1">
                          {fileObj.status === 'completed' && (
                            <>
                              <button className="p-1 hover:bg-slate-700/50 rounded transition-colors">
                                <Eye className="h-4 w-4 text-slate-400" />
                              </button>
                              <button className="p-1 hover:bg-slate-700/50 rounded transition-colors">
                                <Download className="h-4 w-4 text-slate-400" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => removeFile(fileObj.id)}
                            className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {(fileObj.status === 'uploading' || fileObj.status === 'encrypting') && (
                      <div className="mt-3">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${fileObj.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Security Info */}
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-green-400 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-green-400 mb-1">Bank-Level Security</p>
              <p>All documents are encrypted using AES-256 encryption before upload. Your files are protected with the same security standards used by financial institutions.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SecureFileUpload