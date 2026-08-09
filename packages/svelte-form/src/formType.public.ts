import type {
  AnyFormOptions,
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type { AppFormOptions } from './AppForm/appFormOptions.public'
import type {
  AnySvelteFormComponentMap,
  DefaultSvelteFormComponentMap,
} from './AppForm/componentMap.public'
import type { SvelteFormApi } from './formApiTypes.public'

type SvelteFormTypeErrorTypes<
  TValidators extends FormValidators<any>,
  TSubmitReturn,
> = unknown extends TSubmitReturn
  ? any
  : ToFormErrorTypes<TValidators, TSubmitReturn>

export type SvelteFormType<
  TOptions extends
    AnyFormOptions | AppFormOptions<any, any, any, AnySvelteFormComponentMap>,
> =
  TOptions extends AppFormOptions<
    infer TData,
    infer TValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? SvelteFormApi<
        TData,
        SvelteFormTypeErrorTypes<TValidators, TSubmitReturn>,
        TComponents
      >
    : TOptions extends FormOptions<
          infer TData,
          infer TValidators,
          infer TSubmitReturn
        >
      ? SvelteFormApi<
          TData,
          SvelteFormTypeErrorTypes<TValidators, TSubmitReturn>,
          DefaultSvelteFormComponentMap
        >
      : never
