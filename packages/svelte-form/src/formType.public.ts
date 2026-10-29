import type {
  AnyFormOptions,
  FormOptions,
  GetFormErrorTypes,
  GetSharedFormErrorTypes,
} from '@tanstack/form-core'
import type {
  AnySvelteFormComponentMap,
  DefaultSvelteFormComponentMap,
} from './AppForm/componentMap.public'
import type { SvelteFormApi } from './formApiTypes.public'

export type SvelteFormType<TOptions extends AnyFormOptions> =
  TOptions extends FormOptions<
    infer TData,
    any,
    infer TValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? SvelteFormApi<
        TData,
        GetSharedFormErrorTypes<TValidators, TSubmitReturn>,
        TComponents extends AnySvelteFormComponentMap
          ? TComponents
          : DefaultSvelteFormComponentMap
      >
    : never
