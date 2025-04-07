import { decode } from 'decode-formdata'
import {
  isGlobalFormValidationError,
  isStandardSchemaValidator,
  standardSchemaValidators,
} from '@tanstack/form-core'
import { getHeader } from '@tanstack/react-start/server'
import { _tanstackInternalsCookie } from './utils'
import { ServerValidateError } from './error'
import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateAsyncFn,
  FormValidateOrFn,
  UnwrapFormAsyncValidateOrFn,
} from '@tanstack/form-core'
import type { ServerFormState } from './types'

interface CreateServerValidateOptions<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
> extends FormOptions<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  > {
  onServerValidate: TOnServer
}

export const createServerValidate =
  <
    TFormData,
    TOnMount extends undefined | FormValidateOrFn<TFormData>,
    TOnChange extends undefined | FormValidateOrFn<TFormData>,
    TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnBlur extends undefined | FormValidateOrFn<TFormData>,
    TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
    TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
    TSubmitMeta,
  >(
    defaultOpts: CreateServerValidateOptions<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta
    >,
  ) =>
  async (formData: FormData, info?: Parameters<typeof decode>[1]) => {
    const { onServerValidate } = defaultOpts

    const runValidator = async ({
      value,
      validationSource,
    }: {
      value: TFormData
      validationSource: 'form'
    }) => {
      if (isStandardSchemaValidator(onServerValidate)) {
        return await standardSchemaValidators.validateAsync(
          { value, validationSource },
          onServerValidate,
        )
      }
      return (onServerValidate as FormValidateAsyncFn<TFormData>)({
        value,
        signal: undefined as never,
        formApi: undefined as never,
      })
    }

    const referer = getHeader('referer')!

    const data = decode(formData, info) as never as TFormData

    const onServerError = (await runValidator({
      value: data,
      validationSource: 'form',
    })) as UnwrapFormAsyncValidateOrFn<TOnServer> | undefined

    if (!onServerError) return data

    const onServerErrorVal = (
      isGlobalFormValidationError(onServerError)
        ? onServerError.form
        : onServerError
    ) as UnwrapFormAsyncValidateOrFn<TOnServer>

    const formState: ServerFormState<TFormData, TOnServer> = {
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
