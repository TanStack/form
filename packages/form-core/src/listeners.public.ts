import type { DeepKeys, DeepValue } from './deep-keys.public'
import type { FormApi } from './FormApi/FormApi.public'
import type { AnyFieldApi, FieldApi } from './FieldApi/FieldApi.public'
import type {
  FieldValidatorMetas,
  FormGroupValidatorMetas,
  FormValidatorMetas,
  ValidationTrigger,
} from './validation.public'

// triggers

export type FormListenerTriggers = ValidationTrigger | 'mount' | 'reset'
export type FieldListenerTriggers = FormListenerTriggers | 'unmount'

// shared

export interface ListenerPredicateContext<TFormData, TValue> {
  formApi: FormApi<TFormData, any, any>
  triggerFieldApi?: AnyFieldApi
  value: TValue
}

export type ListenerPredicateFn<TFormData, TValue> = (
  context: ListenerPredicateContext<TFormData, TValue>,
) => boolean

export interface ListenerTriggerConfig<
  TTriggers extends FieldListenerTriggers,
  TFormData,
  TValue,
> {
  trigger: TTriggers
  when?: boolean | ListenerPredicateFn<TFormData, TValue>
}

export type ListenerTriggerOption<
  TTriggers extends FieldListenerTriggers,
  TFormData,
  TValue,
> = TTriggers | ListenerTriggerConfig<TTriggers, TFormData, TValue>

export type ListenerDebounceFn<TFormData, TValue> = (
  context: ListenerPredicateContext<TFormData, TValue>,
) => number

export interface Listener<
  TTriggers extends FieldListenerTriggers,
  TFormData,
  TValue,
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

// form

export interface FormListenerContext<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> {
  triggerFieldApi?: AnyFieldApi
  formApi: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>
  value: TFormData
}

export type FormListenerFn<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> = (
  context: FormListenerContext<TFormData, TFormValidatorMetas, TSubmitReturn>,
) => void

export type AnyFormListener = FormListener<any, any, any>

export interface FormListener<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> extends Listener<FormListenerTriggers, TFormData, TFormData> {
  run: FormListenerFn<TFormData, TFormValidatorMetas, TSubmitReturn>
}

export type FormListeners<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> = Array<FormListener<TFormData, TFormValidatorMetas, TSubmitReturn>>

// field

export interface FieldListenerContext<
  TFieldData,
  TFieldName extends DeepKeys<TFieldData>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
  TFieldValidatorMetas extends FieldValidatorMetas,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> {
  value: TFieldValue
  fieldApi: FieldApi<
    TFieldData,
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

// Field A listens to field B
// field B triggers field A validation
// -> should fieldApi refer to A or should it refer to B?
//    -> No, it should refer to field A still. B data can be obtained from other sources.

export type FieldListenerFn<
  TFieldData,
  TFieldName extends DeepKeys<TFieldData>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
  TFieldValidatorMetas extends FieldValidatorMetas,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> = (
  context: FieldListenerContext<
    TFieldData,
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
  TFieldData,
  TFieldName extends DeepKeys<TFieldData>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
  TFieldValidatorMetas extends FieldValidatorMetas,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> extends Listener<FieldListenerTriggers, TFieldData, TFieldValue> {
  run: FieldListenerFn<
    TFieldData,
    TFieldName,
    TFieldValue,
    TFieldValidatorMetas,
    TGroupValidatorMetas,
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn
  >
  // TODO what to name it
  // - listenTo
  // - listenToFields
  // - watchFields
  watchFields?: Array<DeepKeys<TFieldData>>
}

export type FieldListeners<
  TFieldData,
  TFieldName extends DeepKeys<TFieldData>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
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
