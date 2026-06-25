import { ThemeContextProvider } from '@tanstack/devtools-ui'
import { FormEventClientProvider } from '../contexts/eventClientContext'
import { Shell } from './Shell'
import type { TanStackDevtoolsPluginProps } from '@tanstack/devtools'
import type { FormDevtoolsInit } from '../core'

type DevtoolsProps = TanStackDevtoolsPluginProps & FormDevtoolsInit

export default function Devtools(props: DevtoolsProps) {
  return (
    <ThemeContextProvider theme={props.theme}>
      <FormEventClientProvider>
        <Shell adapterName={props.adapterName} />
      </FormEventClientProvider>
    </ThemeContextProvider>
  )
}
