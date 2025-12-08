import { batch } from '@tanstack/store'
import type {
  AnyBaseFormState,
  FormApi,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from './FormApi'

/**
 * @private
 */
export type FormTransform<
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
  TSubmitMeta = never,
> = (
  formBase: FormApi<
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
) => FormApi<
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
>

/**
 * @private
 */
export function mergeAndUpdate<
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
  TSubmitMeta = never,
>(
  form: FormApi<
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
  fn?: FormTransform<
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
) {
  // Run the `transform` function on `form.state`, diff it, and update the relevant parts with what needs updating
  if (!fn) return

  const newObj = Object.assign({}, form, {
    // structuredClone is required to avoid `state` being mutated outside of this block
    // Commonly available since 2022 in all major browsers BUT NOT REACT NATIVE NOOOOOOO
    state: structuredClone(form.state),
  })

  fn(newObj)

  if (newObj.fieldInfo !== form.fieldInfo) {
    form.fieldInfo = newObj.fieldInfo
  }

  if (newObj.options !== form.options) {
    form.options = newObj.options
  }

  const baseFormKeys = Object.keys({
    values: null,
    validationMetaMap: null,
    fieldMetaBase: null,
    isSubmitting: null,
    isSubmitted: null,
    isValidating: null,
    submissionAttempts: null,
    isSubmitSuccessful: null,
    _force_re_eval: null,
    // Do not remove this, it ensures that we have all the keys in `BaseFormState`
  } satisfies Record<
    // Exclude errorMap since we need to handle that uniquely
    Exclude<keyof AnyBaseFormState, 'errorMap'>,
    null
  >) as Array<keyof AnyBaseFormState>

  const diffedObject = baseFormKeys.reduce((prev, key) => {
    if (form.state[key] !== newObj.state[key]) {
      prev[key] = newObj.state[key]
    }
    return prev
  }, {} as Partial<AnyBaseFormState>)

  batch(() => {
    if (Object.keys(diffedObject).length) {
      form.baseStore.setState((prev) => ({ ...prev, ...diffedObject }))
    }

    if (newObj.state.errorMap !== form.state.errorMap) {
      // Check if we need to update `fieldMetaBase` with `errorMaps` set by
      form.setErrorMap(newObj.state.errorMap)
    }
  })

  return newObj
}
