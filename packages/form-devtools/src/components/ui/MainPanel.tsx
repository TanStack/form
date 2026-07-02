import './index.css'
import { MainPanel as UIPanel } from '@tanstack/devtools-ui'
import type { TanStackDevtoolsPluginProps } from '@tanstack/devtools'
import type { JSXElement } from 'solid-js'
import { cn } from '@/lib/utils'

interface FormDevtoolsWrapperProps extends TanStackDevtoolsPluginProps {
  children: JSXElement
  class?: string
}

export function MainPanel(props: FormDevtoolsWrapperProps) {
  return (
    <UIPanel
      class={cn('tanstack-form-devtools', props.class)}
      data-theme={props.theme}
    >
      {props.children}
    </UIPanel>
  )
}
