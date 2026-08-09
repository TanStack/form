import type { AnyFormOptions, FormOptions } from '@tanstack/form-core'
import type { TanStackFormController } from './tanstack-form-controller.js'

type LitFormTypeSubmitReturn<TSubmitReturn> = unknown extends TSubmitReturn
  ? any
  : TSubmitReturn

/** Resolves reusable form options to their concrete Lit controller type. */
export type LitFormType<TOptions extends AnyFormOptions> =
  TOptions extends FormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn
  >
    ? TanStackFormController<
        TFormData,
        TFormValidators,
        LitFormTypeSubmitReturn<TSubmitReturn>
      >
    : never

/**
 * Type-only helper for declaring a child element's form property from shared
 * `formOptions`. It intentionally has no runtime value.
 */
export function getFormType<TOptions extends AnyFormOptions>(
  _formOptions: TOptions,
): LitFormType<TOptions> {
  return undefined as never
}
