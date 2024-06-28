import { decode } from 'decode-formdata'
import type {
  FormApi,
  FormOptions,
  ValidationError,
  Validator,
} from '@tanstack/form-core'

type OnServerValidateFn<TFormData> = (props: {
  value: TFormData
}) => ValidationError

type OnServerValidateOrFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = TFormValidator extends Validator<TFormData, infer FFN>
  ? FFN | OnServerValidateFn<TFormData>
  : OnServerValidateFn<TFormData>

interface ServerFormOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> extends FormOptions<TFormData, TFormValidator> {
  onServerValidate?: OnServerValidateOrFn<TFormData, TFormValidator>
}

type ValidateFormData<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = (
  formData: FormData,
  info?: Parameters<typeof decode>[1],
) => Promise<Partial<FormApi<TFormData, TFormValidator>['state']>>

export const createServerValidate = <
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  defaultOpts: ServerFormOptions<TFormData, TFormValidator>,
) =>
  (async (
    formData: FormData,
    info?: Parameters<typeof decode>[1],
  ): Promise<Partial<FormApi<TFormData, TFormValidator>['state']>> => {
    const { validatorAdapter, onServerValidate } = defaultOpts

    const runValidator = (propsValue: { value: TFormData }) => {
      if (validatorAdapter && typeof onServerValidate !== 'function') {
        return validatorAdapter().validate(propsValue, onServerValidate)
      }

      return (onServerValidate as OnServerValidateFn<TFormData>)(propsValue)
    }

    const data = decode(formData, info) as never as TFormData

    const onServerError = runValidator({ value: data })

    return {
      errorMap: {
        onServer: onServerError,
      },
      errors: onServerError ? [onServerError] : [],
    }
  }) as ValidateFormData<TFormData, TFormValidator>

export const initialFormState = {
  errorMap: {
    onServer: undefined,
  },
  errors: [],
}
