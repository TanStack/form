import {
  isGlobalFormValidationError,
  isStandardSchemaValidator,
  standardSchemaValidators,
} from '@tanstack/react-form'
import { getRequestHeader } from '@tanstack/react-start/server'
import { decode } from 'decode-formdata'
import { createServerFn } from '@tanstack/react-start'
import { ServerValidateError } from './error'
import { setInternalTanStackCookie } from './utils'

import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateAsyncFn,
  FormValidateOrFn,
  ServerFormState,
  UnwrapFormAsyncValidateOrFn,
} from '@tanstack/react-form'

interface CreateServerValidateOptions<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
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
  TOnDynamic,
  TOnDynamicAsync,
  TOnServer,
  TSubmitMeta
> {
  onServerValidate: TOnServer
}

const serverFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { formData: unknown; info?: unknown; defaultOpts: unknown }) => {
      return data
    },
  )
  .handler(async ({ data }) => {
    const { formData, info, defaultOpts } = data as {
      formData: FormData
      info?: Parameters<typeof decode>[1]
      defaultOpts: CreateServerValidateOptions<
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any
      >
    }
    const { onServerValidate } = defaultOpts

    const runValidator = async ({
      value,
      validationSource,
    }: {
      value: any
      validationSource: 'form'
    }) => {
      if (isStandardSchemaValidator(onServerValidate)) {
        return await standardSchemaValidators.validateAsync(
          { value, validationSource },
          onServerValidate,
        )
      }
      return (onServerValidate as FormValidateAsyncFn<any>)({
        value,
        signal: undefined as never,
        formApi: undefined as never,
      })
    }

    const referer = getRequestHeader('referer')!

    const decodedData = decode(formData, info) as never as any

    const onServerError = (await runValidator({
      value: decodedData,
      validationSource: 'form',
    })) as UnwrapFormAsyncValidateOrFn<any> | undefined

    if (!onServerError) return decodedData

    const onServerErrorVal = (
      isGlobalFormValidationError(onServerError)
        ? onServerError.form
        : onServerError
    ) as UnwrapFormAsyncValidateOrFn<any>

    const formState: ServerFormState<any, any> = {
      errorMap: {
        onServer: onServerError,
      },
      values: decodedData,
      errors: onServerErrorVal ? [onServerErrorVal] : [],
    }

    setInternalTanStackCookie(formState)

    throw new ServerValidateError({
      response: new Response('ok', {
        headers: {
          Location: referer,
        },
        status: 302,
      }),
      formState: formState,
    })
  })

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
    TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
    TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
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
      TOnDynamic,
      TOnDynamicAsync,
      TOnServer,
      TSubmitMeta
    >,
  ) =>
  (formData: FormData, info?: Parameters<typeof decode>[1]) =>
    serverFn({ data: { defaultOpts, formData, info } })
