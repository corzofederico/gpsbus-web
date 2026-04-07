import { createRoot, hydrateRoot } from 'react-dom/client'
import './globals.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!!

// Production: If the prerender plugin already put HTML inside the root, hydrate it.
if (rootElement.hasChildNodes()) {
	hydrateRoot(rootElement, <App />)
} 
// Development: The root is empty during 'npm run dev', so render it normally.
else {
	createRoot(rootElement).render(<App />)
}