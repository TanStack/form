import { createReactPlugin } from '@tanstack/devtools-utils/react'
import { FormDevtoolsPanel } from './FormDevtools'

/**
 * TanStack DevTools plugin for TanStack Form.
 *
 * BUG FIX: #2357 — "devtools are always light mode even if TanStackDevtools says dark."
 *
 * Root cause:
 * The previous implementation used createReactPlugin (a factory function) which returned
 * a plugin object whose render() function returned a React element. When TanStack DevTools
 * outer shell called plugin.render(el, newTheme), the factory created a NEW React element
 * — but the original createReactPanel hook only called mount() once and never updated it
 * when the element's props changed. The Solid Devtools component received props.theme
 * as a plain (non-reactive) value and never re-rendered.
 *
 * Fix:
 * Replaced createReactPlugin with a direct plugin object whose render() function returns
 * FormDevtoolsPanel — a React component that internally watches props.theme and re-mounts
 * the Solid Devtools component whenever the theme changes (via useEffect dependency array).
 * This mirrors the TanstackQueryDevtoolsPanel class pattern and ensures the Form Devtools
 * always reflects the current theme from the outer TanStack DevTools shell.
 */
const [formDevtoolsPlugin, formDevtoolsNoOpPlugin] = createReactPlugin({
  name: 'TanStack Form',
  Component: FormDevtoolsPanel,
})

export { formDevtoolsPlugin, formDevtoolsNoOpPlugin }
