import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from './FormApi'

/*

These types need to do two things:

1. Validator generics need to depend on the TFormData generic
2. The resulting needs to allow overriding values

The generics from formOptions almost work, except that it loses information
about how to infer TFormData.
If you pass a validator function, it tries to resolve the `formApi` or `value`
inside of it, meaning that TFormData changes to `unknown`.

To bypass this, the intersection for defaultOpts gives TypeScript that information again,
without losing the benefits from the TOptions generic.
*/

export function formOptions<
  TOptions extends Partial<
    FormOptions<
      TFormData,
      undefined | FormValidateOrFn<TFormData>,
      undefined | FormValidateOrFn<TFormData>,
      undefined | FormAsyncValidateOrFn<TFormData>,
      undefined | FormValidateOrFn<TFormData>,
      undefined | FormAsyncValidateOrFn<TFormData>,
      undefined | FormValidateOrFn<TFormData>,
      undefined | FormAsyncValidateOrFn<TFormData>,
      undefined | FormValidateOrFn<TFormData>,
      undefined | FormAsyncValidateOrFn<TFormData>,
      undefined | FormAsyncValidateOrFn<TFormData>,
      TSubmitMeta
    >
  >,
  TFormData = TOptions['defaultValues'],
  TSubmitMeta = TOptions['onSubmitMeta'],
>(
  defaultOpts: Partial<
    FormOptions<
      TFormData,
      undefined | FormValidateOrFn<TFormData>,
      undefined | FormValidateOrFn<TFormData>,
      undefined | FormAsyncValidateOrFn<TFormData>,
      undefined | FormValidateOrFn<TFormData>,
      undefined | FormAsyncValidateOrFn<TFormData>,
      undefined | FormValidateOrFn<TFormData>,
      undefined | FormAsyncValidateOrFn<TFormData>,
      undefined | FormValidateOrFn<TFormData>,
      undefined | FormAsyncValidateOrFn<TFormData>,
      undefined | FormAsyncValidateOrFn<TFormData>,
      TSubmitMeta
    >
  > &
    TOptions,
): TOptions {
  return defaultOpts
}
