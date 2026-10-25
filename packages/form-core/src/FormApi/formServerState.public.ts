import type { ServerSideEvents } from '../events.public'
import type { FormValidationResult } from '../validation/state.public'
import type { GetValidatorOutputs } from './formSubmit.public'

export const initialServerFormState: ServerFormState<any> = {
  values: undefined,
  validationResults: [],
  submissionAttempts: 0,
}

export interface ServerFormState<TFormData> {
  values: TFormData | undefined
  validationResults: Array<{
    validatorIndex: number
    result: FormValidationResult<TFormData>
    output: unknown | null
    hasOutput?: boolean
  }>
  submissionAttempts: number
}

type SkipServerTrigger<TTrigger> = TTrigger extends ServerSideEvents
  ? false
  : TTrigger extends { trigger: ServerSideEvents; when: infer TWhen }
    ? TWhen extends true
      ? false
      : true
    : never

type ServerOutputValidators<TValidators extends ReadonlyArray<unknown>> = {
  [K in keyof TValidators]: TValidators[K] extends {
    triggers?: ReadonlyArray<infer TTrigger>
  }
    ? [SkipServerTrigger<TTrigger>] extends [never]
      ? undefined
      : Omit<TValidators[K], 'skipOnSubmit'> & {
          skipOnSubmit: SkipServerTrigger<TTrigger>
        }
    : undefined
}

type ServerValidatorOutputs<TValidators> = unknown extends TValidators
  ? Array<unknown>
  : TValidators extends ReadonlyArray<unknown>
    ? GetValidatorOutputs<ServerOutputValidators<TValidators>>
    : []

export interface ServerValidateSuccess<TFormData, TValidators> {
  success: true
  values: TFormData
  validatorOutputs: ServerValidatorOutputs<TValidators>
}

export interface ServerValidateFailure<TFormData> {
  success: false
  serverState: ServerFormState<TFormData>
}

export type ServerValidateResult<TFormData, TValidators> =
  | ServerValidateSuccess<TFormData, TValidators>
  | ServerValidateFailure<TFormData>
