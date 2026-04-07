import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss()
	],
	build: {
		// Tells Vite to compile down to older JS syntax 
		// so react-snap's headless browser can understand it
		target: 'es2015' 
	}
})