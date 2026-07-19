import { tooSpecificSchemaPath } from './tooSpecificSchemaPath'
import type { FieldErrorDebugCase } from './types'

export type {
  FieldErrorDebugCase,
  FieldErrorDebugCaseContext,
  FieldErrorDebugDetails,
} from './types'

export const fieldErrorDebugCases = [
  tooSpecificSchemaPath,
] satisfies ReadonlyArray<FieldErrorDebugCase>
