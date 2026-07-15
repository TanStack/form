import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'
import { createFieldListSearch } from '../src/hooks/createFieldListSearch'
import { setPinnedFieldIds } from '../src/stores/fieldListStore'
import type { FieldRowFilterPredicate } from '../src/stores/fieldListStore'
import type { FieldId } from '../src/types/branded'

const disposers: Array<() => void> = []

function field(path: string, fieldId: string) {
  return { path, fieldId: fieldId as FieldId }
}

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
  setPinnedFieldIds([])
})

describe('field list search', () => {
  it('combines Bookmarked and Dirty predicates in the active pipeline', async () => {
    let search!: ReturnType<typeof createFieldListSearch>
    let activePipeline!: () => Array<FieldRowFilterPredicate>

    const dispose = render(() => {
      const [query, setQuery] = createSignal('')
      const [filterPipeline, setFilterPipeline] = createSignal<
        Array<FieldRowFilterPredicate>
      >([])

      activePipeline = filterPipeline
      search = createFieldListSearch({
        query,
        setQuery,
        setFilterPipeline,
      })

      return null
    }, document.createElement('div'))
    disposers.push(dispose)

    search.tagsInputApi().addValue('bookmarked')
    await Promise.resolve()

    expect(activePipeline()).toHaveLength(1)

    setPinnedFieldIds(['field-pinned'])
    const predicate = activePipeline()[0]!

    expect(predicate(field('pinned', 'field-pinned'), { isDirty: false })).toBe(
      true,
    )
    expect(predicate(field('other', 'field-other'), { isDirty: false })).toBe(
      false,
    )

    search.tagsInputApi().addValue('dirty')
    await Promise.resolve()

    expect(activePipeline()).toHaveLength(2)
    expect(
      activePipeline().every((activePredicate) =>
        activePredicate(field('pinned', 'field-pinned'), { isDirty: true }),
      ),
    ).toBe(true)
    expect(
      activePipeline().every((activePredicate) =>
        activePredicate(field('pristine', 'field-pinned'), { isDirty: false }),
      ),
    ).toBe(false)

    expect(
      search.tagsSuggestions().items.map((filter) => filter.id),
    ).not.toContain('pristine')
  })

  it('filters Dirty and Pristine rows from hydrated summaries', async () => {
    let search!: ReturnType<typeof createFieldListSearch>
    let activePipeline!: () => Array<FieldRowFilterPredicate>

    const dispose = render(() => {
      const [query, setQuery] = createSignal('')
      const [filterPipeline, setFilterPipeline] = createSignal<
        Array<FieldRowFilterPredicate>
      >([])

      activePipeline = filterPipeline
      search = createFieldListSearch({
        query,
        setQuery,
        setFilterPipeline,
      })

      return null
    }, document.createElement('div'))
    disposers.push(dispose)

    search.tagsInputApi().addValue('dirty')
    await Promise.resolve()

    const dirtyPredicate = activePipeline()[0]!
    expect(dirtyPredicate.usesSummary).toBe(true)
    expect(
      dirtyPredicate(field('dirty', 'field-dirty'), { isDirty: true }),
    ).toBe(true)
    expect(
      dirtyPredicate(field('pristine', 'field-pristine'), { isDirty: false }),
    ).toBe(false)
    search.clearSelection()
    search.tagsInputApi().addValue('pristine')
    await Promise.resolve()

    const pristinePredicate = activePipeline()[0]!
    expect(
      pristinePredicate(field('dirty', 'field-dirty'), { isDirty: true }),
    ).toBe(false)
    expect(
      pristinePredicate(field('pristine', 'field-pristine'), {
        isDirty: false,
      }),
    ).toBe(true)
  })
})
