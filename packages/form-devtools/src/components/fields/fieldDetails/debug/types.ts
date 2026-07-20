import type { JSX } from 'solid-js'

export interface DebugDetails {
  title: JSX.Element
  description: JSX.Element
  commonCase: JSX.Element
  fixes: Array<JSX.Element>
}

export type EvaluatedDebugDetails<TKind extends string> = DebugDetails & {
  kind: TKind
}
