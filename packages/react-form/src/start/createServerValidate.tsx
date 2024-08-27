import { decode } from 'decode-formdata'
import { _tanstackInternalsCookie } from './utils'
import { ServerValidateError } from './error'
import type {
  FormOptions,
  ValidationError,
  Validator,
} from '@tanstack/form-core'
import type { FetchFn } from '@tanstack/start'
import type { ServerFormState } from './types'

type Ctx = Parameters<FetchFn<FormData, unknown>>[1]

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

export const createServerValidate =
  <
    TFormData,
    TFormValidator extends
      | Validator<TFormData, unknown>
      | undefined = undefined,
  >(
    defaultOpts: CreateServerValidateOptions<TFormData, TFormValidator>,
  ) =>
  async (ctx: Ctx, formData: FormData, info?: Parameters<typeof decode>[1]) => {
    const { validatorAdapter, onServerValidate } = defaultOpts

    const runValidator = async (propsValue: { value: TFormData }) => {
      if (validatorAdapter && typeof onServerValidate !== 'function') {
        return validatorAdapter().validateAsync(propsValue, onServerValidate)
      }

      return (onServerValidate as OnServerValidateFn<TFormData>)(propsValue)
    }

    const referer = ctx.request.headers.get('referer')!

    const data = decode(formData, info) as never as TFormData

    const onServerError = await runValidator({ value: data })

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
