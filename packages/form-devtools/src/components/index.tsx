import { FormEventClientProvider } from '../contexts/eventClientContext'
import Content from './content'

export function Devtools() {
  return (
    <FormEventClientProvider>
      <Content />
    </FormEventClientProvider>
  )
}
