import { compareMountedFieldPaths } from './mountedFieldsStore'
import type { DevtoolsFieldDetailState } from './eventClientTypes'

function sortFieldDetails(
  fieldDetails: Array<DevtoolsFieldDetailState>,
): Array<DevtoolsFieldDetailState> {
  return fieldDetails
    .slice()
    .sort((left, right) => compareMountedFieldPaths(left.path, right.path))
}

export function upsertFieldDetail(
  fieldDetails: Array<DevtoolsFieldDetailState>,
  fieldDetail: DevtoolsFieldDetailState,
): Array<DevtoolsFieldDetailState> {
  const existingIndex = fieldDetails.findIndex(
    (item) => item.path === fieldDetail.path,
  )

  if (existingIndex === -1) {
    return sortFieldDetails([...fieldDetails, fieldDetail])
  }

  return sortFieldDetails(
    fieldDetails.map((item, index) =>
      index === existingIndex ? fieldDetail : item,
    ),
  )
}

export function removeFieldDetail(
  fieldDetails: Array<DevtoolsFieldDetailState>,
  path: string,
): Array<DevtoolsFieldDetailState> {
  return sortFieldDetails(
    fieldDetails.filter((fieldDetail) => fieldDetail.path !== path),
  )
}

export function removeFieldDetails(
  fieldDetails: Array<DevtoolsFieldDetailState>,
  paths: ReadonlyArray<string>,
): Array<DevtoolsFieldDetailState> {
  const pathSet = new Set(paths)
  return sortFieldDetails(
    fieldDetails.filter((fieldDetail) => !pathSet.has(fieldDetail.path)),
  )
}
