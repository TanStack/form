import type { FieldApiOptions } from './FieldApi/FieldApi.public'
import type { FormOptions } from './FormApi/FormApi.public'
import type { FormGroupOptions } from './FormGroupApi/FormGroupApi.public'
import type {
  FieldValidators,
  FormErrorTypes,
  FormGroupValidators,
  FormValidators,
} from './validation.public'

/** Controls how usage-site listeners combine with default listeners. */
export type DefaultListenersMergeMode = 'replace' | 'append' | 'prepend'

interface DefaultListenersMergeOptions {
  /**
   * Controls how usage-site listeners combine with default listeners.
   *
   * - `'replace'`: Usage-site listeners replace default listeners.
   * - `'append'`: Usage-site listeners run after default listeners.
   * - `'prepend'`: Usage-site listeners run before default listeners.
   *
   * @default 'replace'
   */
  listenersMerge?: DefaultListenersMergeMode
}

/** Form options that can be configured as reusable defaults. */
export type DefaultFormOptions = Pick<
  FormOptions<unknown, FormValidators<unknown>, unknown>,
  'errorVisibility' | 'listeners' | 'onSubmitInvalid'
> &
  DefaultListenersMergeOptions

/** Field options that can be configured as reusable defaults. */
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

/** Form group options that can be configured as reusable defaults. */
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

/** Reusable defaults owned by a form and applied to opted-in APIs. */
export interface DefaultOptions {
  form?: DefaultFormOptions
  field?: DefaultFieldOptions
  formGroup?: DefaultFormGroupOptions
}
