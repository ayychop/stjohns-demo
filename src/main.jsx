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

// Hold the loading screen for its minimum time, fade it out, then take it out of the page.
const preloader = document.getElementById('preloader')
if (preloader) {
  setTimeout(() => {
    preloader.classList.add('done')
    // The fade takes 0.6s; remove the element just after it finishes.
    setTimeout(() => preloader.remove(), 700)
  }, PRELOADER_MS)
}
