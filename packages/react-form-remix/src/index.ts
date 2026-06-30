import { decode } from 'decode-formdata'
import { validateServerValues } from '@tanstack/form-core'
import type {
  FormOptions,
  FormValidators,
  ServerValidateFrameworkPlugin,
  ServerValidateResult,
} from '@tanstack/form-core'
import type { FormDataInfo } from 'decode-formdata'

export interface RemixServerValidateContext {
  request: Request
  info?: FormDataInfo
}

export type RemixServerValidateResult<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> = ServerValidateResult<TFormData, TFormValidators>

export type RemixServerValidateAction<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> = (
  context: RemixServerValidateContext,
) => Promise<RemixServerValidateResult<TFormData, TFormValidators>>

export interface RemixServerValidateOptions {
  info?: FormDataInfo
}

type RemixCreateServerValidate = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => RemixServerValidateAction<TFormData, TFormValidators>

function decodeFormData<TFormData>(
  formData: FormData,
  info: FormDataInfo | undefined,
): TFormData {
  return (info ? decode(formData, info) : decode(formData)) as TFormData
}

export function remix(
  options: RemixServerValidateOptions = {},
): ServerValidateFrameworkPlugin<RemixCreateServerValidate> {
  return {
    id: 'react-form-remix',
    createServerValidate: <
      TFormData,
      const TFormValidators extends FormValidators<TFormData>,
      TSubmitReturn,
    >(
      formOptions: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
    ) => {
      return async (context) => {
        const formData = await context.request.formData()
        const values = decodeFormData<TFormData>(
          formData,
          context.info ?? options.info,
        )

        return validateServerValues(formOptions, values)
      }
    },
  }
}
