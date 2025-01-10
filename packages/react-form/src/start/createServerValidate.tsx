import { decode } from 'decode-formdata'
import { isFormValidationError } from '@tanstack/form-core'
import { getHeader } from 'vinxi/http'
import { _tanstackInternalsCookie } from './utils'
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

      return (onServerValidate as OnServerValidateFn<TFormData>)(propsValue)
    }

    const referer = getHeader('referer')!

    const data = decode(formData, info) as never as TFormData

    const onServerError = (await runValidator({
      value: data,
      validationSource: 'form',
    })) as TOnServerReturn | undefined

    if (!onServerError) return

    const onServerErrorVal = (
      isFormValidationError(onServerError) ? onServerError.form : onServerError
    ) as TOnServerReturn

    const formState: ServerFormState<TFormData, TOnServerReturn> = {
      errorMap: {
        onServer: onServerError,
      },
      values: data,
      errors: onServerErrorVal ? [onServerErrorVal] : [],
    }

    const cookie = await _tanstackInternalsCookie.serialize(formState)

    throw new ServerValidateError({
      response: new Response('ok', {
        headers: {
          Location: referer,
          'Set-Cookie': cookie,
        },
        status: 302,
      }),
      formState: formState,
    })
  }
