import { decode } from 'decode-formdata'
import { ServerValidateError } from './error'
import type {
  FormOptions,
  FormValidationError,
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

const isFormValidationError = (
  error: unknown,
): error is FormValidationError<unknown> => {
  return typeof error === 'object'
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

    const runValidator = (propsValue: { value: TFormData; api: 'form' }) => {
      if (validatorAdapter && typeof onServerValidate !== 'function') {
        return validatorAdapter().validate(propsValue, onServerValidate)
      }

      return (onServerValidate as OnServerValidateFn<TFormData>)(propsValue)
    }

    const values = decode(formData, info) as never as TFormData

    const onServerError = runValidator({ value: values, api: 'form' })

    if (!onServerError) return

    const onServerErrorStr =
      onServerError &&
      typeof onServerError !== 'string' &&
      isFormValidationError(onServerError)
        ? onServerError.form
        : onServerError

    const formState: ServerFormState<TFormData> = {
      errorMap: {
        onServer: onServerError,
      },
      values,
      errors: onServerErrorStr ? [onServerErrorStr] : [],
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
