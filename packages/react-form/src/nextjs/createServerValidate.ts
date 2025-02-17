import { decode } from 'decode-formdata'
import { isGlobalFormValidationError } from '@tanstack/form-core'
import { ServerValidateError } from './error'
import type { FormOptions } from '@tanstack/form-core'
import type { ServerFormState } from './types'

type OnServerValidateFn<TFormData, TOnServerReturn = undefined> = (props: {
  value: TFormData
}) => TOnServerReturn

type OnServerValidateOrFn<
  TFormData,
  TOnServerReturn = undefined,
> = OnServerValidateFn<TFormData, TOnServerReturn>

interface CreateServerValidateOptions<TFormData, TOnServerReturn = undefined>
  extends FormOptions<TFormData> {
  onServerValidate: OnServerValidateOrFn<TFormData, TOnServerReturn>
}

export const createServerValidate =
  <TFormData, TOnServerReturn = undefined>(
    defaultOpts: CreateServerValidateOptions<TFormData, TOnServerReturn>,
  ) =>
  async (formData: FormData, info?: Parameters<typeof decode>[1]) => {
    const { onServerValidate } = defaultOpts

    const runValidator = async (propsValue: {
      value: TFormData
      validationSource: 'form'
    }) => {
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
