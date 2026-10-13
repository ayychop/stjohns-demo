import { existsSync } from 'node:fs'
import { defineConfig } from 'vite'
import sharp from 'sharp'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Which optional images are present in public/images. The page only asks for
// files that exist, and shows a brand colour block or text wordmark otherwise.
// Checked when the dev server or build starts, so restart after adding a photo.
const path = (file) => new URL(`./public/images/${file}`, import.meta.url)
const has = (file) => existsSync(path(file))

// The logo's proportions, so the page can reserve the right space before it loads.
let logoAspect = null
if (has('logo.png')) {
  const { width, height } = await sharp(path('logo.png').pathname).metadata()
  logoAspect = width / height
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
  define: {
    __IMAGES__: JSON.stringify({
      logo: has('logo.png'),
      logoAspect,
      shopFront: has('shop-front.jpg'),
      aisle: has('aisle.jpg'),
      produce: has('produce.jpg'),
    }),
  },
  build: {
    rollupOptions: {
      input: ['index.html', 'privacy.html', 'terms.html'],
    },
  },
})
