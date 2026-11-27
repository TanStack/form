import type { FormApi, FormState } from './FormApi.public'
import type { ScopedErrorTypes } from '../validation/state.public'

export interface ErrorVisibilitySubfieldsMeta {
  isEveryPristine: boolean
  isSomeDirty: boolean
  isSomeTouched: boolean
  isSomeValidating: boolean
}

export interface ErrorVisibilityFieldMeta {
  isTouched: boolean
  isSelfTouched: boolean
  isDirty: boolean
  isSelfDirty: boolean
  isPristine: boolean
  isDefaultValue: boolean
  isBlurred: boolean
  isValidating: boolean
  isSelfValidating: boolean
  subfields: ErrorVisibilitySubfieldsMeta
}

export interface ErrorVisibilityFieldState {
  value: any
  meta: ErrorVisibilityFieldMeta
}

export interface ErrorVisibilityContext<in out TFormData> {
  state: FormState<TFormData, ScopedErrorTypes>
  fieldState: ErrorVisibilityFieldState
}

export type ErrorVisibilityFn<in out TFormData> = (
  context: ErrorVisibilityContext<TFormData>,
) => boolean

/**
 * Form or group state available to a reusable error visibility policy.
 *
 * `values` is `unknown` because the policy can be used with different form shapes.
 */
export type ReusableErrorVisibilityState = Omit<
  FormApi<any, any>['state'],
  'values'
> & {
  /** Current form values, without assuming a particular form shape. */
  values: unknown
}

/** State available to a visibility policy shared across different form shapes. */
export interface ReusableErrorVisibilityContext {
  /** Form state with group-scoped flags and counters for fields in a form group. */
  state: ReusableErrorVisibilityState
  /** The field whose errors the policy controls. */
  fieldState: ErrorVisibilityFieldState
}

/**
 * An error visibility policy that accepts forms with different value and error types.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export type ReusableErrorVisibility = <TFormData>(
  context: ErrorVisibilityContext<TFormData>,
) => boolean

/**
 * Creates an error visibility policy that can be shared across forms with different values.
 *
 * Use an inline `errorVisibility` callback instead when the policy needs
 * strongly typed access to the consuming form's `values`.
 *
 * @param visibility - Returns `true` to show the field's errors, or `false` to hide them.
 * @returns The policy to assign to a form or field's `errorVisibility` option.
 */
export function createErrorVisibility(
  visibility: (context: ReusableErrorVisibilityContext) => boolean,
): ReusableErrorVisibility {
  return visibility
}
