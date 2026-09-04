import { useEffect, useRef } from 'react'
import { FormDevtoolsCore } from '@tanstack/form-devtools'

import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'

export interface FormDevtoolsReactInit extends DevtoolsPanelProps {}

/**
 * Fixed React panel wrapper for FormDevtoolsCore.
 *
 * Root cause of #2357 ("devtools are always light mode even if TanStackDevtools says dark"):
 * The original createReactPanel hook only calls mount() once on the Solid FormDevtoolsCore
 * class. When TanStack DevTools outer shell switches theme, it calls
 * plugin.render(el, newTheme) which creates a new React element — but mount() is never
 * called again. The Solid component receives props.theme as a plain (non-reactive) value
 * and never re-renders.
 *
 * Fix: track the previous theme in a ref. The effect dependency is [theme] only — it
 * fires only when the theme value changes, never on unrelated prop changes. The ref
 * guards against the initial mount where prevThemeRef.current is undefined (matching
 * an undefined theme on first render). Cleanup unmounts the old Solid instance before
 * the next mount with the updated props.
 */
function FormDevtoolsPanel(props: DevtoolsPanelProps) {
  const devToolRef = useRef<HTMLDivElement>(null)
  const devtools = useRef<InstanceType<typeof FormDevtoolsCore> | null>(null)
  const prevThemeRef = useRef<string | undefined>(undefined)

  // theme is passed by TanStack DevTools outer shell via props.
  // We use type assertion because @tanstack/devtools types are not available
  // as a direct dependency of this package.
  const theme = (props as { theme?: string }).theme

  useEffect(() => {
    // Guard: skip if theme hasn't actually changed (ref was already updated
    // in the prior effect run, or this is the very first render with undefined).
    if (theme === prevThemeRef.current) return
    prevThemeRef.current = theme

    if (!devToolRef.current) return

    devtools.current?.unmount()
    devtools.current = new FormDevtoolsCore()
    devtools.current.mount(devToolRef.current, props)
  }, [theme]) // NOTE: intentionally omits `props` — props changes on every render
  // (object identity); the ref guard above handles theme-change detection.

  return <div style={{ height: '100%' }} ref={devToolRef} />
}

function FormDevtoolsPanelNoOp(_props: DevtoolsPanelProps) {
  return null as unknown as React.ReactElement
}

export { FormDevtoolsPanel, FormDevtoolsPanelNoOp }
