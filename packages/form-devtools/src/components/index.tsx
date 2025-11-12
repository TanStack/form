import { FormEventClientProvider } from '../contexts/eventClientContext'
import { Shell } from './Shell'

export default function Devtools() {
  return (
    <FormEventClientProvider>
      <Shell />
    </FormEventClientProvider>
  )
}
