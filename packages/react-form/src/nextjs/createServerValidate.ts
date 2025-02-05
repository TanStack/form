import { decode } from 'decode-formdata'
import { isGlobalFormValidationError } from '@tanstack/form-core'
import { ServerValidateError } from './error'
import type { FormOptions, Validator } from '@tanstack/form-core'
import type { ServerFormState } from './types'

type OnServerValidateFn<TFormData, TOnServerReturn = undefined> = (props: {
  value: TFormData
}) => TOnServerReturn

type OnServerValidateOrFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
  TOnServerReturn = undefined,
> =
  TFormValidator extends Validator<TFormData, infer FFN, infer _TOnServerReturn>
    ? FFN | OnServerValidateFn<TFormData, TOnServerReturn>
    : OnServerValidateFn<TFormData, TOnServerReturn>

interface CreateServerValidateOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
  TOnServerReturn = undefined,
> extends FormOptions<TFormData, TFormValidator> {
  onServerValidate: OnServerValidateOrFn<
    TFormData,
    TFormValidator,
    TOnServerReturn
  >
}

export const createServerValidate =
  <
    TFormData,
    TFormValidator extends
      | Validator<TFormData, unknown>
      | undefined = undefined,
    TOnServerReturn = undefined,
  >(
    defaultOpts: CreateServerValidateOptions<
      TFormData,
      TFormValidator,
      TOnServerReturn
    >,
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

      return (
        onServerValidate as OnServerValidateFn<TFormData, TOnServerReturn>
      )(propsValue)
    }

    const values = decode(formData, info) as never as TFormData

    const onServerError = (await runValidator({
      value: values,
      validationSource: 'form',
    })) as TOnServerReturn | undefined

    if (!onServerError) return

    const onServerErrorVal = (
      isGlobalFormValidationError(onServerError)
        ? onServerError.form
        : onServerError
    ) as TOnServerReturn

    const formState: ServerFormState<TFormData, TOnServerReturn> = {
      errorMap: {
        onServer: onServerError,
      },
      values,
      errors: onServerErrorVal ? [onServerErrorVal] : [],
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
