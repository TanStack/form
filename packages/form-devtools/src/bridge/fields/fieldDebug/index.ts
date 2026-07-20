import { schemaErrorsOnUnmountedDescendants } from './schemaErrorsOnUnmountedDescendants'
import { validatorsWithoutTriggers } from './validatorsWithoutTriggers'
import type { FieldDebugCase, FieldDebugCaseContext } from './types'
import type { FieldDebugSuspicion } from '../../../eventClientTypes'

export type { FieldDebugCase } from './types'

const fieldDebugCases = [
  schemaErrorsOnUnmountedDescendants,
  validatorsWithoutTriggers,
] satisfies ReadonlyArray<FieldDebugCase>

export function getFieldDebugSuspicions(
  context: FieldDebugCaseContext,
  cases: ReadonlyArray<FieldDebugCase> = fieldDebugCases,
): Array<FieldDebugSuspicion> {
  if (
    !context.field._isMounted ||
    context.field.state.meta.original.errors.length > 0
  ) {
    return []
  }

  const suspicions: Array<FieldDebugSuspicion> = []

  for (const debugCase of cases) {
    const suspicion = debugCase.evaluate(context)
    if (suspicion) suspicions.push(suspicion)
  }

  return suspicions
}
