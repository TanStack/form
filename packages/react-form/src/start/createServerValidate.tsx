import { decode } from 'decode-formdata'
import { _tanstackInternalsCookie } from './utils'
import type {
  FormOptions,
  ValidationError,
  Validator,
} from '@tanstack/form-core'
import type { FetchFn } from '@tanstack/start'

type Ctx = Parameters<FetchFn<FormData, unknown>>[1];

type OnServerValidateFn<TFormData> = (props: {
  value: TFormData
}) => ValidationError

export const createServerValidate = <
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  defaultOpts?: FormOptions<TFormData, TFormValidator>,
) =>
  (async (
    ctx: Ctx,
    formData: FormData,
    info?: Parameters<typeof decode>[1],
  ) => {
    const { validatorAdapter, onServerValidate } = defaultOpts || {}

    const runValidator = (propsValue: { value: TFormData }) => {
      if (validatorAdapter && typeof onServerValidate !== 'function') {
        return validatorAdapter().validate(propsValue, onServerValidate)
      }

      return (onServerValidate as OnServerValidateFn<TFormData>)(propsValue)
    }

    const referer = ctx.request.headers.get('referer')!;

    const data = decode(formData, info) as never as TFormData

    const onServerError = runValidator({ value: data })

    const response = {
      errorMap: {
        onServer: onServerError,
      },
      errors: onServerError ? [onServerError] : [],
    }

    const cookie = await _tanstackInternalsCookie.serialize(response);

    return new Response("ok", {
      headers: {
        "Location": referer,
        "Set-Cookie": cookie,
      },
      status: 302
    })
  })
