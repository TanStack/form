import {
  createFormContext,
  fieldComponentFactory,
  prepareFormComponent,
} from './helperFactories.lib'
import type { FieldComponentHelper } from './fieldComponent.public'
import type { FormComponentHelper } from './formComponent.public'
import type { FormContextHelper } from './formContext.public'

/**
 * Prepares reusable components for registration with `createFormHook`.
 *
 * Obtain these helpers from {@link getFormHookHelpers}.
 */
export interface FormHookHelpers {
  /**
   * Prepares field components with value-type matching and optional field API
   * injection. Register the results in `createFormHook`'s `fieldComponents`.
   */
  fieldComponent: FieldComponentHelper
  formComponent: FormComponentHelper
  formContext: FormContextHelper
}

export function getFormHookHelpers(): FormHookHelpers {
  return {
    formComponent: { create: prepareFormComponent },
    formContext: { create: createFormContext },
    fieldComponent: {
      loose: fieldComponentFactory,
      strict: fieldComponentFactory,
    } as FieldComponentHelper,
  }
}
