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
}) => ValidationError | Promise<ValidationError>

type OnServerValidateOrFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> =
  TFormValidator extends Validator<TFormData, infer FFN>
    ? FFN | OnServerValidateFn<TFormData>
    : OnServerValidateFn<TFormData>

interface CreateServerValidateOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> extends FormOptions<TFormData, TFormValidator> {
  onServerValidate: OnServerValidateOrFn<TFormData, TFormValidator>
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

    const runValidator = async (propsValue: {
      value: TFormData
      validationSource: 'form'
    }) => {
      if (validatorAdapter && typeof onServerValidate !== 'function') {
        return validatorAdapter().validateAsync(propsValue, onServerValidate)
      }

      return (onServerValidate as OnServerValidateFn<TFormData>)(propsValue)
    }

    const values = decode(formData, info) as never as TFormData

    const onServerError = await runValidator({
      value: values,
      validationSource: 'form',
    })

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
