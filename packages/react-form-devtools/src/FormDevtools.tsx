import { useEffect, useRef } from 'react'

import type { FormDevtoolsCore } from '@tanstack/form-devtools'

export interface FormDevtoolsReactInit {
  theme?: 'light' | 'dark'
}

export const FormDevtools = (props?: FormDevtoolsReactInit) => {
  const devToolRef = useRef<HTMLDivElement>(null)
  const devtools = useRef<InstanceType<typeof FormDevtoolsCore> | null>(null)

  useEffect(() => {
    if (devtools.current) return

    import('@tanstack/form-devtools').then(({ FormDevtoolsCore }) => {
      devtools.current = new FormDevtoolsCore()

      if (devToolRef.current) {
        devtools.current.mount(devToolRef.current, props?.theme ?? 'dark')
      }
    })

    return () => {
      devtools.current?.unmount()
    }
  }, [props?.theme])

  return <div style={{ height: '100%' }} ref={devToolRef} />
}
