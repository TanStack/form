import { getSchemaErrorsOnUnmountedDescendantsDetails } from './schemaErrorsOnUnmountedDescendants'
import type { DebugDetails } from '../../debug/types'
import type { FieldDebugSuspicion } from '@/eventClientTypes'

export function getFieldDebugDetails(
  suspicion: FieldDebugSuspicion,
): DebugDetails {
  return getSchemaErrorsOnUnmountedDescendantsDetails(suspicion)
}
