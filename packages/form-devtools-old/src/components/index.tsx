import { ThemeContextProvider } from '@tanstack/devtools-ui'
import { FormEventClientProvider } from '../contexts/eventClientContext'
import { Shell } from './Shell'
import { MainPanel } from './MainPanel'
import type { TanStackDevtoolsPluginProps } from '@tanstack/devtools'
import type { FormDevtoolsInit } from '../core'

type DevtoolsProps = TanStackDevtoolsPluginProps & FormDevtoolsInit

export default function Devtools(props: DevtoolsProps) {
  return (
    <ThemeContextProvider theme={props.theme}>
      <FormEventClientProvider>
        <MainPanel theme={props.theme} devtoolsOpen={props.devtoolsOpen}>
          <Shell adapterName={props.adapterName} />
        </MainPanel>
      </FormEventClientProvider>
    </ThemeContextProvider>
  )
}
