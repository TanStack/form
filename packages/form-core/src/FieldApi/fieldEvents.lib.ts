import { batch } from '@tanstack/store'
import { runFieldListenerPipeline } from '../pipeline/listeners/listeners.lib'
import { visitFieldAndAncestors } from './fieldTraversal.lib'
import type { AnyInternalFieldApi } from './FieldApi.lib'
import type { AnyInternalFormApi } from '../FormApi/FormApi.lib'
import type { AnyInternalFormGroupApi } from '../FormGroupApi/FormGroupApi.lib'
import type { ClientSideEvents } from '../pipeline/events.public'
import type { FieldListenerTriggers } from '../pipeline/listeners/listeners.public'
import type { FieldEventOptions } from '../types.lib'

export interface NotifyFieldListenerOptions {
  trigger: FieldListenerTriggers
  seenFields: WeakSet<AnyInternalFieldApi>
  watchedFieldName?: string
}

export interface NotifyFieldValidatorOptions {
  trigger: ClientSideEvents
  seenFields: WeakSet<AnyInternalFieldApi>
  watchedFieldName?: string
}

/**
 * Starts validation for a field and its ancestors, notifies their watching
 * validators, then starts validation for the containing form group or form.
 *
 * Returns without waiting for asynchronous validation. Validation failures are
 * reported to the console.
 */
export function triggerValidationFromField(
  field: AnyInternalFieldApi,
  event: ClientSideEvents,
  group: AnyInternalFormGroupApi | null,
): void {
  if (field._isKilled) return

  const seenValidatorFields = new WeakSet<AnyInternalFieldApi>()

  visitFieldAndAncestors(field, (current, stop) => {
    if (current._isKilled) return stop

    current._runFieldValidation(event, {
      catchErrors: true,
      _invalidateOnChange: event === 'change',
    })
    current._notifyValidator({
      trigger: event,
      seenFields: seenValidatorFields,
    })

    if (current === group?._groupField) return stop
    return
  })

  if (group) {
    void group
      .validate(event, { triggerFieldApi: field })
      .catch((error) => console.error(error))
  } else {
    void field.form
      .validate(event, { fieldApiOverride: field })
      .catch((error) => console.error(error))
  }
}

/**
 * Handles various field-related actions like
 * - changing meta
 * - notifying validators
 * - notifying listeners
 *
 * Fine-tune with the given options object.
 */
export function handleFieldEvent(
  field: AnyInternalFieldApi,
  options: FieldEventOptions,
  event: 'change' | 'blur' | 'submit',
): void {
  if (field._isKilled) return

  const group = field._getFormGroup()

  const {
    markAsDirty,
    markAsTouched,
    causeValidation,
    markAsBlurred,
    notifyParentFields,
  } = options

  batch(() => {
    const seenListenerFields = new WeakSet<AnyInternalFieldApi>()

    visitFieldAndAncestors(field, (currNode, stop) => {
      const isOriginalField = currNode === field
      const { isSelfDirty, isSelfTouched, isBlurred } = currNode.meta
      const shouldUpdateDirty = isOriginalField && markAsDirty && !isSelfDirty
      const shouldUpdateTouched =
        isOriginalField && markAsTouched && !isSelfTouched

      const shouldUpdateBlurred = markAsBlurred && !isBlurred

      if (shouldUpdateDirty || shouldUpdateTouched || shouldUpdateBlurred) {
        currNode._setMeta((prev) => ({
          ...prev,
          isTouched: shouldUpdateTouched ? true : prev.isTouched,
          isDirty: shouldUpdateDirty ? true : prev.isDirty,
          isBlurred: markAsBlurred ? true : prev.isBlurred,
        }))
      }

      currNode._notifyListener({
        trigger: event,
        seenFields: seenListenerFields,
      })

      if (!notifyParentFields) return stop
      // The group's backing field needs the update too,
      // so keep this check at the end and not the start
      if (currNode === group?._groupField) return stop
      return undefined
    })
  })

  if (event === 'change') {
    field.form._clearStaleErrors(field, causeValidation)
  }

  if (causeValidation) {
    field._triggerValidationFromField(event, group)
  }

  // TODO group listeners
  if (event !== 'submit' && !group) {
    field.form._notifyFormListener(event, field)
  }
}

/**
 * Start listeners of this field and watching fields.
 *
 * `watchedFieldName` limits execution to listeners watching that path.
 */
export function notifyFieldListener(
  field: AnyInternalFieldApi,
  { trigger, seenFields, watchedFieldName }: NotifyFieldListenerOptions,
): void {
  if (field._isKilled) return

  // Field A listens to Field B listens to field A
  // FieldA.notifyListener -> fieldB.notifyListener -> fieldA.notifyLister
  if (seenFields.has(field)) {
    console.warn(
      `Field listener: cyclical listener cycle detected. Check around the field ${field.name}`,
    )
    return
  }

  seenFields.add(field)

  if (field._listenerInstances) {
    runFieldListenerPipeline({
      pipeline: field._listenerInstances,
      context: {
        event: trigger,
        fieldApi: field,
        formApi: field.form,
      },
      watchedFieldName,
    })
  }

  // Listener callbacks can dispose this field after the initial check.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!field._isKilled) {
    notifyWatchingFieldListeners(field.form, field.name, trigger, seenFields)
  }
}

/**
 * Forwards an event to live fields with listeners watching `sourceFieldName`.
 *
 * @param sourceFieldName - Full form path of the field that reported the event.
 */
function notifyWatchingFieldListeners(
  form: AnyInternalFormApi,
  sourceFieldName: string,
  trigger: FieldListenerTriggers,
  seenFields: WeakSet<AnyInternalFieldApi>,
): void {
  const watchingFields = form._watchingListenerFields.get(sourceFieldName)
  for (const watchingField of watchingFields ?? []) {
    if (!watchingField._isKilled) {
      watchingField._notifyListener({
        trigger,
        seenFields,
        watchedFieldName: sourceFieldName,
      })
    }
  }
}

export function notifyFieldValidator(
  field: AnyInternalFieldApi,
  { trigger, seenFields, watchedFieldName }: NotifyFieldValidatorOptions,
): void {
  if (field._isKilled) return

  if (seenFields.has(field)) {
    console.warn(
      `Field validator: cyclical validator cycle detected. Check around the field ${field.name}`,
    )
    return
  }

  seenFields.add(field)

  if (field._validatorInstances && watchedFieldName !== undefined) {
    field._runFieldValidation(trigger, {
      catchErrors: true,
      watchedFieldName,
    })
  }

  // Result subscribers can dispose this field after the initial check.
  if (!(field._isKilled as boolean)) {
    notifyWatchingFieldValidators(field.form, field.name, trigger, seenFields)
  }
}

/**
 * Forwards an event to live fields with validators watching `sourceFieldName`.
 *
 * @param sourceFieldName - Full form path of the field that reported the event.
 * @param seenFields - Shared set of fields already notified for this event.
 */
function notifyWatchingFieldValidators(
  form: AnyInternalFormApi,
  sourceFieldName: string,
  trigger: ClientSideEvents,
  seenFields: WeakSet<AnyInternalFieldApi>,
): void {
  const watchingFields = form._watchingValidatorFields.get(sourceFieldName)
  for (const watchingField of watchingFields ?? []) {
    if (!watchingField._isKilled) {
      watchingField._notifyValidator({
        trigger,
        seenFields,
        watchedFieldName: sourceFieldName,
      })
    }
  }
}
