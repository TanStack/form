import type { FieldApiOptions } from './FieldApi/FieldApi.public'
import type { FormOptions } from './FormApi/FormApi.public'
import type { FormGroupOptions } from './FormGroupApi/FormGroupApi.public'
import type {
  FieldValidators,
  FormErrorTypes,
  FormGroupValidators,
  FormValidators,
} from './validation.public'

/**
 * Determines how a supplied usage-site listener array combines with default
 * listeners.
 *
 * `'append'` runs default listeners before usage-site listeners. `'prepend'`
 * runs usage-site listeners first. `'replace'` uses only the usage-site
 * listeners. Omitting the usage-site property keeps the defaults, while
 * explicitly setting it to `undefined` suppresses them.
 */
export type DefaultListenersMergeMode = 'replace' | 'append' | 'prepend'

interface DefaultListenersMergeOptions {
  /**
   * Controls how usage-site listeners combine with default listeners.
   *
   * - `'replace'`: Usage-site listeners replace default listeners.
   * - `'append'`: Usage-site listeners run after default listeners.
   * - `'prepend'`: Usage-site listeners run before default listeners.
   *
   * Omitting `listeners` keeps the defaults. Explicitly setting `listeners` to
   * `undefined` suppresses them for every merge mode.
   *
   * @default 'replace'
   */
  listenersMerge?: DefaultListenersMergeMode
}

/**
 * Reusable form behavior that does not participate in form value inference.
 *
 * Only `errorVisibility`, `listeners`, `onSubmitInvalid`, and `listenersMerge`
 * can be shared this way. Callback values are typed as `unknown`, so behavior
 * that depends on the inferred form value should remain in the usage-site form
 * options. Usage-site properties override defaults even when explicitly set
 * to `undefined`; a supplied listener array instead follows `listenersMerge`.
 *
 * @example
 * ```ts
 * const formDefaults: DefaultFormOptions = {
 *   errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
 *   listenersMerge: 'append',
 *   onSubmitInvalid: () => {
 *     document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
 *   },
 * }
 * ```
 */
export type DefaultFormOptions = Pick<
  FormOptions<unknown, FormValidators<unknown>, unknown>,
  'errorVisibility' | 'listeners' | 'onSubmitInvalid'
> &
  DefaultListenersMergeOptions

/**
 * Reusable field behavior that does not participate in form or field value
 * inference.
 *
 * Only `errorVisibility`, `errorBoundary`, `listeners`, and `listenersMerge`
 * can be shared this way. Listener values and APIs are typed with `unknown`
 * values, so value-dependent behavior should remain in the usage-site field
 * options. Usage-site properties override defaults even when explicitly set
 * to `undefined`; a supplied listener array instead follows `listenersMerge`.
 *
 * @example
 * ```ts
 * const fieldDefaults: DefaultFieldOptions = {
 *   errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
 *   errorBoundary: true,
 * }
 * ```
 */
export type DefaultFieldOptions = Pick<
  FieldApiOptions<
    unknown,
    string,
    unknown,
    FieldValidators<unknown, string, unknown>,
    never,
    unknown,
    FormErrorTypes
  >,
  'errorVisibility' | 'errorBoundary' | 'listeners'
> &
  DefaultListenersMergeOptions

/**
 * Reusable form-group behavior that does not participate in group value
 * inference.
 *
 * Only `onSubmitInvalid` can be shared this way. Its callback receives
 * `unknown` form and group values, so value-dependent behavior should remain
 * in the usage-site form-group options. A usage-site `onSubmitInvalid`
 * property overrides the default even when explicitly set to `undefined`.
 *
 * @example
 * ```ts
 * const formGroupDefaults: DefaultFormGroupOptions = {
 *   onSubmitInvalid: ({ groupApi }) => {
 *     console.error('Invalid group', groupApi.name)
 *   },
 * }
 * ```
 */
export type DefaultFormGroupOptions = Pick<
  FormGroupOptions<
    unknown,
    string,
    unknown,
    FormGroupValidators<unknown>,
    FormErrorTypes
  >,
  'onSubmitInvalid'
>

/**
 * Collects the reusable defaults owned by one form.
 *
 * Each API resolves its usage-site options against the corresponding entry.
 * The defaults remain form-wide configuration rather than becoming part of
 * form, field, or group value inference.
 */
export interface DefaultOptions {
  /** Defaults resolved against form options. */
  form?: DefaultFormOptions
  /** Defaults resolved against field options. */
  field?: DefaultFieldOptions
  /** Defaults resolved against form-group options. */
  formGroup?: DefaultFormGroupOptions
}
