import { For, Show, createMemo } from 'solid-js'
import { useFieldDetailCardStyles } from '../../styles/field-detail-card.styles'
import type { FieldDetailSnapshot } from './fieldDetailTypes'

type FieldDependencyLink = FieldDetailSnapshot['dependencies']['watches'][number]

interface FieldDetailCardDependenciesSectionProps {
  field: FieldDetailSnapshot
  mountedFieldPaths: ReadonlySet<string>
  onOpenField: (fieldPath: string) => void
}

export function FieldDetailCardDependenciesSection(
  props: FieldDetailCardDependenciesSectionProps,
) {
  const styles = useFieldDetailCardStyles()
  const groups = createMemo(() => [
    {
      title: 'Watches',
      links: props.field.dependencies.watches,
    },
    {
      title: 'Watched by',
      links: props.field.dependencies.watchedBy,
    },
  ])

  return (
    <div class={styles().dependenciesSection}>
      <div class={styles().dependenciesGrid}>
        <For each={groups().filter((group) => group.links.length > 0)}>
          {(group) => (
            <FieldDependencyGroup
              title={group.title}
              links={group.links}
              mountedFieldPaths={props.mountedFieldPaths}
              onOpenField={props.onOpenField}
            />
          )}
        </For>
      </div>
    </div>
  )
}

interface FieldDependencyGroupProps {
  title: string
  links: ReadonlyArray<FieldDependencyLink>
  mountedFieldPaths: ReadonlySet<string>
  onOpenField: (fieldPath: string) => void
}

function FieldDependencyGroup(props: FieldDependencyGroupProps) {
  const styles = useFieldDetailCardStyles()

  return (
    <div class={styles().dependencyGroup}>
      <div class={styles().dependencyGroupTitle}>{props.title}</div>
      <ul class={styles().dependencyList}>
        <For each={props.links}>
          {(link) => (
            <FieldDependencyItem
              link={link}
              isMounted={props.mountedFieldPaths.has(link.path)}
              onOpenField={props.onOpenField}
            />
          )}
        </For>
      </ul>
    </div>
  )
}

interface FieldDependencyItemProps {
  link: FieldDependencyLink
  isMounted: boolean
  onOpenField: (fieldPath: string) => void
}

function FieldDependencyItem(props: FieldDependencyItemProps) {
  const styles = useFieldDetailCardStyles()
  const itemLabel = () => `${props.link.kind} #${props.link.itemIndex + 1}`

  return (
    <li class={styles().dependencyItem}>
      <Show
        when={props.isMounted}
        fallback={
          <span class={styles().dependencyPathText} title={props.link.path}>
            {props.link.path}
          </span>
        }
      >
        <button
          class={styles().dependencyPathButton}
          type="button"
          title={props.link.path}
          aria-label={`Open field ${props.link.path}`}
          onClick={() => props.onOpenField(props.link.path)}
        >
          {props.link.path}
        </button>
      </Show>
      <div class={styles().dependencyMeta}>
        <span class={styles().dependencyBadge}>{itemLabel()}</span>
        <Show when={!props.isMounted}>
          <span class={styles().dependencyBadge}>unmounted</span>
        </Show>
        <Show when={props.link.configuredPath}>
          <span class={styles().dependencyConfiguredPath}>
            configured {props.link.configuredPath}
          </span>
        </Show>
      </div>
    </li>
  )
}
