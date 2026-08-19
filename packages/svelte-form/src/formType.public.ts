import type {
  AnyFormOptions,
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
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

export type SvelteFormType<TOptions extends AnyFormOptions> =
  TOptions extends FormOptions<
    infer TData,
    infer TValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? SvelteFormApi<
        TData,
        SvelteFormTypeErrorTypes<TValidators, TSubmitReturn>,
        TComponents extends AnySvelteFormComponentMap
          ? TComponents
          : DefaultSvelteFormComponentMap
      >
    : never
