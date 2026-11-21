import type { AnyInternalFieldApi } from '../../FieldApi/FieldApi.lib'
import type { AnyInternalFormApi } from '../../FormApi/FormApi.lib'
import type { FormListenerContext } from './formListeners.public'
import type {
  FieldListenerContext,
  ListenerPredicateContext,
} from './listeners.public'

export interface FormListenerContextInput {
  triggerFieldApi?: AnyInternalFieldApi
  formApi: AnyInternalFormApi
}

export interface FieldListenerContextInput {
  fieldApi: AnyInternalFieldApi
  formApi: AnyInternalFormApi
}

type InputContext = FormListenerContextInput | FieldListenerContextInput

export type ListenerContext =
  FormListenerContext<any, any> | FieldListenerContext<any, any, any, any, any>

function isFormContext(ctx: InputContext): ctx is FormListenerContextInput {
  return 'triggerFieldApi' in ctx
}

function getContextValue(context: InputContext) {
  return isFormContext(context)
    ? context.formApi.state.values
    : context.fieldApi.value
}

export function createListenerPredicateContext(
  context: InputContext,
): ListenerPredicateContext<any, any> {
  return {
    triggerFieldApi: isFormContext(context)
      ? context.triggerFieldApi
      : context.fieldApi,
    formApi: context.formApi,
    value: getContextValue(context),
  }
}

export function createFormListenerContext(
  input: FormListenerContextInput,
  signal: AbortSignal,
): FormListenerContext<any, any> {
  return {
    formApi: input.formApi,
    triggerFieldApi: input.triggerFieldApi,
    value: input.formApi.state.values,
    signal,
  }
}

export function createFieldListenerContext(
  input: FieldListenerContextInput,
  signal: AbortSignal,
): FieldListenerContext<any, any, any, any, any> {
  return {
    value: input.fieldApi.value,
    fieldApi: input.fieldApi,
    formApi: input.formApi,
    signal,
  }
}
