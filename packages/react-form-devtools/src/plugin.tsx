import { FormDevtools } from './index'

export function FormDevtoolsPlugin() {
  return {
    name: 'TanStack Form',
    render: (_el: HTMLElement, theme: 'light' | 'dark') => {
      return <FormDevtools theme={theme} />
    },
  }
}
