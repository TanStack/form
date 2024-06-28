import { decode } from 'decode-formdata'
import { ServerValidateError } from './error'
import type {
  FormOptions,
  ValidationError,
  Validator,
} from '@tanstack/form-core'
import type { ServerFormState } from './types'

type OnServerValidateFn<TFormData> = (props: {
  value: TFormData
}) => ValidationError

interface CreateServerValidateOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> extends FormOptions<TFormData, TFormValidator> {
  onServerValidate: OnServerValidateFn<TFormData>
}

export const createServerValidate =
  <
    TFormData,
    TFormValidator extends
      | Validator<TFormData, unknown>
      | undefined = undefined,
  >(
    defaultOpts: CreateServerValidateOptions<TFormData, TFormValidator>,
  ) =>
  async (formData: FormData, info?: Parameters<typeof decode>[1]) => {
    const { validatorAdapter, onServerValidate } = defaultOpts

    const runValidator = (propsValue: { value: TFormData }) => {
      if (validatorAdapter && typeof onServerValidate !== 'function') {
        return validatorAdapter().validate(propsValue, onServerValidate)
      }

      return (onServerValidate as OnServerValidateFn<TFormData>)(propsValue)
    }

    const values = decode(formData, info) as never as TFormData

    const onServerError = runValidator({ value: values })

    if (!onServerError) return

    const formState: ServerFormState<TFormData> = {
      errorMap: {
        onServer: onServerError,
      },
      values,
      errors: onServerError ? [onServerError] : [],
    }

    throw new ServerValidateError({
      formState,
    })
  }

export const initialFormState: ServerFormState<any> = {
  errorMap: {
    onServer: undefined,
  },
  values: undefined,
  errors: [],
}
