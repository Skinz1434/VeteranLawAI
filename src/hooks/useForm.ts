import { useState, useCallback, useMemo } from 'react'

interface ValidationRule<T = any> {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T) => string | null
  message?: string
}

interface FieldConfig {
  [key: string]: ValidationRule
}

interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

interface FormActions<T> {
  setValue: (field: keyof T, value: any) => void
  setValues: (values: Partial<T>) => void
  setFieldError: (field: keyof T, error: string | null) => void
  setFieldTouched: (field: keyof T, touched: boolean) => void
  validateField: (field: keyof T) => boolean
  validateForm: () => boolean
  resetForm: () => void
  resetField: (field: keyof T) => void
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e?: React.FormEvent) => Promise<void>
}

type UseFormReturn<T> = FormState<T> & FormActions<T>

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: FieldConfig
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation function
  const validateField = useCallback((field: keyof T): boolean => {
    const value = values[field]
    const rules = validationRules?.[field as string]
    
    if (!rules) return true

    let error: string | null = null

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      error = rules.message || `${String(field)} is required`
    }
    
    // String length validations
    else if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        error = rules.message || `${String(field)} must be at least ${rules.minLength} characters`
      } else if (rules.maxLength && value.length > rules.maxLength) {
        error = rules.message || `${String(field)} must be no more than ${rules.maxLength} characters`
      }
    }
    
    // Pattern validation
    if (!error && rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      error = rules.message || `${String(field)} format is invalid`
    }
    
    // Custom validation
    if (!error && rules.custom) {
      error = rules.custom(value)
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }))

    return !error
  }, [values, validationRules])

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    if (!validationRules) return true

    let isFormValid = true
    const newErrors: Partial<Record<keyof T, string>> = {}

    Object.keys(validationRules).forEach(field => {
      const fieldKey = field as keyof T
      if (!validateField(fieldKey)) {
        isFormValid = false
      }
    })

    return isFormValid
  }, [validateField, validationRules])

  // Computed values
  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error)
  }, [errors])

  const isDirty = useMemo(() => {
    return Object.keys(values).some(key => 
      values[key as keyof T] !== initialValues[key as keyof T]
    )
  }, [values, initialValues])

  // Actions
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Validate field if it's been touched
    if (touched[field]) {
      setTimeout(() => validateField(field), 0)
    }
  }, [touched, validateField])

  const setFieldValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }))
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }))
    
    // Validate when field is touched
    if (isTouched) {
      setTimeout(() => validateField(field), 0)
    }
  }, [validateField])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const resetField = useCallback((field: keyof T) => {
    setValue(field, initialValues[field])
    setFieldError(field, null)
    setFieldTouched(field, false)
  }, [initialValues, setValue, setFieldError, setFieldTouched])

  const handleSubmit = useCallback((
    onSubmit: (values: T) => void | Promise<void>
  ) => {
    return async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      setIsSubmitting(true)

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {} as Record<keyof T, boolean>)
      setTouched(allTouched)

      // Validate form
      const isFormValid = validateForm()

      if (isFormValid) {
        try {
          await onSubmit(values)
        } catch (error) {
          console.error('Form submission error:', error)
        }
      }

      setIsSubmitting(false)
    }
  }, [values, validateForm])

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    
    // Actions
    setValue,
    setValues: setFieldValues,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    resetField,
    handleSubmit
  }
}

// Specific hook for VA form data
export function useVAForm(initialData: any) {
  const validationRules: FieldConfig = {
    'veteran.firstName': {
      required: true,
      minLength: 2,
      message: 'First name is required and must be at least 2 characters'
    },
    'veteran.lastName': {
      required: true,
      minLength: 2,
      message: 'Last name is required and must be at least 2 characters'
    },
    'veteran.ssn': {
      required: true,
      pattern: /^\d{3}-\d{2}-\d{4}$/,
      message: 'SSN must be in format XXX-XX-XXXX'
    },
    'veteran.email': {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    'military.branch': {
      required: true,
      message: 'Military branch is required'
    }
  }

  return useForm(initialData, validationRules)
}

// Hook for field-level helpers
export function useFieldHelpers<T>(
  field: keyof T,
  form: UseFormReturn<T>
) {
  const { values, errors, touched, setValue, setFieldTouched } = form

  return {
    value: values[field],
    error: touched[field] ? errors[field] : undefined,
    hasError: touched[field] && !!errors[field],
    
    onChange: (value: any) => setValue(field, value),
    onBlur: () => setFieldTouched(field, true),
    
    // For React elements
    inputProps: {
      value: values[field] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(field, e.target.value),
      onBlur: () => setFieldTouched(field, true)
    }
  }
}