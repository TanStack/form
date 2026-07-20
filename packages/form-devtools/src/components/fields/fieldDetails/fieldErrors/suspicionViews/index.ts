import { getSchemaErrorOnUnmountedFieldDetails } from './schemaErrorOnUnmountedField'
import { getServerErrorOnUnmountedFieldDetails } from './serverErrorOnUnmountedField'
import type { FieldErrorDebugDetails } from './types'
import type { FieldErrorDebugSuspicion } from '@/eventClientTypes'

export type { FieldErrorDebugDetails } from './types'

export function getFieldErrorDebugDetails(
  suspicion: FieldErrorDebugSuspicion,
): FieldErrorDebugDetails {
  switch (suspicion.kind) {
    case 'server-error-on-unmounted-field':
      return getServerErrorOnUnmountedFieldDetails(suspicion)
    case 'schema-error-on-unmounted-field':
      return getSchemaErrorOnUnmountedFieldDetails(suspicion)
  }
}
