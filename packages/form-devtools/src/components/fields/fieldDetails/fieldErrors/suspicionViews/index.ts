import { getSchemaErrorOnUnmountedFieldDetails } from './schemaErrorOnUnmountedField'
import type { FieldErrorDebugDetails } from './types'
import type { FieldErrorDebugSuspicion } from '@/eventClientTypes'

export type { FieldErrorDebugDetails } from './types'

export function getFieldErrorDebugDetails(
  suspicion: FieldErrorDebugSuspicion,
): FieldErrorDebugDetails {
  return getSchemaErrorOnUnmountedFieldDetails(suspicion)
}
