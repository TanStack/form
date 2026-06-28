import type { TanStackDevtoolsPluginProps } from '@tanstack/devtools'
import type { JSX } from 'react'
// TODO
// Type errors show up regarding portability. We should fix this, it's ugly.
export type ReactFormDevtoolsPlugin = () => {
  name: string
  id?: string
  defaultOpen?: boolean
  render: (el: HTMLElement, props: TanStackDevtoolsPluginProps) => JSX.Element
}
