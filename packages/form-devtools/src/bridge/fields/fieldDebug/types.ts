import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { FieldDebugSuspicion } from '../../../eventClientTypes'

/** The field is mounted, live, and has no errors of its own. */
export interface FieldDebugCaseContext {
  field: AnyInternalFieldApi
}

export interface FieldDebugCase {
  evaluate: (context: FieldDebugCaseContext) => FieldDebugSuspicion | undefined
}
