import { FormDevtoolsCore } from '@tanstack/form-devtools'
import { useEffect, useRef, useState } from 'react'

interface FormDevtoolsReactProps {
  theme?: 'light' | 'dark'
}

export const FormDevtools = (props?: FormDevtoolsReactProps) => {
  const devToolRef = useRef<HTMLDivElement>(null)
  const [devtools] = useState(() => new FormDevtoolsCore({}))

  useEffect(() => {
    if (devToolRef.current) {
      devtools.mount(devToolRef.current, props?.theme ?? 'dark')
    }

    return () => devtools.unmount()
  }, [devtools, props?.theme])

  return <div style={{ height: '100%' }} ref={devToolRef} />
}
