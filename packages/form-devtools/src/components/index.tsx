import '../styles/index.css'
import { ThemeContextProvider } from '@tanstack/devtools-ui'
import { TooltipProvider } from './ui/tooltip'
import { Shell } from './Shell'
import type { TanStackDevtoolsPluginProps } from '@tanstack/devtools'
import type { FormDevtoolsInit } from '../core'
import type { JSX } from 'solid-js'
import { FormDevtoolsStoreProvider } from '@/stores/formDevtoolsStore'

const wrapperStyle: JSX.CSSProperties = {
  height: '100%',
  width: '100%',
  'overflow-y': 'hidden',
  'overflow-x': 'hidden',
  position: 'relative',
}

type DevtoolsProps = TanStackDevtoolsPluginProps & FormDevtoolsInit

function FormDevtoolsContent(props: DevtoolsProps) {
  return (
    <ThemeContextProvider theme={props.theme}>
      <TooltipProvider openDelay={0} interactive>
        <div
          class="tanstack-form-devtools"
          data-theme={props.theme}
          style={wrapperStyle}
        >
          <Shell adapterName={props.adapterName} theme={props.theme} />
        </div>
      </TooltipProvider>
    </ThemeContextProvider>
  )
}

export default function App(props: DevtoolsProps) {
  return (
    <FormDevtoolsStoreProvider>
      <FormDevtoolsContent {...props} />
    </FormDevtoolsStoreProvider>
  )
}
