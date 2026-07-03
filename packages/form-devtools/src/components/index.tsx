import '../styles/index.css'
import { MainPanel, ThemeContextProvider } from '@tanstack/devtools-ui'
import { PortalProvider } from './ui/portal'
import { TooltipProvider } from './ui/tooltip'
import { Shell } from './Shell'
import type { TanStackDevtoolsPluginProps } from '@tanstack/devtools'
import type { FormDevtoolsInit } from '../core'
import { FormSelectorProvider } from '@/contexts/formSelectorContext'

type DevtoolsProps = TanStackDevtoolsPluginProps & FormDevtoolsInit

export default function App(props: DevtoolsProps) {
  return (
    <ThemeContextProvider theme={props.theme}>
      <TooltipProvider openDelay={0} interactive>
        <FormSelectorProvider>
          <MainPanel>
            <PortalProvider
              class="tanstack-form-devtools w-full h-full"
              data-theme={props.theme}
            >
              <Shell adapterName={props.adapterName} />
            </PortalProvider>
          </MainPanel>
        </FormSelectorProvider>
      </TooltipProvider>
    </ThemeContextProvider>
  )
}
