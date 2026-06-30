import { decode } from 'decode-formdata'
import { validateServerValues } from '@tanstack/form-core'
import { getFormData } from './getFormData'
import { setInternalTanStackCookie } from './utils'
import type {
  FormOptions,
  FormValidators,
  ServerFormState,
  ServerValidateFailure,
  ServerValidateResult,
  ServerValidateSuccess,
} from '@tanstack/form-core'
import type { FormDataInfo } from 'decode-formdata'

export { getFormData }

export interface StartServerValidateContext {
  formData: FormData
  info?: FormDataInfo
}

export type StartServerValidateResult<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TOnInvalidReturn = never,
  TOnValidReturn = never,
> =
  | ServerValidateResult<TFormData, TFormValidators>
  | TOnInvalidReturn
  | TOnValidReturn

export interface StartServerValidateOptions<
  TOnInvalidReturn = never,
  TOnValidReturn = never,
> {
  info?: FormDataInfo
  onInvalid?: (args: {
    result: ServerValidateFailure<any, any>
    serverState: ServerFormState<any, any>
  }) => TOnInvalidReturn | Promise<TOnInvalidReturn>
  onValid?: (args: {
    result: ServerValidateSuccess<any, any>
  }) => TOnValidReturn | Promise<TOnValidReturn>
}

export type StartServerValidateAction<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TOnInvalidReturn = never,
  TOnValidReturn = never,
> = (
  context: StartServerValidateContext,
) => Promise<
  StartServerValidateResult<
    TFormData,
    TFormValidators,
    TOnInvalidReturn,
    TOnValidReturn
  >
>

function decodeFormData<TFormData>(
  formData: FormData,
  info: FormDataInfo | undefined,
): TFormData {
  return (info ? decode(formData, info) : decode(formData)) as TFormData
}

export function start<TOnInvalidReturn = never, TOnValidReturn = never>(
  options: StartServerValidateOptions<TOnInvalidReturn, TOnValidReturn> = {},
) {
  const createServerValidate = <
    TFormData,
    const TFormValidators extends FormValidators<TFormData>,
    TSubmitReturn,
  >(
    formOptions: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ): StartServerValidateAction<
    TFormData,
    TFormValidators,
    TOnInvalidReturn,
    TOnValidReturn
  > => {
    return async (context) => {
      const values = decodeFormData<TFormData>(
        context.formData,
        context.info ?? options.info,
      )

      const result = await validateServerValues(formOptions, values)

      if (result.success) {
        return options.onValid ? options.onValid({ result }) : result
      }

      setInternalTanStackCookie(result.serverState)

      return options.onInvalid
        ? options.onInvalid({
            result,
            serverState: result.serverState,
          })
        : result
    }
  }

  return {
    id: 'react-form-start' as const,
    createServerValidate,
    getFormData,
  }
}
