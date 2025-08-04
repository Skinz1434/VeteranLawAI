// Health check endpoint for deployment monitoring
export const healthCheck = async () => {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
    checks: {
      api: await checkAPIConnection(),
      auth: await checkAuthService(),
      storage: await checkStorageAccess(),
      ocr: await checkOCRService()
    }
  }

  const allHealthy = Object.values(checks.checks).every(check => check.status === 'healthy')
  checks.status = allHealthy ? 'healthy' : 'degraded'

  return checks
}

// Check API connection
async function checkAPIConnection() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      responseTime: response.headers.get('X-Response-Time') || 'N/A'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    }
  }
}

// Check authentication service
async function checkAuthService() {
  try {
    const authDomain = import.meta.env.VITE_AUTH_DOMAIN
    if (!authDomain) {
      return { status: 'unconfigured' }
    }
    
    // Simple connectivity check
    const response = await fetch(`https://${authDomain}/.well-known/openid-configuration`, {
      method: 'HEAD'
    })
    
    return {
      status: response.ok ? 'healthy' : 'unhealthy'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    }
  }
}

// Check storage access
async function checkStorageAccess() {
  try {
    const testKey = 'health-check-' + Date.now()
    localStorage.setItem(testKey, 'test')
    const value = localStorage.getItem(testKey)
    localStorage.removeItem(testKey)
    
    return {
      status: value === 'test' ? 'healthy' : 'unhealthy'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: 'LocalStorage not accessible'
    }
  }
}

// Check OCR service
async function checkOCRService() {
  try {
    const ocrEndpoint = import.meta.env.VITE_OCR_API_ENDPOINT
    if (!ocrEndpoint) {
      return { status: 'unconfigured' }
    }
    
    const response = await fetch(`${ocrEndpoint}/health`, {
      method: 'GET',
      headers: {
        'X-API-Key': import.meta.env.VITE_OCR_API_KEY || ''
      }
    })
    
    return {
      status: response.ok ? 'healthy' : 'unhealthy'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    }
  }
}

export default healthCheck