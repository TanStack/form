import { TanstackFormDevtoolsPanel } from '@tanstack/form-devtools'
import { useEffect, useRef, useState } from 'react'

export function FormDevtools(): React.ReactElement | null {
  const [devtools] = useState(new TanstackFormDevtoolsPanel())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      devtools.mount(ref.current)
    }

    return () => {
      devtools.unmount()
    }
  }, [devtools])

  return <div ref={ref}></div>
}
