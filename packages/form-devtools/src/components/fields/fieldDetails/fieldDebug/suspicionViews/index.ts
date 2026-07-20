import { getSchemaErrorsOnUnmountedDescendantsDetails } from './schemaErrorsOnUnmountedDescendants'
import { getValidatorsWithoutTriggersDetails } from './validatorsWithoutTriggers'
import type { DebugDetails } from '../../debug/types'
import type { FieldDebugSuspicion } from '@/eventClientTypes'

export function getFieldDebugDetails(
  suspicion: FieldDebugSuspicion,
): DebugDetails {
  switch (suspicion.kind) {
    case 'schema-errors-on-unmounted-descendants':
      return getSchemaErrorsOnUnmountedDescendantsDetails(suspicion)
    case 'validators-without-triggers':
      return getValidatorsWithoutTriggersDetails(suspicion)
  }
}
