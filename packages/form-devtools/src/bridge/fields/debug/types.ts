import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type {
  DevtoolsFieldError,
  FieldErrorDebugSuspicion,
} from '../../../eventClientTypes'

export interface FieldErrorDebugCaseContext {
  field: AnyInternalFieldApi
  error: DevtoolsFieldError
}

export interface FieldErrorDebugCase {
  evaluate: (
    context: FieldErrorDebugCaseContext,
  ) => FieldErrorDebugSuspicion | undefined
}
