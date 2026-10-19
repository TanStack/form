import type { AnyFieldApi } from '../FieldApi/FieldApi.public'
import type { Listener } from '../listeners.public'
import type { ClientSideEvents, PreprocessEvents } from '../events.public'
// TODO finalize migration
import type { FormErrorTypes } from '../validation.public'
import type {
  ScopedErrorTypes,
  ToFormErrorTypes,
} from '../validation/state.public'
import type { FormApi } from './FormApi.public'

export type FormListenerTriggers = ClientSideEvents | PreprocessEvents | 'reset'

export interface FormListenerContext<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> {
  formApi: FormApi<TFormData, TFormErrorTypes>
  value: TFormData
  triggerFieldApi?: AnyFieldApi
}

export type FormListenerFn<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> = (context: FormListenerContext<TFormData, TFormErrorTypes>) => void

export type AnyFormListener = FormListener<any, any>

export interface FormListener<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> extends Listener<FormListenerTriggers, TFormData, TFormData> {
  run: FormListenerFn<TFormData, TFormErrorTypes>
}

export type FormListeners<
  TFormData,
  TFormError extends ScopedErrorTypes,
> = Array<FormListener<TFormData, ToFormErrorTypes<TFormError>>>
