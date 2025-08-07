import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import OcrPage from './pages/Ocr'
import TranscribePage from './pages/Transcribe'
import KbPage from './pages/Kb'
import WizardPage from './pages/Wizard'
import AnalyticsPage from './pages/Analytics'
import AgentConsole from './pages/AgentConsole'
import './styles/tokens.css'

const router = createBrowserRouter([
  { path: '/', element: <AppShell><Dashboard/></AppShell> },
  { path: '/ocr', element: <AppShell><OcrPage/></AppShell> },
  { path: '/transcribe', element: <AppShell><TranscribePage/></AppShell> },
  { path: '/kb', element: <AppShell><KbPage/></AppShell> },
  { path: '/wizard', element: <AppShell><WizardPage/></AppShell> },
  { path: '/analytics', element: <AppShell><AnalyticsPage/></AppShell> },
  { path: '/agent', element: <AppShell><AgentConsole/></AppShell> },
])

async function startMsw(){
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
}
startMsw().then(()=>{
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
})
