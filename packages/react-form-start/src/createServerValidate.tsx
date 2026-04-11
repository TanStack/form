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
  StandardSchemaV1,
  UnwrapFormAsyncValidateOrFn,
} from '@tanstack/react-form'
import type { FormDataInfo } from 'decode-formdata'

type InferServerValidatorOutput<
  TOnServer extends undefined | FormAsyncValidateOrFn<any>,
  TFormData,
> = TOnServer extends StandardSchemaV1<any, infer Output> ? Output : TFormData

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
      info?: FormDataInfo
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
    }): Promise<{
      error: UnwrapFormAsyncValidateOrFn<any> | undefined
      validatedValue: any
    }> => {
      if (isStandardSchemaValidator(onServerValidate)) {
        const rawResult = await onServerValidate['~standard'].validate(value)

        if (!rawResult.issues) {
          return { error: undefined, validatedValue: rawResult.value }
        }

        const error = await standardSchemaValidators.validateAsync(
          { value, validationSource },
          onServerValidate,
        )

        return { error, validatedValue: undefined }
      }

      const error = await (onServerValidate as FormValidateAsyncFn<any>)({
        value,
        signal: undefined as never,
        formApi: undefined as never,
      })

      return { error, validatedValue: value }
    }

    const referer = getRequestHeader('referer')!

    const decodedData = (info
      ? decode(formData, info)
      : decode(formData)) as never as any

    const { error: onServerError, validatedValue } = await runValidator({
      value: decodedData,
      validationSource: 'form',
    })

    if (!onServerError) return validatedValue

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
    serverFn({ data: { defaultOpts, formData, info } }) as Promise<
      InferServerValidatorOutput<TOnServer, TFormData>
    >
