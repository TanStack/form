import type {
  ScopedErrorTypes,
  ToFormErrorTypes,
} from '../validation/state.public'
import type { FormState } from './FormApi.public'

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
