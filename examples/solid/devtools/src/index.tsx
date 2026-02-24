// lib
import { render } from 'solid-js/web'

import { TanStackDevtools } from '@tanstack/solid-devtools'
import { formDevtoolsPlugin } from '@tanstack/solid-form-devtools'

// components
import App from './app'

const root = document.getElementById('root')

render(
  () => (
    <>
      <App />

      <TanStackDevtools plugins={[formDevtoolsPlugin()]} />
    </>
  ),
  root!,
)
