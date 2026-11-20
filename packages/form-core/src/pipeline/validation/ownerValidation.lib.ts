import { batch } from '@tanstack/store'
import {
  createInitialFormState,
  getInitialFormValues,
} from '../../FormApi/initialFormState.lib'
import { validationSourceScopes } from '../../validation/errorStorage.lib'
import { startClientValidation } from './clientValidation.lib'
import {
  createFieldValidatorContext,
  createFormClientValidatorContext,
  createFormMountValidatorContext,
  createGroupValidatorContext,
} from './validationContext.lib'
import type {
  ClientValidationOptions,
  ClientValidationRun,
} from './clientValidation.lib'
import type { ClientValidationTrigger } from './validation.public'
import type {
  AnyInternalFieldApi,
  InternalFieldValidatorInstance,
} from '../../FieldApi/FieldApi.lib'
import type {
  AnyInternalFormApi,
  InternalFormApi,
  InternalFormValidatorInstance,
} from '../../FormApi/FormApi.lib'
import type { ServerFormState } from '../../FormApi/formServerState.public'
import type {
  AnyInternalFormGroupApi,
  InternalGroupValidatorInstance,
} from '../../FormGroupApi/FormGroupApi.lib'
import type { SubmissionAttempt } from '../../submissionAttempt.lib'
import type { FieldApiOverrideOptions } from '../../types.lib'
import type { Awaitable } from '../../types.public'
import type { ClientSideEvents } from '../events.public'
import type { ValidationRunTracker } from '../runTracker.lib'

export interface FieldValidationOptions {
  catchErrors: boolean
  onResult?: boolean
  submission?: SubmissionAttempt
  watchedFieldName?: string
  onRegister?: (
    run: ClientValidationRun<InternalFieldValidatorInstance>,
  ) => () => void
  _invalidateOnChange?: boolean
}

export interface FormValidationOptions extends FieldApiOverrideOptions {
  catchErrors: boolean
  onResult?: boolean
  hasFailedBefore?: boolean
  submission?: SubmissionAttempt
}

interface FormMountValidationOptions<TFormData> {
  defaultValues: TFormData
  serverState?: ServerFormState<NoInfer<TFormData>> | null
  validators: ReadonlyArray<InternalFormValidatorInstance> | null
  tracker: ValidationRunTracker
}

interface FormMountValidation<TFormData> {
  initialState: ReturnType<typeof createInitialFormState<TFormData>>
  complete: (form: InternalFormApi<TFormData>) => void
  cancel: () => void
}

export interface GroupValidationOptions {
  catchErrors: boolean
  triggerFieldApi?: AnyInternalFieldApi
  upstreamInvalid?: Awaitable<boolean>
  submission?: SubmissionAttempt
}

export function startFieldValidation(
  field: AnyInternalFieldApi,
  tracker: ValidationRunTracker | null,
  event: 'mount' | 'change' | 'blur' | 'submit',
  options: FieldValidationOptions,
): ClientValidationRun<InternalFieldValidatorInstance> | undefined {
  const applyResults = options.onResult !== false
  const snapshot = options.submission?.fieldsToValidate.get(field)

  let validators: InternalFieldValidatorInstance[] | null = null
  if (snapshot) {
    validators = snapshot.validators
  } else if (!field._isKilled) {
    validators = field._validatorInstances
  }

  const invalidate =
    applyResults && event === 'change' && options._invalidateOnChange

  const runOptions: ClientValidationOptions<InternalFieldValidatorInstance> = {
    catchErrors: options.catchErrors,
    tracker,
    validators,
    event,
    watchedFieldName: options.watchedFieldName,
    onRegister: options.onRegister,
    submission: options.submission,
    createPredicateContext: () => ({
      scope: 'field',
      fieldApi: field,
      formApi: field.form,
      value: snapshot ? snapshot.value : field.value,
    }),
    createContext: (definition, signal) =>
      createFieldValidatorContext(definition, {
        event,
        signal,
        value: snapshot ? snapshot.value : field.value,
        fieldApi: field,
        formApi: field.form,
      }),
    onPending: () => {
      field._setValidationCount((count) => count + 1)
      return () => field._setValidationCount((count) => Math.max(0, count - 1))
    },
  }

  if (invalidate) {
    runOptions.onSelected = (selected) => {
      return field._clearStaleErrors((instance) => !selected.has(instance))
    }
    runOptions.onSkip = (skipped) => {
      return field._clearStaleErrors((instance) => instance === skipped)
    }
  }

  if (applyResults) {
    runOptions.applyResult = (result) => {
      return field._processValidationResult(result, event)
    }
  }

  return startClientValidation(runOptions)
}

export function startFormMountValidation<TFormData>(
  options: FormMountValidationOptions<TFormData>,
): FormMountValidation<TFormData> {
  const value = getInitialFormValues(options.defaultValues, options.serverState)
  let form: InternalFormApi<TFormData> | undefined
  let hasPendingMount = false
  let run: ClientValidationRun<InternalFormValidatorInstance> | undefined
  if (options.validators) {
    run = startClientValidation({
      catchErrors: true,
      tracker: options.tracker,
      validators: options.validators,
      event: 'mount',
      createPredicateContext: () => ({ value }),
      createContext: (definition) =>
        createFormMountValidatorContext(definition, { value }),
      applyResult: (result) => {
        // Initial results are merged before any field targets exist.
        form?._applyValidationResult({
          sourceOrIndex: result.instance,
          result: result.value.result,
          sourceEvent: 'mount',
        })
      },
      onPending: () => {
        hasPendingMount = true
        return () => {
          hasPendingMount = false
          form?._setValidationCount((count) => Math.max(0, count - 1))
        }
      },
    })
  }

  try {
    const initialState = createInitialFormState({
      values: value,
      defaultValues: options.defaultValues,
      serverState: options.serverState,
      mountResults: run?.syncResults,
      hasPendingMount,
    })

    return {
      initialState,
      complete: (initializedForm) => {
        form = initializedForm
        try {
          batch(() => {
            for (const result of initialState.validationResults) {
              initializedForm._applyValidationResult({
                sourceOrIndex: result.validatorIndex,
                result: result.result,
                sourceEvent: result.sourceEvent,
              })
            }
          })
        } catch (error) {
          run?.cancel()
          throw error
        }
      },
      cancel: () => run?.cancel(),
    }
  } catch (error) {
    run?.cancel()
    throw error
  }
}

export function startFormValidation(
  form: AnyInternalFormApi,
  tracker: ValidationRunTracker,
  event: ClientSideEvents,
  options: FormValidationOptions,
): ClientValidationRun<InternalFormValidatorInstance> | undefined {
  const applyResults = options.onResult !== false
  const invalidate = event === 'change' && applyResults
  const runOptions: ClientValidationOptions<InternalFormValidatorInstance> = {
    catchErrors: options.catchErrors,
    tracker,
    validators: options.submission
      ? (options.submission
          .validators as Array<InternalFormValidatorInstance> | null)
      : form._validatorInstances,
    event,
    upstreamInvalid: options.hasFailedBefore,
    submission: options.submission,
    createPredicateContext: () => ({
      scope: 'form',
      formApi: form,
      fieldApi: options.fieldApiOverride ?? undefined,
      value: options.submission
        ? options.submission.value
        : form._atoms.values.get(),
    }),
    createContext: (definition, signal) =>
      createFormClientValidatorContext(definition, {
        event,
        value: options.submission
          ? options.submission.value
          : form._atoms.values.get(),
        signal,
        formApi: form,
        triggerFieldApi: options.fieldApiOverride ?? undefined,
      }),
    onPending: () => {
      form._setValidationCount((count) => count + 1)
      return () => form._setValidationCount((count) => Math.max(0, count - 1))
    },
  }

  if (invalidate) {
    runOptions.onSelected = (selected) => {
      form._clearStaleErrors(
        options.fieldApiOverride ?? null,
        true,
        (source) => {
          return (
            source.scope === validationSourceScopes.form &&
            !selected.has(source)
          )
        },
      )
    }
    runOptions.onSkip = (instance) =>
      form._clearStaleErrors(
        options.fieldApiOverride ?? null,
        true,
        (source) => source === instance,
      )
  }

  if (applyResults) {
    runOptions.applyResult = (result) =>
      form._applyValidationResult({
        sourceOrIndex: result.instance,
        result: result.value.result,
        sourceEvent: event,
      })
  }

  return startClientValidation(runOptions)
}

export function startGroupValidation(
  group: AnyInternalFormGroupApi,
  tracker: ValidationRunTracker,
  event: ClientValidationTrigger | 'mount',
  options: GroupValidationOptions,
): ClientValidationRun<InternalGroupValidatorInstance> | undefined {
  const groupField = group._groupField
  const invalidate = event === 'change'
  const runOptions: ClientValidationOptions<InternalGroupValidatorInstance> = {
    catchErrors: options.catchErrors,
    tracker,
    validators: options.submission
      ? (options.submission
          .validators as Array<InternalGroupValidatorInstance> | null)
      : group._validatorInstances,
    event,
    upstreamInvalid: options.upstreamInvalid,
    submission: options.submission,
    createPredicateContext: () => ({
      scope: 'group',
      formApi: group.form,
      fieldApi: options.triggerFieldApi,
      groupApi: group,
      value: options.submission ? options.submission.value : group.value,
    }),
    createContext: (definition, signal) =>
      createGroupValidatorContext(definition, {
        event,
        formApi: group.form,
        groupApi: group,
        triggerFieldApi: options.triggerFieldApi,
        value: options.submission ? options.submission.value : group.value,
        signal,
      }),
    applyResult: (result) => group._processValidationResult(result, event),
    onPending: () => {
      groupField._setValidationCount((count) => count + 1)
      return () =>
        groupField._setValidationCount((count) => Math.max(0, count - 1))
    },
  }

  if (invalidate) {
    runOptions.onSelected = (selected) =>
      group.form._clearStaleErrors(
        options.triggerFieldApi ?? groupField,
        true,
        (source) =>
          source.scope === validationSourceScopes.group &&
          source.owner === group &&
          !selected.has(source),
      )

    if (options.triggerFieldApi) {
      runOptions.onSkip = (instance) =>
        group.form._clearStaleErrors(
          options.triggerFieldApi!,
          true,
          (source) => source === instance,
        )
    }
  }

  return startClientValidation(runOptions)
}
