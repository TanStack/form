import { decode } from 'decode-formdata'
import { getRequestEvent } from 'solid-js/web'
import { reload } from '@solidjs/router'
import { _tanstackInternalsCookie } from './utils'
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
    const ctx = getRequestEvent()!

    const { validatorAdapter, onServerValidate } = defaultOpts

    const runValidator = (propsValue: { value: TFormData }) => {
      if (validatorAdapter && typeof onServerValidate !== 'function') {
        return validatorAdapter().validate(propsValue, onServerValidate)
      }

      return (onServerValidate as OnServerValidateFn<TFormData>)(propsValue)
    }

    const referer = ctx.request.headers.get('referer')!

    const data = decode(formData, info) as never as TFormData

    const onServerError = runValidator({ value: data })

    if (!onServerError) return

    const formState: ServerFormState<TFormData> = {
      errorMap: {
        onServer: onServerError,
      },
      values: data,
      errors: onServerError ? [onServerError] : [],
    }

    const cookie = await _tanstackInternalsCookie.serialize(formState)

    throw new ServerValidateError({
      reload: reload({
        headers: {
          'Set-Cookie': cookie,
        },
      }),
      formState: formState,
    })
  }
