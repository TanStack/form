import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { z } from 'zod'

export default function App() {
  return (
    <div className="items-center justify-center bg-red-500 h-full w-full"></div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(<App />)
