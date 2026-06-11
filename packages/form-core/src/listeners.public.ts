import type { DeepKeys } from './deep-keys.public'
import type { FormApi } from './FormApi/FormApi.public'
import type { AnyFieldApi, FieldApi } from './FieldApi/FieldApi.public'
import type {
  FieldValidatorMetas,
  FormGroupValidatorMetas,
  FormValidatorMetas,
  ValidationTrigger,
} from './validation.public'

export type FormListenerTriggers = ValidationTrigger | 'mount' | 'reset'
export type FieldListenerTriggers = FormListenerTriggers | 'unmount'

export interface ListenerPredicateContext<in out TFormData, out TValue> {
  formApi: FormApi<TFormData, any, any>
  triggerFieldApi?: AnyFieldApi
  value: TValue
}

export type ListenerPredicateFn<in out TFormData, in out TValue> = (
  context: ListenerPredicateContext<TFormData, TValue>,
) => boolean

export interface ListenerTriggerConfig<
  out TTriggers extends FieldListenerTriggers,
  in out TFormData,
  in out TValue,
> {
  trigger: TTriggers
  when?: boolean | ListenerPredicateFn<TFormData, TValue>
}

export type ListenerTriggerOption<
  TTriggers extends FieldListenerTriggers,
  TFormData,
  TValue,
> = TTriggers | ListenerTriggerConfig<TTriggers, TFormData, TValue>

export type ListenerDebounceFn<in out TFormData, in out TValue> = (
  context: ListenerPredicateContext<TFormData, TValue>,
) => number

export interface Listener<
  out TTriggers extends FieldListenerTriggers,
  in out TFormData,
  in out TValue,
> {
  /**
   * The debounce time in milliseconds for validation triggers (change, blur).
   * Does not affect submit events, which always execute immediately.
   *
   * @default 0
   */
  triggerDebounceMs?: number | ListenerDebounceFn<TFormData, TValue>
  triggers?: Array<ListenerTriggerOption<TTriggers, TFormData, TValue>>
}

export interface FormListenerContext<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> {
  triggerFieldApi?: AnyFieldApi
  formApi: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>
  value: TFormData
}

export type FormListenerFn<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> = (
  context: FormListenerContext<TFormData, TFormValidatorMetas, TSubmitReturn>,
) => void

export type AnyFormListener = FormListener<any, any, any>

export interface FormListener<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> extends Listener<FormListenerTriggers, TFormData, TFormData> {
  run: FormListenerFn<TFormData, TFormValidatorMetas, TSubmitReturn>
}

export type FormListeners<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> = Array<FormListener<TFormData, TFormValidatorMetas, TSubmitReturn>>

export interface FieldListenerContext<
  out TFieldName,
  in out TFieldValue,
  in out TFieldValidatorMetas extends FieldValidatorMetas,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> {
  value: TFieldValue
  fieldApi: FieldApi<
    TFieldName,
    TFieldValue,
    TFieldValidatorMetas,
    TGroupValidatorMetas,
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn
  >
  formApi: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>
}

export type FieldListenerFn<
  in TFieldName,
  in out TFieldValue,
  in out TFieldValidatorMetas extends FieldValidatorMetas,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> = (
  context: FieldListenerContext<
    TFieldName,
    TFieldValue,
    TFieldValidatorMetas,
    TGroupValidatorMetas,
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn
  >,
) => void

export type AnyFieldListener = FieldListener<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

export interface FieldListener<
  in out TFieldData,
  in TFieldName,
  in out TFieldValue,
  in out TFieldValidatorMetas extends FieldValidatorMetas,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> extends Listener<FieldListenerTriggers, TFieldData, TFieldValue> {
  run: FieldListenerFn<
    TFieldName,
    TFieldValue,
    TFieldValidatorMetas,
    TGroupValidatorMetas,
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn
  >
  watchFields?: Array<DeepKeys<TFieldData>>
}

export type FieldListeners<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidatorMetas extends FieldValidatorMetas,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> = Array<
  FieldListener<
    TFieldData,
    TFieldName,
    TFieldValue,
    TFieldValidatorMetas,
    TGroupValidatorMetas,
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn
  >
>
