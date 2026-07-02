import '@/styles/index.css'
import { MainPanel as UIPanel } from '@tanstack/devtools-ui'
import type { TanStackDevtoolsPluginProps } from '@tanstack/devtools'
import type { JSXElement } from 'solid-js'
import type { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'

interface FormDevtoolsWrapperProps extends TanStackDevtoolsPluginProps {
  children: JSXElement
  class?: ClassValue
}

export function MainPanel(props: FormDevtoolsWrapperProps) {
  return (
    <UIPanel>
      <div
        class={cn('tanstack-form-devtools w-full h-full', props.class)}
        data-theme={props.theme}
      >
        {props.children}
      </div>
    </UIPanel>
  )
}
