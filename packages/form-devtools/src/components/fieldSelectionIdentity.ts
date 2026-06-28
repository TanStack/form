import type { DevtoolsMountedFieldSummary } from '../stores/eventClientTypes'

export interface FieldSelectionIdentity {
  fieldId: string
  path: string
}

export function createFieldSelectionIdentity(
  field: Pick<DevtoolsMountedFieldSummary, 'fieldId' | 'path'>,
): FieldSelectionIdentity {
  return {
    fieldId: field.fieldId,
    path: field.path,
  }
}

export function areFieldSelectionIdentitiesEqual(
  left: FieldSelectionIdentity | null,
  right: FieldSelectionIdentity | null,
) {
  if (left === null || right === null) return left === right

  return left.fieldId === right.fieldId && left.path === right.path
}

export function areFieldSelectionIdentityArraysEqual(
  left: ReadonlyArray<FieldSelectionIdentity>,
  right: ReadonlyArray<FieldSelectionIdentity>,
) {
  return (
    left.length === right.length &&
    left.every((identity, index) =>
      areFieldSelectionIdentitiesEqual(identity, right[index] ?? null),
    )
  )
}

export function resolveFieldSelectionIdentity(
  fields: ReadonlyArray<DevtoolsMountedFieldSummary>,
  identity: FieldSelectionIdentity,
): FieldSelectionIdentity | null {
  const fieldById = fields.find((field) => field.fieldId === identity.fieldId)
  if (fieldById) return createFieldSelectionIdentity(fieldById)

  const fieldByPath = fields.find((field) => field.path === identity.path)
  if (fieldByPath) return createFieldSelectionIdentity(fieldByPath)

  return null
}

export function resolveFieldSelectionIdentities(
  fields: ReadonlyArray<DevtoolsMountedFieldSummary>,
  identities: ReadonlyArray<FieldSelectionIdentity>,
): Array<FieldSelectionIdentity> {
  const nextIdentities: Array<FieldSelectionIdentity> = []
  const seenFieldIds = new Set<string>()
  const seenPaths = new Set<string>()

  for (const identity of identities) {
    const resolvedIdentity =
      resolveFieldSelectionIdentity(fields, identity) ?? identity

    if (
      seenFieldIds.has(resolvedIdentity.fieldId) ||
      seenPaths.has(resolvedIdentity.path)
    ) {
      continue
    }

    seenFieldIds.add(resolvedIdentity.fieldId)
    seenPaths.add(resolvedIdentity.path)
    nextIdentities.push(resolvedIdentity)
  }

  return nextIdentities
}
