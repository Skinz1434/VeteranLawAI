import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Check if root element exists
const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="color: white; padding: 20px; background: #1e293b;">Error: Root element not found!</div>'
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Failed to render app:', error)
    rootElement.innerHTML = `<div style="color: white; padding: 20px; background: #1e293b;">
      <h1>Failed to load application</h1>
      <pre>${error.toString()}</pre>
    </div>`
  }
}
