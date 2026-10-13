import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/inter'
import './index.css'
import App from './App.jsx'
import { PRELOADER_MS } from './shop.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Hold the preloader for its beat, fade it out, then take it out of the page.
const preloader = document.getElementById('preloader')
if (preloader) {
  setTimeout(() => {
    preloader.classList.add('done')
    setTimeout(() => preloader.remove(), 600)
  }, PRELOADER_MS)
}
