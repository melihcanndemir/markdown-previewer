import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("Fatal Error: 'root' element not found in the DOM.")
}

const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
