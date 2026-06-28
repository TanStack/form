import { For, createMemo } from 'solid-js'
import { FieldDetailCardDependenciesSection } from './FieldDetailCardDependenciesSection'
import { FieldDetailCardHeaderSection } from './FieldDetailCardHeaderSection'
import { FieldDetailCardJsonSection } from './FieldDetailCardJsonSection'
import { FieldDetailCardValuesSection } from './FieldDetailCardValuesSection'
import type { FieldDetailErrorDisplayMode } from './FieldDetailCardValuesSection'
import type {
  FieldDetailSnapshot,
  FieldDetailViewMode,
} from './fieldDetailTypes'

type FieldDetailCardSectionId = 'header' | 'values' | 'json' | 'dependencies'

interface FieldDetailCardSectionsProps {
  field: FieldDetailSnapshot
  includeRawValues: boolean
  detailViewMode: FieldDetailViewMode
  mountedFieldPaths: ReadonlySet<string>
  onOpenField: (fieldPath: string) => void
  onRawValueChange: (fieldPath: string, includeRawValues: boolean) => void
  errorDisplayMode: FieldDetailErrorDisplayMode
  onErrorDisplayModeChange: (
    fieldPath: string,
    mode: FieldDetailErrorDisplayMode,
  ) => void
}

export function FieldDetailCardSections(props: FieldDetailCardSectionsProps) {
  const sectionIds = createMemo<Array<FieldDetailCardSectionId>>(() => {
    if (props.detailViewMode === 'json') return ['header', 'json']

    const hasErrors = props.field.state.meta.original.errors.length > 0
    const hasDependencies =
      props.field.dependencies.watches.length > 0 ||
      props.field.dependencies.watchedBy.length > 0
    const sections: Array<FieldDetailCardSectionId> = ['header']

    if (props.includeRawValues || hasErrors) {
      sections.push('values')
    }

    if (hasDependencies) {
      sections.push('dependencies')
    }

    return sections
  })

  const renderSection = (sectionId: FieldDetailCardSectionId) => {
    switch (sectionId) {
      case 'header':
        return (
          <FieldDetailCardHeaderSection
            field={props.field}
            includeRawValues={props.includeRawValues}
            showMetaTags={props.detailViewMode === 'ui'}
            onRawValueChange={props.onRawValueChange}
          />
        )
      case 'values':
        return (
          <FieldDetailCardValuesSection
            field={props.field}
            includeRawValues={props.includeRawValues}
            errorDisplayMode={props.errorDisplayMode}
            onErrorDisplayModeChange={(mode) =>
              props.onErrorDisplayModeChange(props.field.path, mode)
            }
          />
        )
      case 'json':
        return (
          <FieldDetailCardJsonSection
            field={props.field}
            includeRawValues={props.includeRawValues}
          />
        )
      case 'dependencies':
        return (
          <FieldDetailCardDependenciesSection
            field={props.field}
            mountedFieldPaths={props.mountedFieldPaths}
            onOpenField={props.onOpenField}
          />
        )
    }
  }

  return <For each={sectionIds()}>{renderSection}</For>
}
