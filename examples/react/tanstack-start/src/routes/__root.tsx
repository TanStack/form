import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'

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
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/emblem-light.svg',
      },
    ],
  }),
  notFoundComponent: () => {
    return <div>Not found</div>
  },
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
        <TanStackDevtools plugins={[formDevtoolsPlugin()]} />
      </body>
    </html>
  )
}
