import { FormDevtoolsCore } from '@tanstack/form-devtools'
import { useEffect, useRef, useState } from 'react'

export interface FormDevtoolsReactInit {
  theme?: 'light' | 'dark'
}

export const FormDevtools = (props?: FormDevtoolsReactInit) => {
  const devToolRef = useRef<HTMLDivElement>(null)
  const [devtools] = useState(() => new FormDevtoolsCore({}))

  useEffect(() => {
    if (devToolRef.current) {
      devtools.mount(devToolRef.current, props?.theme ?? 'dark')
    }

    return () => devtools.unmount()
  }, [devtools, props?.theme])

  if (import.meta.env.SSR) return null

  return <div style={{ height: '100%' }} ref={devToolRef} />
}
