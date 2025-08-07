import { FormEventClientProvider } from '../contexts/eventClientContext'

import { Shell } from './Shell'

export function Devtools() {
  return (
    <FormEventClientProvider>
      <Shell />
    </FormEventClientProvider>
  )
}
