import '../styles/index.css'
import { MainPanel, ThemeContextProvider } from '@tanstack/devtools-ui'
import { PortalProvider } from './ui/portal'
import { TooltipProvider } from './ui/tooltip'
import { Header } from './Header'
import type {
  TanStackDevtoolsPluginProps,
  TanStackDevtoolsTheme,
} from '@tanstack/devtools'
import type { FormDevtoolsInit } from '../core'
import type { ParentProps } from 'solid-js'
import { FormSelectorProvider } from '@/contexts/formSelectorContext'

function ContextWrappers(
  props: ParentProps & { theme: TanStackDevtoolsTheme },
) {
  return (
    <ThemeContextProvider theme={props.theme}>
      <TooltipProvider openDelay={0} interactive>
        <FormSelectorProvider>{props.children}</FormSelectorProvider>
      </TooltipProvider>
    </ThemeContextProvider>
  )
}

type DevtoolsProps = TanStackDevtoolsPluginProps & FormDevtoolsInit

export default function Shell(props: DevtoolsProps) {
  return (
    <ContextWrappers theme={props.theme}>
      <MainPanel>
        <PortalProvider
          class="tanstack-form-devtools w-full h-full"
          data-theme={props.theme}
        >
          <Header adapterName={props.adapterName} />
        </PortalProvider>
      </MainPanel>
    </ContextWrappers>
  )
}
