import { nameToFieldNodeSegments } from '@tanstack/form-core/internals'
import type { BroadcastMountedFieldSummary } from '../eventClientTypes'
import type { DevtoolsMountedFieldSummary } from './eventClientTypes'

interface MountedFieldRename {
  previousPath: string
  field: BroadcastMountedFieldSummary
}

function comparePathSegments(
  left: string | number,
  right: string | number,
): number {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }

  if (typeof left === 'number') return -1
  if (typeof right === 'number') return 1

  if (left < right) return -1
  if (left > right) return 1
  return 0
}

export function compareMountedFieldPaths(leftPath: string, rightPath: string) {
  const leftSegments = nameToFieldNodeSegments(leftPath)
  const rightSegments = nameToFieldNodeSegments(rightPath)
  const maxLength = Math.max(leftSegments.length, rightSegments.length)

  for (let i = 0; i < maxLength; i++) {
    const left = leftSegments[i]
    const right = rightSegments[i]

    if (left === undefined) return -1
    if (right === undefined) return 1

    const segmentOrder = comparePathSegments(left, right)
    if (segmentOrder !== 0) return segmentOrder
  }

  return 0
}

function sortMountedFields(
  fields: Array<DevtoolsMountedFieldSummary>,
): Array<DevtoolsMountedFieldSummary> {
  return fields
    .slice()
    .sort((left, right) => compareMountedFieldPaths(left.path, right.path))
}

export function upsertMountedField(
  fields: Array<DevtoolsMountedFieldSummary>,
  field: BroadcastMountedFieldSummary,
  createFieldId: () => string,
): Array<DevtoolsMountedFieldSummary> {
  const existingIndex = fields.findIndex((item) => item.path === field.path)

  if (existingIndex === -1) {
    return sortMountedFields([
      ...fields,
      { ...field, fieldId: createFieldId() },
    ])
  }

  return sortMountedFields(
    fields.map((item, index) =>
      index === existingIndex ? { ...field, fieldId: item.fieldId } : item,
    ),
  )
}

export function removeMountedField(
  fields: Array<DevtoolsMountedFieldSummary>,
  path: string,
): Array<DevtoolsMountedFieldSummary> {
  return sortMountedFields(fields.filter((field) => field.path !== path))
}

export function renameMountedFields(
  fields: Array<DevtoolsMountedFieldSummary>,
  renames: ReadonlyArray<MountedFieldRename>,
  createFieldId: () => string,
): Array<DevtoolsMountedFieldSummary> {
  const renamesByPreviousPath = new Map(
    renames.map((rename) => [rename.previousPath, rename] as const),
  )
  const targetPaths = new Set(renames.map((rename) => rename.field.path))
  const remainingRenames = new Set(renames)
  const nextFields: Array<DevtoolsMountedFieldSummary> = []

  for (const currentField of fields) {
    const rename = renamesByPreviousPath.get(currentField.path)

    if (rename) {
      nextFields.push({
        ...rename.field,
        fieldId: currentField.fieldId,
      })
      remainingRenames.delete(rename)
      continue
    }

    if (!targetPaths.has(currentField.path)) {
      nextFields.push(currentField)
    }
  }

  for (const rename of remainingRenames) {
    nextFields.push({
      ...rename.field,
      fieldId: createFieldId(),
    })
  }

  return sortMountedFields(nextFields)
}
