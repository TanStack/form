'use client'

import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'

export function Devtools() {
  return (
    <TanStackDevtools
      plugins={[formDevtoolsPlugin()]}
      config={{
        hideUntilHover: false,
      }}
    />
  )
}
