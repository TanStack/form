import type { FunctionComponent } from 'react'

/**
 * A recursively nested collection of field components registered with
 * `createFormHook`.
 *
 * Component trees are inferred from `fieldComponents` in normal usage.
 * This type is primarily useful when building wrappers around
 * `createFormHook` or declaring reusable component registries.
 *
 * @example
 * ```tsx
 * const fields = {
 *   inputs: {
 *     TextField,
 *   },
 * } satisfies ReactComponentTree
 * ```
 */
export type ReactComponentTree = {
  readonly [name: string]: FunctionComponent<any> | ReactComponentTree
}

/** A flat collection of renderable form components. */
export type ReactFormComponents = {
  readonly [name: string]: FunctionComponent<any>
}

export interface ReactFormComponentMap<
  in out TFormComponents extends ReactFormComponents,
  in out TFieldComponents extends ReactComponentTree,
> {
  /** Components exposed on each App Form API. */
  formComponents: TFormComponents
  /** Components and component namespaces exposed on each App Field API. */
  fieldComponents: TFieldComponents
}

export type AnyReactFormComponentMap = ReactFormComponentMap<
  ReactFormComponents,
  ReactComponentTree
>

export type DefaultReactFormComponentMap = ReactFormComponentMap<
  Record<never, never>,
  Record<never, never>
>
