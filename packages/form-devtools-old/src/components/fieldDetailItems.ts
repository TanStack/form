import type {
  DevtoolsFormState,
  DevtoolsMountedFieldSummary,
} from '../stores/eventClientTypes'
import type { FieldDetailCardItem } from './FieldDetailCard/fieldDetailTypes'

export function getVisibleFieldDetailItems(
  fields: ReadonlyArray<DevtoolsMountedFieldSummary>,
  fieldDetails: DevtoolsFormState['fieldDetails'],
  includeArrayFields: boolean,
): Array<FieldDetailCardItem> {
  const fieldDetailsByPath = new Map(
    fieldDetails.map((fieldDetail) => [fieldDetail.path, fieldDetail]),
  )

  return fields
    .filter((field) => includeArrayFields || !field.isArray)
    .map((field) => {
      return fieldDetailsByPath.get(field.path) ?? null
    })
    .filter((field): field is FieldDetailCardItem => field !== null)
}
