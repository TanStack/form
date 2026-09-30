import { createRoot } from 'octane'
import App from './App.tsrx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(App)
