import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'
import { createFieldListSearch } from '../src/hooks/createFieldListSearch'
import { setPinnedFieldIds } from '../src/stores/fieldListStore'
import type { FieldRowFilterPredicate } from '../src/stores/fieldListStore'

const disposers: Array<() => void> = []

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
  setPinnedFieldIds([])
})

describe('field list search', () => {
  it('adds the Bookmarked predicate to the active filter pipeline', async () => {
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

    expect(
      predicate({ path: 'pinned', leaf: 'pinned', fieldId: 'field-pinned' }),
    ).toBe(true)
    expect(
      predicate({ path: 'other', leaf: 'other', fieldId: 'field-other' }),
    ).toBe(false)

    search.tagsInputApi().addValue('dirty')
    await Promise.resolve()

    expect(activePipeline()).toHaveLength(1)
  })
})
