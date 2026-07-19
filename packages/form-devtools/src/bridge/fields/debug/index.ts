import { schemaErrorOnUnmountedField } from './schemaErrorOnUnmountedField'
import type { FieldErrorDebugCase, FieldErrorDebugCaseContext } from './types'
import type { FieldErrorDebugSuspicion } from '../../../eventClientTypes'

export type { FieldErrorDebugCase, FieldErrorDebugCaseContext } from './types'

export const fieldErrorDebugCases = [
  schemaErrorOnUnmountedField,
] satisfies ReadonlyArray<FieldErrorDebugCase>

export function getFieldErrorDebugSuspicions(
  context: FieldErrorDebugCaseContext,
  cases: ReadonlyArray<FieldErrorDebugCase> = fieldErrorDebugCases,
): Array<FieldErrorDebugSuspicion> {
  const suspicions: Array<FieldErrorDebugSuspicion> = []

  for (const debugCase of cases) {
    const suspicion = debugCase.evaluate(context)
    if (suspicion) suspicions.push(suspicion)
  }

  return suspicions
}
