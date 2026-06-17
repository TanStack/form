import type {
  AnyFormOptions,
  FormOptions,
  ToFormValidatorMetas,
  ToSubmitMeta,
} from '@tanstack/form-core'
import type { AppFormOptions } from '../AppForm/appFormOptions.public'
import type {
  AnyReactFormComponentMap,
  DefaultReactFormComponentMap,
} from '../AppForm/componentMap.public'
import type { ReactFormApi } from './formApiTypes.public'

// When defining formOptions, `onSubmit` is most likely not going to be present in it. Users
// prefer to define them in components.
// That's an issue for us because TSubmitMeta is covariant, so inferring to `ToSubmitMeta` early can
// break passing forms as props to child components.
// This must remain `any` so that `form={form}` remains working. There are type tests for it, so feel
// free to tinker.
type ReactFormTypeSubmitMeta<TSubmitReturn> = unknown extends TSubmitReturn
  ? any
  : ToSubmitMeta<TSubmitReturn>

export type ReactFormType<
  TOptions extends
    | AnyFormOptions
    | AppFormOptions<any, any, any, AnyReactFormComponentMap>,
> =
  TOptions extends AppFormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? ReactFormApi<
        TFormData,
        ToFormValidatorMetas<TFormValidators>,
        ReactFormTypeSubmitMeta<TSubmitReturn>,
        TComponents
      >
    : TOptions extends FormOptions<
          infer TFormData,
          infer TFormValidators,
          infer TSubmitReturn
        >
      ? ReactFormApi<
          TFormData,
          ToFormValidatorMetas<TFormValidators>,
          ReactFormTypeSubmitMeta<TSubmitReturn>,
          DefaultReactFormComponentMap
        >
      : never
