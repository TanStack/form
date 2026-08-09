import type { AnyFormOptions, FormOptions } from '@tanstack/form-core'
import type {
  AnyInternalFormApi,
  InternalFormApi,
} from '@tanstack/form-core/internals'

// Reusable formOptions often omit onSubmit so a component can provide it later.
// Keep that unresolved submit return flexible when the form is passed to a child.
type AngularFormTypeSubmitReturn<TSubmitReturn> = unknown extends TSubmitReturn
  ? any
  : TSubmitReturn

/** An Angular form instance when its concrete data shape is not known. */
export type AnyAngularFormApi = AnyInternalFormApi

/** Resolves a reusable options object to its concrete Angular form type. */
export type AngularFormType<TOptions extends AnyFormOptions> =
  TOptions extends FormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn
  >
    ? InternalFormApi<
        TFormData,
        TFormValidators,
        AngularFormTypeSubmitReturn<TSubmitReturn>
      >
    : never
