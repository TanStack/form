import type {
  FieldApiOptions,
  FieldAsyncValidateOrFn,
  FieldValidateOrFn,
} from './FieldApi'
import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from './FormApi'
import type { DeepKeys, DeepValue } from './util-types'

/**
 * @private
 */
export type FieldApiOptionsExcludingForm<
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
  K extends DeepKeys<TFormData>,
  TFieldOnMount extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnChange extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnBlur extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnSubmit extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
> = Omit<
  FieldApiOptions<
    TFormData,
    K,
    DeepValue<TFormData, K>,
    TFieldOnMount,
    TFieldOnChange,
    TFieldOnChangeAsync,
    TFieldOnBlur,
    TFieldOnBlurAsync,
    TFieldOnSubmit,
    TFieldOnSubmitAsync,
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
  'form'
> & {
  mode?: 'value' | 'array'
}

/**
 * Static field options are a way to create field options statically.
 * This is useful for creating field options that are not dependent on parameters such as indexes.
 *
 * @param options - The options for the field.
 * @returns The field options.
 */
export function fieldOptions<
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
  K extends DeepKeys<TFormData>,
  TFieldOnMount extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnChange extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnBlur extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnSubmit extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
>(
  options: {
    formOptions: FormOptions<
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
    >
  } & {
    fieldOptions: Omit<
      FieldApiOptions<
        TFormData,
        K,
        DeepValue<TFormData, K>,
        TFieldOnMount,
        TFieldOnChange,
        TFieldOnChangeAsync,
        TFieldOnBlur,
        TFieldOnBlurAsync,
        TFieldOnSubmit,
        TFieldOnSubmitAsync,
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
      'form'
    > & {
      mode?: 'value' | 'array'
    }
  },
): Omit<
  FieldApiOptions<
    TFormData,
    K,
    DeepValue<TFormData, K>,
    TFieldOnMount,
    TFieldOnChange,
    TFieldOnChangeAsync,
    TFieldOnBlur,
    TFieldOnBlurAsync,
    TFieldOnSubmit,
    TFieldOnSubmitAsync,
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
  'form'
> & {
  mode?: 'value' | 'array'
} {
  return options.fieldOptions
}

/**
 * Dynamic field options are a way to create field options dynamically.
 * This is useful for creating field options that are dependent on parameters such as indexes.
 *
 * @param fn - A function that returns the form options (for type inference) and field options.
 * @returns A function that returns the field options.
 */
export function dynamicFieldOptions<
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
  K extends DeepKeys<TFormData>,
  TFieldOnMount extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnChange extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnBlur extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnSubmit extends
    | undefined
    | FieldValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TFieldOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TFormData, K, DeepValue<TFormData, K>>,
  TParam = any,
>(
  fn: (param: TParam) => {
    formOptions: FormOptions<
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
    >
  } & {
    fieldOptions: FieldApiOptionsExcludingForm<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta,
      K,
      TFieldOnMount,
      TFieldOnChange,
      TFieldOnChangeAsync,
      TFieldOnBlur,
      TFieldOnBlurAsync,
      TFieldOnSubmit,
      TFieldOnSubmitAsync
    >
  },
): (
  param: TParam,
) => FieldApiOptionsExcludingForm<
  TFormData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnServer,
  TSubmitMeta,
  K,
  TFieldOnMount,
  TFieldOnChange,
  TFieldOnChangeAsync,
  TFieldOnBlur,
  TFieldOnBlurAsync,
  TFieldOnSubmit,
  TFieldOnSubmitAsync
> {
  return (param: TParam) => fn(param).fieldOptions
}
