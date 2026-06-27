/* @refresh reload */
import { render } from '@solidjs/web'
import { WizardPage } from './features/wizard/page.tsx'

function App() {
  return <WizardPage />
}

const root = document.getElementById('root')

render(() => <App />, root!)
