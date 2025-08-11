import React, { useState } from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'

const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helper,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative gradient-outline rounded-xl">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-slate-800/60 backdrop-blur-sm
            border border-slate-700/30
            text-white placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300 ease-smooth
            ${Icon ? 'pl-11' : ''}
            ${type === 'password' ? 'pr-11' : ''}
            ${error ? 'border-red-500/50 focus:ring-red-500/40 focus:border-red-500/40' : ''}
          `.trim()}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-slate-500">{helper}</p>
      )}
    </div>
  )
})

export const SearchInput = React.forwardRef(({ 
  placeholder = 'Search...', 
  className = '', 
  ...props 
}, ref) => (
  <Input
    ref={ref}
    type="search"
    icon={Search}
    placeholder={placeholder}
    className={className}
    {...props}
  />
))

export const Textarea = React.forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  error,
  helper,
  rows = 4,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-slate-800/50 backdrop-blur-sm
          border border-slate-700/50
          text-white placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-300
          resize-none
          ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : ''}
        `.trim()}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-slate-500">{helper}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
SearchInput.displayName = 'SearchInput'
Textarea.displayName = 'Textarea'

export default Input