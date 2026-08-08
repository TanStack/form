import type {
  AnyFormOptions,
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type { AppFormOptions } from '../AppForm/appFormOptions.public'
import type {
  AnyPreactFormComponentMap,
  DefaultPreactFormComponentMap,
} from '../AppForm/componentMap.public'
import type { PreactFormApi } from './formApiTypes.public'

// When defining formOptions, `onSubmit` is most likely not going to be present in it. Users
// prefer to define them in components.
// That's an issue for us because the inferred form error types are covariant, so resolving them
// early can break passing forms as props to child components.
// This must remain `any` so that `form={form}` remains working. There are type tests for it, so feel
// free to tinker.
type PreactFormTypeErrorTypes<
  TFormValidators extends FormValidators<any>,
  TSubmitReturn,
> = unknown extends TSubmitReturn
  ? any
  : ToFormErrorTypes<TFormValidators, TSubmitReturn>

export type PreactFormType<
  TOptions extends
    AnyFormOptions | AppFormOptions<any, any, any, AnyPreactFormComponentMap>,
> =
  TOptions extends AppFormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? PreactFormApi<
        TFormData,
        PreactFormTypeErrorTypes<TFormValidators, TSubmitReturn>,
        TComponents
      >
    : TOptions extends FormOptions<
          infer TFormData,
          infer TFormValidators,
          infer TSubmitReturn
        >
      ? PreactFormApi<
          TFormData,
          PreactFormTypeErrorTypes<TFormValidators, TSubmitReturn>,
          DefaultPreactFormComponentMap
        >
      : never
