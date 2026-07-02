import '../styles/index.css'
import { Header, MainPanel, ThemeContextProvider } from '@tanstack/devtools-ui'
import { FormLogo } from './FormLogo'
import { FormSelector } from './FormSelector'
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
      <FormSelectorProvider>{props.children}</FormSelectorProvider>
    </ThemeContextProvider>
  )
}

type DevtoolsProps = TanStackDevtoolsPluginProps & FormDevtoolsInit

export default function Shell(props: DevtoolsProps) {
  return (
    <ContextWrappers theme={props.theme}>
      <MainPanel>
        <div
          class="tanstack-form-devtools w-full h-full"
          data-theme={props.theme}
        >
          <Header>
            <FormLogo adapterName={props.adapterName} />
            <FormSelector />
          </Header>
        </div>
      </MainPanel>
    </ContextWrappers>
  )
}
