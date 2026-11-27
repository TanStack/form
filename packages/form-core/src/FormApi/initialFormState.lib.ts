import type { ServerFormState } from './formServerState.public'
import type { FormValidationResult } from '../validation/results/results.public'

// Constructor seeds combine formatted server results with raw mount results.
export interface InitialFormValidationResult<TFormData> {
  validatorIndex: number
  result: FormValidationResult<TFormData>
  sourceEvent: 'server' | 'mount'
}

export interface InitialFormMeta {
  isDirty: boolean
  touchedFieldCount: number
  fieldValidationCount: number
  validationCount: number
  isSubmitting: boolean
  isSubmitSuccessful: boolean
  submissionAttempts: number
}

export interface InitialFormStateOptions<TFormData> {
  /** The initial value snapshot already supplied to mount validation. */
  values: TFormData
  defaultValues: NoInfer<TFormData>
  serverState?: ServerFormState<NoInfer<TFormData>> | null
  /** Only the mount run's initial syncResults batch belongs here. */
  mountResults?: ReadonlyArray<{
    instance: { index: number }
    value: { result: FormValidationResult<TFormData> }
  }>
  hasPendingMount?: boolean
}

/** Selects the value snapshot before mount validation starts. */
export function getInitialFormValues<TFormData>(
  defaultValues: TFormData,
  serverState?: ServerFormState<NoInfer<TFormData>> | null,
): TFormData {
  return serverState?.values ?? defaultValues
}

/** Builds scalar atom seeds and unprocessed results for later runtime binding. */
export function createInitialFormState<TFormData>({
  values,
  defaultValues,
  serverState,
  mountResults = [],
  hasPendingMount = false,
}: InitialFormStateOptions<TFormData>) {
  const results = new Map<number, InitialFormValidationResult<TFormData>>()

  for (const result of serverState?.validationResults ?? []) {
    results.set(result.validatorIndex, {
      validatorIndex: result.validatorIndex,
      result: result.result,
      sourceEvent: 'server',
    })
  }

  for (const { instance, value } of mountResults) {
    results.set(instance.index, {
      validatorIndex: instance.index,
      result: value.result,
      sourceEvent: 'mount',
    })
  }

  const meta: InitialFormMeta = {
    isDirty: false,
    touchedFieldCount: 0,
    fieldValidationCount: 0,
    validationCount: hasPendingMount ? 1 : 0,
    isSubmitting: false,
    isSubmitSuccessful: false,
    submissionAttempts: serverState?.submissionAttempts ?? 0,
  }

  return {
    values,
    defaultValues,
    meta,
    resetVersion: 0,
    defaultValuesVersion: 0,
    validationResults: Array.from(results.values()).sort(
      (left, right) => left.validatorIndex - right.validatorIndex,
    ),
  }
}
