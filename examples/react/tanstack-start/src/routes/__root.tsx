import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtoolsPlugin } from '@tanstack/react-form-devtools'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Form + Start',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>

      <TanStackDevtools plugins={[FormDevtoolsPlugin()]} />
    </html>
  )
}
