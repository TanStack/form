import type { ServerSideEvents } from '../events.public'
// TODO finalize migration
import type { FormValidateResultFromErrorTypes } from '../validation.public'
import type {
  GetFormErrorTypes,
  ScopedErrorTypes,
  ToFormErrorTypes,
} from '../validation/state.public'

type ServerValidator<TValidator> = unknown extends TValidator
  ? TValidator
  : TValidator extends { triggers?: ReadonlyArray<infer TTrigger> }
    ? Extract<
        TTrigger,
        ServerSideEvents | { trigger: ServerSideEvents }
      > extends never
      ? never
      : TValidator
    : never

type ServerValidators<TValidators> =
  TValidators extends ReadonlyArray<unknown>
    ? Array<ServerValidator<TValidators[number]>>
    : TValidators

type ServerFormErrorTypes<TValidators> = unknown extends TValidators
  ? ScopedErrorTypes
  : GetFormErrorTypes<ServerValidators<TValidators>, never>

export interface ServerFormState<TFormData, TValidators> {
  values: TFormData | undefined
  validationResults: Array<{
    validatorIndex: number
    result: FormValidateResultFromErrorTypes<
      TFormData,
      ToFormErrorTypes<ServerFormErrorTypes<TValidators>>
    >
    output: unknown | null
    hasOutput?: boolean
  }>
  submissionAttempts: number
}
