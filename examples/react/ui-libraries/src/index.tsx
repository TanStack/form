import { createRoot } from 'react-dom/client'
import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import MainComponent from './MainComponent'
import React from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainComponent />
    </ThemeProvider>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
