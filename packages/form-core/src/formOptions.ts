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

The return type uses Pick to selectively overlay the resolved validator/listener/onSubmit
types onto TOptions. This preserves spread compatibility while ensuring callbacks
have correctly typed parameters. We avoid intersecting the full FormOptions to prevent
"excessively deep" errors from `in out` variance annotations.
*/

/**
 * Keys on FormOptions whose types depend on the validator generics
 * and need to be resolved for proper callback parameter inference.
 */
type FormOptionsDependentKeys = 'validators' | 'onSubmit' | 'onSubmitInvalid' | 'listeners'

export function formOptions<
  TOptions extends Partial<
    FormOptions<
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
  >,
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
  defaultOpts: Partial<
    FormOptions<
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
  > &
    TOptions,
): Omit<TOptions, FormOptionsDependentKeys> &
  Pick<
    Partial<
      FormOptions<
        NoInfer<TFormData>,
        NoInfer<TOnMount>,
        NoInfer<TOnChange>,
        NoInfer<TOnChangeAsync>,
        NoInfer<TOnBlur>,
        NoInfer<TOnBlurAsync>,
        NoInfer<TOnSubmit>,
        NoInfer<TOnSubmitAsync>,
        NoInfer<TOnDynamic>,
        NoInfer<TOnDynamicAsync>,
        NoInfer<TOnServer>,
        NoInfer<TSubmitMeta>
      >
    >,
    FormOptionsDependentKeys & keyof TOptions
  > {
  return defaultOpts as any
}
