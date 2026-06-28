import { For, Show, createMemo } from 'solid-js'
import { Tag } from '@tanstack/devtools-ui'
import { useMountedFieldsListStyles } from '../styles/mounted-fields-list.styles'
import { FieldMetaBadge } from './FieldMetaBadge'
import { PinIcon, PinOutlineIcon } from './icons/Pin'
import type { DevtoolsMountedFieldSummary } from '../stores/eventClientTypes'
import type { FieldMetaBadgeVariant } from './FieldMetaBadge'

export type MountedFieldStatus = 'valid' | 'invalid'

export type FieldListFilter = 'all' | 'issues' | 'pinned'

export type MountedFieldSummary = DevtoolsMountedFieldSummary

type TagColor = Parameters<typeof Tag>[0]['color']

const fieldListFilters: Array<{
  id: FieldListFilter
  label: string
  color: TagColor
}> = [
  { id: 'all', label: 'All', color: 'gray' },
  { id: 'issues', label: 'Issues', color: 'red' },
  { id: 'pinned', label: 'Pinned', color: 'yellow' },
]

interface FieldListFilterBarProps {
  fields: ReadonlyArray<MountedFieldSummary>
  query: string
  pinnedFieldPaths: ReadonlyArray<string>
  filter: FieldListFilter
  onFilterChange: (filter: FieldListFilter) => void
}

export function FieldListFilterBar(props: FieldListFilterBarProps) {
  const styles = useMountedFieldsListStyles()
  const pinnedFieldPathSet = createMemo(() => new Set(props.pinnedFieldPaths))
  const queryMatchedFields = createMemo(() =>
    props.fields.filter((field) => fieldMatchesQuery(field, props.query)),
  )
  const filterCounts = createMemo(() => {
    const pinnedPaths = pinnedFieldPathSet()
    const queryMatches = queryMatchedFields()

    return Object.fromEntries(
      fieldListFilters.map((filter) => [
        filter.id,
        queryMatches.filter((field) =>
          fieldMatchesFilter(field, filter.id, pinnedPaths),
        ).length,
      ]),
    ) as Record<FieldListFilter, number>
  })

  return (
    <div
      class={styles().fieldFilterGroup}
      role="group"
      aria-label="Field status filter"
    >
      <For each={fieldListFilters}>
        {(filter) => (
          <div
            class={styles().fieldFilterTagWrapper}
            classList={{
              [styles().fieldFilterTagWrapperActive]:
                props.filter === filter.id,
            }}
            onClick={() => props.onFilterChange(filter.id)}
          >
            <Tag
              color={filter.color}
              label={filter.label}
              count={filterCounts()[filter.id]}
              disabled={false}
            />
          </div>
        )}
      </For>
    </div>
  )
}

interface MountedFieldsListProps {
  fields: ReadonlyArray<MountedFieldSummary>
  selectedFieldPath: string | null
  pinnedFieldPaths: ReadonlyArray<string>
  query: string
  filter: FieldListFilter
  onQueryChange: (query: string) => void
  onSelectField: (fieldPath: string) => void
  onTogglePinnedField: (fieldPath: string) => void
}

function splitFieldPath(path: string) {
  const lastDotIndex = path.lastIndexOf('.')

  if (lastDotIndex === -1) {
    return {
      ownerPath: '',
      leafName: path,
    }
  }

  return {
    ownerPath: path.slice(0, lastDotIndex + 1),
    leafName: path.slice(lastDotIndex + 1),
  }
}

function fieldMatchesQuery(field: MountedFieldSummary, query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (normalizedQuery.length === 0) return true

  return field.path.toLowerCase().includes(normalizedQuery)
}

function fieldMatchesFilter(
  field: MountedFieldSummary,
  filter: FieldListFilter,
  pinnedFieldPaths: Set<string>,
) {
  if (filter === 'issues') return !field.isValid || field.hiddenErrorCount > 0
  if (filter === 'pinned') return pinnedFieldPaths.has(field.path)

  return true
}

function getFieldStatus(field: MountedFieldSummary): MountedFieldStatus {
  return field.isValid ? 'valid' : 'invalid'
}

export function getMountedFieldMetaBadgeVariants(
  field: MountedFieldSummary,
): Array<FieldMetaBadgeVariant> {
  const variants: Array<FieldMetaBadgeVariant> = []

  if (field.isDirty) variants.push('dirty')
  if (field.isDirty && field.isDefaultValue) variants.push('isDefaultValue')
  if (field.isTouched) variants.push('touched')
  if (field.isBlurred) variants.push('blurred')
  if (field.hiddenErrorCount > 0) variants.push('isInvalidHidden')
  if (!field.isValid) variants.push('isInvalid')

  return variants
}

export function MountedFieldsList(props: MountedFieldsListProps) {
  const styles = useMountedFieldsListStyles()
  const pinnedFieldPathSet = createMemo(() => new Set(props.pinnedFieldPaths))
  const queryMatchedFields = createMemo(() =>
    props.fields.filter((field) => fieldMatchesQuery(field, props.query)),
  )
  const visibleFields = createMemo(() =>
    queryMatchedFields().filter((field) =>
      fieldMatchesFilter(field, props.filter, pinnedFieldPathSet()),
    ),
  )

  return (
    <div class={styles().fieldListPanel}>
      <div class={styles().fieldListControls}>
        <label class={styles().fieldSearchLabel}>
          <span class={styles().fieldSearchText}>Filter fields</span>
          <input
            class={styles().fieldSearchInput}
            type="search"
            value={props.query}
            placeholder="Search field path"
            onInput={(event) => props.onQueryChange(event.currentTarget.value)}
          />
        </label>
      </div>

      <div class={styles().fieldList} role="list" aria-label="Mounted fields">
        <Show
          when={visibleFields().length > 0}
          fallback={
            <div class={styles().fieldListEmpty}>
              No matching mounted fields
            </div>
          }
        >
          <For each={visibleFields()}>
            {(field) => {
              const pathParts = splitFieldPath(field.path)
              const isPinned = () => pinnedFieldPathSet().has(field.path)
              const isSelected = () => props.selectedFieldPath === field.path
              const pinLabel = () => (isPinned() ? 'Unpin field' : 'Pin field')

              return (
                <div
                  class={styles().fieldRow}
                  classList={{
                    [styles().fieldRowSelected]: isSelected(),
                  }}
                  data-status={getFieldStatus(field)}
                  role="listitem"
                >
                  <button
                    class={styles().fieldRowButton}
                    type="button"
                    title={field.path}
                    onClick={() => props.onSelectField(field.path)}
                  >
                    <span class={styles().fieldRowBody}>
                      <span class={styles().fieldPath}>
                        <Show when={pathParts.ownerPath.length > 0}>
                          <span class={styles().fieldOwnerPath}>
                            {pathParts.ownerPath}
                          </span>
                        </Show>
                        <span class={styles().fieldLeafName}>
                          {pathParts.leafName}
                        </span>
                      </span>

                      <span class={styles().fieldBadges}>
                        <For each={getMountedFieldMetaBadgeVariants(field)}>
                          {(variant) => <FieldMetaBadge variant={variant} />}
                        </For>
                        <Show when={field.isArray}>
                          <span class={styles().fieldBadge}>
                            Array
                            <Show when={field.arrayLength !== undefined}>
                              {' '}
                              {field.arrayLength}
                            </Show>
                          </span>
                        </Show>
                      </span>
                    </span>
                  </button>
                  <button
                    class={styles().fieldPinButton}
                    classList={{
                      [styles().fieldPinButtonPinned]: isPinned(),
                    }}
                    type="button"
                    aria-pressed={isPinned()}
                    title={pinLabel()}
                    aria-label={pinLabel()}
                    onClick={() => props.onTogglePinnedField(field.path)}
                  >
                    <Show when={isPinned()} fallback={<PinOutlineIcon />}>
                      <PinIcon />
                    </Show>
                  </button>
                </div>
              )
            }}
          </For>
        </Show>
      </div>
    </div>
  )
}
