import { decode } from 'decode-formdata'
import { validateServerValues } from '@tanstack/form-core'
import type {
  FormOptions,
  FormValidators,
  ServerValidateFrameworkPlugin,
  ServerValidateSuccess,
} from '@tanstack/form-core'
import type { FormDataInfo } from 'decode-formdata'

export type NextServerValidate<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> = (
  formData: FormData,
) => Promise<ServerValidateSuccess<TFormData, TFormValidators>>

export interface NextServerValidateOptions {
  info?: FormDataInfo
}

type NextCreateServerValidate = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => NextServerValidate<TFormData, TFormValidators>

function decodeFormData<TFormData>(
  formData: FormData,
  info: FormDataInfo | undefined,
): TFormData {
  return (info ? decode(formData, info) : decode(formData)) as TFormData
}

export function next(
  options: NextServerValidateOptions = {},
): ServerValidateFrameworkPlugin<NextCreateServerValidate> {
  return {
    id: 'react-form-nextjs',
    createServerValidate: <
      TFormData,
      const TFormValidators extends FormValidators<TFormData>,
      TSubmitReturn,
    >(
      formOptions: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
    ) => {
      return async (formData) => {
        const values = decodeFormData<TFormData>(formData, options.info)

        return validateServerValues(formOptions, values)
      }
    },
  }
}
