import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type { ValidationTrigger } from '../validation.public'

/**
 * Minimal contract retained by the base field/form runtime for optional groups.
 */
export interface InternalFormGroupRuntime {
  readonly _submissionAttempts: number
  _reset: () => void
  _validate: (
    event: Exclude<ValidationTrigger, 'submit'>,
    triggerFieldApi?: AnyInternalFieldApi,
  ) => Promise<unknown>
}
