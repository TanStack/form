import { decode } from 'decode-formdata'
import { normalizeFormError } from '@tanstack/form-core'
import { ServerValidateError } from './error'
import type {
  FormOptions,
  ValidationResult,
  Validator,
} from '@tanstack/form-core'
import type { ServerFormState } from './types'

type OnServerValidateFn<TFormData> = (props: {
  value: TFormData
}) => ValidationResult | Promise<ValidationResult>

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

    const onServerErrorArr = normalizeFormError(onServerError).formError

    const formState: ServerFormState<TFormData> = {
      errorMap: {
        onServer: onServerErrorArr,
      },
      values,
      errors: onServerErrorArr ?? [],
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
