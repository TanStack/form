'use client'

import * as Devtools from './FormDevtools'

export const FormDevtoolsPanel = Devtools.FormDevtools

export type { FormDevtoolsReactInit } from './FormDevtools'

export function formDevtoolsPlugin() {
  return {
    name: 'TanStack Form',
    render: (_el: HTMLElement, theme: 'light' | 'dark') => {
      return <FormDevtoolsPanel theme={theme} />
    },
  }
}
