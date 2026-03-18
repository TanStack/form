import { ThemeContextProvider } from '@tanstack/devtools-ui'

import { FormEventClientProvider } from '../contexts/eventClientContext'
import { Shell } from './Shell'

import type { TanStackDevtoolsTheme } from '@tanstack/devtools-ui'

interface DevtoolsProps {
  theme: TanStackDevtoolsTheme
}

export default function Devtools(props: DevtoolsProps) {
  return (
    <ThemeContextProvider theme={props.theme}>
      <FormEventClientProvider>
        <Shell />
      </FormEventClientProvider>
    </ThemeContextProvider>
  )
}
