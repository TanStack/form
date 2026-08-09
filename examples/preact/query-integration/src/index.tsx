import { render } from 'preact'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './app'
import type { ComponentChildren, FunctionComponent } from 'preact'

const rootElement = document.getElementById('root')!

const queryClient = new QueryClient()
const PreactQueryClientProvider =
  QueryClientProvider as unknown as FunctionComponent<{
    children: ComponentChildren
    client: QueryClient
  }>

render(
  <PreactQueryClientProvider client={queryClient}>
    <App />
  </PreactQueryClientProvider>,
  rootElement,
)
