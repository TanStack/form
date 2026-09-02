import type { FunctionComponent } from 'react'

/**
 * A recursively nested collection of components registered with
 * `createFormHook`.
 *
 * Component trees are inferred from `fieldComponents` and `formComponents` in
 * normal usage. This type is primarily useful when building wrappers around
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

export interface ReactFormComponentMap<
  in out TFormComponents extends ReactComponentTree,
  in out TFieldComponents extends ReactComponentTree,
> {
  /** Components and component namespaces exposed on each App Form API. */
  formComponents: TFormComponents
  /** Components and component namespaces exposed on each App Field API. */
  fieldComponents: TFieldComponents
}

export type AnyReactFormComponentMap = ReactFormComponentMap<
  ReactComponentTree,
  ReactComponentTree
>

export type DefaultReactFormComponentMap = ReactFormComponentMap<
  Record<never, never>,
  Record<never, never>
>
