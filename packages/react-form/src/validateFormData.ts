import { decode } from 'decode-formdata'
import { FormOptions, ValidationError, Validator } from '@tanstack/form-core'

type OnServerValidateFn<TFormData> = (props: {
  value: TFormData
}) => ValidationError

type OnServerValidateOrFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = TFormValidator extends Validator<TFormData, infer FFN>
  ? FFN | OnServerValidateFn<TFormData>
  : OnServerValidateFn<TFormData>

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormOptions<
    TFormData,
    TFormValidator extends
      | Validator<TFormData, unknown>
      | undefined = undefined,
  > {
    onServerValidate?: OnServerValidateOrFn<TFormData, TFormValidator>
  }
}

export type ValidateFormData<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = (formData: FormData, info?: Parameters<typeof decode>[1]) => ValidationError

export const getValidateFormData =
  <
    TFormData,
    TFormValidator extends
      | Validator<TFormData, unknown>
      | undefined = undefined,
  >(
    defaultOpts?: FormOptions<TFormData, TFormValidator>,
  ) =>
  async (formData: FormData, info?: Parameters<typeof decode>[1]) => {
    const { validatorAdapter, onServerValidate } = defaultOpts || {}

    const runValidator = (propsValue: { value: TFormData }) => {
      if (validatorAdapter && typeof onServerValidate !== 'function') {
        return validatorAdapter().validate(
          propsValue,
          onServerValidate,
        ) as never
      }

      return (onServerValidate as OnServerValidateFn<TFormData>)(
        propsValue,
      ) as never
    }

    const data = decode(formData, info) as never as TFormData

    return runValidator({ value: data })
  }
