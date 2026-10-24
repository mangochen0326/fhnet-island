import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { runtime } from './scene/runtime'
import { useGame } from './store/useGame'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Read-only handle for end-to-end tests and debugging in the browser console.
Object.assign(window, { __fhnetIsland: { runtime, useGame } })
