import { decode } from 'decode-formdata'
import {
  isGlobalFormValidationError,
  isStandardSchemaValidator,
  standardSchemaValidators,
} from '@tanstack/form-core'
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

    const values = decode(formData, info) as never as TFormData

    const onServerError = (await runValidator({
      value: values,
      validationSource: 'form',
    })) as UnwrapFormAsyncValidateOrFn<TOnServer> | undefined

    if (!onServerError) return values

    let onServerErrorVal = undefined
    let onServerErrorValFields = undefined
    // ^ if fields is defined, this object is { fieldName: "Error Message" }

    // checks if it's an object with 'fields'
    if (isGlobalFormValidationError(onServerError)) {
      onServerErrorVal =
        onServerError.form as UnwrapFormAsyncValidateOrFn<TOnServer>
      onServerErrorValFields =
        onServerError.fields as UnwrapFormAsyncValidateOrFn<TOnServer>
    } else {
      onServerErrorVal = onServerError as UnwrapFormAsyncValidateOrFn<TOnServer>
    }

    // Extract string values from errors if they're in object format
    let errorsArray: any[] = []
    if (onServerErrorVal) {
      if (Array.isArray(onServerErrorVal)) {
        errorsArray = onServerErrorVal.map((err) => {
          return err
        })
      } else errorsArray = [onServerErrorVal]
    }

    const formState: ServerFormState<TFormData, TOnServer> = {
      errorMap: {
        onServer: onServerErrorValFields,
      },
      values,
      errors: errorsArray,
    }

    throw new ServerValidateError({
      formState,
    })
  }

export const initialFormState: ServerFormState<any, undefined> = {
  errorMap: {
    onServer: undefined,
  },
  values: undefined,
  errors: [],
}
