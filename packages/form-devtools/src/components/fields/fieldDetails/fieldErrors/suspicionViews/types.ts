import type { JSX } from 'solid-js'

export interface FieldErrorDebugDetails {
  title: JSX.Element
  description: JSX.Element
  commonCase: JSX.Element
  fixes: Array<JSX.Element>
}
