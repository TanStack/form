import { batch } from '@tanstack/store'
import { resolveDefaultOptions } from '../defaultOptions.lib'
import { devtools } from '../devtoolsBridge.lib'
import { visitAllFormFields } from '../FieldApi/fieldTraversal.lib'
import { evaluate, getBy, setBy } from '../utils.lib'
import { applyServerState } from './formServerState.lib'
import type { AnyInternalFormApi, InternalFormApi } from './FormApi.lib'
import type { FormValidator } from '../pipeline/validation/formValidators.public'
import type { ValidatorTriggers } from '../pipeline/events.public'
import type { StandardSchemaV1 } from '../validation/results/standardSchema.public'
import type { FormOptions } from './formOptions.public'
import type { FormListeners } from '../pipeline/listeners/formListeners.public'
import type {
  FormOptionsOnSubmitFn,
  FormOptionsOnSubmitInvalidFn,
} from './formSubmit.public'

type InternalFormValidator<TFormData> = Omit<
  FormValidator<TFormData, ValidatorTriggers | boolean>,
  'run'
> & {
  run: StandardSchemaV1<any, any> | ((context: any) => any)
}

// Funky form options are cool and all, but just using `any` killed our type inference internally.
// This is hacky, but it should do.
export type FormOptionsOfType<TFormData> = Omit<
  FormOptions<TFormData, any, any, any, any>,
  'validators' | 'listeners' | 'onSubmit' | 'onSubmitInvalid'
> & {
  validators?: ReadonlyArray<InternalFormValidator<NoInfer<TFormData>>>
  listeners?: FormListeners<NoInfer<TFormData>, any>
  onSubmit?: FormOptionsOnSubmitFn<NoInfer<TFormData>, any, any>
  onSubmitInvalid?: FormOptionsOnSubmitInvalidFn<NoInfer<TFormData>, any>
}
export type InternalFormOptions<TFormData> = FormOptionsOfType<TFormData> & {
  formId: string
}

// This scales with the amount of top-level fields, with the setter operation
// scaling with the amount of touched fields.

// It assumes that by the time async defaultValues come in, not many fields have been touched.
// If they were, they're likely in the same section.
function applyDefaultValuesForUntouchedFields<TFormData>(
  currentValues: TFormData,
  defaultValues: TFormData,
  form: AnyInternalFormApi,
): TFormData {
  let nextValues = defaultValues

  for (const field of form._fieldRootNode._children) {
    if (field.meta.isTouched) {
      nextValues = setBy(
        nextValues,
        field.name,
        getBy(currentValues, field.name),
      )
    }
  }

  return nextValues
}

function notifyDevtoolsDefaultValuesUpdate(form: AnyInternalFormApi): void {
  const updateField = devtools().updateField
  if (!updateField) return

  visitAllFormFields(form._fieldRootNode, (current) => updateField(current))
}

/**
 * Manages the incoming options to change the form state if needed.
 *
 * Rough work includes:
 * - Async default values
 * - Server state changing (from something like useActionState)
 * - updating listeners and validators
 */
export function updateFormOptions<TFormData>(
  form: InternalFormApi<TFormData>,
  options: FormOptionsOfType<TFormData>,
): void {
  batch(() => {
    const resolvedOptions = resolveDefaultOptions(
      options,
      form._defaultOptions?.form,
    )
    const oldOptions = form._options
    const didDefaultValuesChange = !evaluate(
      resolvedOptions.defaultValues,
      form._lastUpdateDefaultValues,
    )

    form._lastUpdateDefaultValues = resolvedOptions.defaultValues
    form._defaultValueCache = null
    form._options = {
      ...resolvedOptions,
      defaultValues: didDefaultValuesChange
        ? resolvedOptions.defaultValues
        : oldOptions.defaultValues,
      formId: resolvedOptions.formId ?? oldOptions.formId,
    }

    form._updateInstances(oldOptions)

    if (didDefaultValuesChange) {
      batch(() => {
        const previousValues = form._atoms.values.get()
        form._atoms.defaultValuesVersion.set((version) => version + 1)

        if (form._atoms.meta.touchedFieldCount.get() === 0) {
          form._atoms.values.set(resolvedOptions.defaultValues)
        } else {
          form._atoms.values.set((prev) =>
            applyDefaultValuesForUntouchedFields(
              prev,
              resolvedOptions.defaultValues,
              form,
            ),
          )
        }
        form._cancelChangedValidation(previousValues)
      })
    }

    applyServerState(
      form,
      form._options.serverState ?? null,
      resolvedOptions.defaultValues,
    )
    if (didDefaultValuesChange) notifyDevtoolsDefaultValuesUpdate(form)
    devtools().updateForm?.(form)
  })
}
