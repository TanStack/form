import type {
  AnyFormOptions,
  FormOptions,
  GetFormErrorTypes,
} from '@tanstack/form-core'
import type {
  AnySvelteFormComponentMap,
  DefaultSvelteFormComponentMap,
} from './AppForm/componentMap.public'
import type { SvelteFormApi } from './formApiTypes.public'

type SvelteFormTypeErrorTypes<TValidators, TSubmitReturn> =
  unknown extends TSubmitReturn
    ? any
    : GetFormErrorTypes<TValidators, TSubmitReturn>

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
        SvelteFormTypeErrorTypes<TValidators, TSubmitReturn>,
        TComponents extends AnySvelteFormComponentMap
          ? TComponents
          : DefaultSvelteFormComponentMap
      >
    : never
