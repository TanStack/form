import '../styles/index.css'
import { Header, MainPanel, ThemeContextProvider } from '@tanstack/devtools-ui'
import { InfoIcon } from 'lucide-solid'
import { FormLogo } from './FormLogo'
import { FormSelector } from './FormSelector'
import { PortalProvider } from './ui/portal'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { Button } from './ui/button'
import { Code } from './ui/code'
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
          <Header>
            <FormLogo adapterName={props.adapterName} />
            <FormSelector class="ms-5" />
            <Tooltip>
              <TooltipTrigger
                asChild={(props) => (
                  <Button
                    variant="ghost"
                    {...props({ class: 'icon-sm me-auto' })}
                  >
                    <InfoIcon />
                  </Button>
                )}
              />
              <TooltipContent class="text-center">
                <span>
                  Form names looking a bit cryptic?
                  <br /> Add a <Code>formId</Code> option to give it a clearer
                  name.
                </span>
              </TooltipContent>
            </Tooltip>
          </Header>
        </PortalProvider>
      </MainPanel>
    </ContextWrappers>
  )
}
