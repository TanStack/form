import { errorsHidden } from './errorsHidden'
import { schemaErrorOnUnmountedField } from './schemaErrorOnUnmountedField'
import { serverErrorOnUnmountedField } from './serverErrorOnUnmountedField'
import type { FieldErrorDebugCase, FieldErrorDebugCaseContext } from './types'
import type { FieldErrorDebugSuspicion } from '../../../eventClientTypes'

export type { FieldErrorDebugCase, FieldErrorDebugCaseContext } from './types'

/**
 * The order of these cases is important.
 * They are evaluated in order, and the first one that matches will be used.
 *
 * The most specific cases should be first.
 */
export const fieldErrorDebugCases = [
  schemaErrorOnUnmountedField,
  serverErrorOnUnmountedField,
  errorsHidden,
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
