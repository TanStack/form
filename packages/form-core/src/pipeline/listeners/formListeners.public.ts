import type { ClientSideEvents, PreprocessEvents } from '../events.public'
import type { ScopedErrorTypes } from '../../validation/state.public'
import type { FormApi } from '../../FormApi/FormApi.public'
import type { AnyFieldApi } from '../../FieldApi/FieldApi.public'
import type { Listener } from './listeners.public'

export type FormListenerTriggers = ClientSideEvents | PreprocessEvents | 'reset'

export interface FormListenerContext<
  TFormData,
  TFormError extends ScopedErrorTypes,
> {
  formApi: FormApi<TFormData, TFormError>
  /** The form's values when the callback begins executing. */
  value: TFormData
  triggerFieldApi?: AnyFieldApi
  /**
   * Aborted when this invocation is canceled or replaced by a newer one.
   *
   * Use this signal for cooperative early exit. Return asynchronous work's
   * promise to keep it attached to this invocation's lifetime.
   */
  signal: AbortSignal
}

export type FormListenerFn<TFormData, TFormError extends ScopedErrorTypes> = (
  context: FormListenerContext<TFormData, TFormError>,
) => void

export type AnyFormListener = FormListener<any, any>

export interface FormListener<
  TFormData,
  TFormError extends ScopedErrorTypes,
> extends Listener<FormListenerTriggers, TFormData, TFormData> {
  run: FormListenerFn<TFormData, TFormError>
}

export type FormListeners<
  TFormData,
  TFormError extends ScopedErrorTypes,
> = Array<FormListener<TFormData, TFormError>>
