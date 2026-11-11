import { decode } from 'decode-formdata'
import { validateServerValues } from '@tanstack/form-core/internals'
import type { FormOptions, ServerValidateResult } from '@tanstack/form-core'
import type { FormDataInfo } from 'decode-formdata'

export type NextServerValidate<TFormData, TFormValidators> = (
  formData: FormData,
) => Promise<ServerValidateResult<TFormData, TFormValidators>>

export interface NextServerValidateOptions {
  info?: FormDataInfo
}

function decodeFormData<TFormData>(
  formData: FormData,
  info: FormDataInfo | undefined,
): TFormData {
  return (info ? decode(formData, info) : decode(formData)) as TFormData
}

export function next(options: NextServerValidateOptions = {}) {
  const createServerValidate = <
    TFormData,
    const TValidatorConfig extends unknown[],
    TValidators,
    TSubmitReturn,
  >(
    formOptions: FormOptions<
      TFormData,
      TValidatorConfig,
      TValidators,
      TSubmitReturn,
      unknown
    >,
  ): NextServerValidate<TFormData, TValidators> => {
    return async (formData: FormData) => {
      const values = decodeFormData<TFormData>(formData, options.info)

      return validateServerValues(formOptions, values)
    }
  }

  return {
    id: 'react-form-nextjs' as const,
    createServerValidate,
  }
}
