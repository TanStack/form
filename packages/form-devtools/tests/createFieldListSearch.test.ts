import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'
import { createFieldListSearch } from '../src/hooks/createFieldListSearch'
import { setPinnedFieldIds } from '../src/stores/fieldListStore'
import type { FieldRowFilterPredicate } from '../src/stores/fieldListStore'
import type { FieldId } from '../src/types/branded'

const disposers: Array<() => void> = []

function field(path: string, fieldId: string) {
  return { path, pathLeaf: path, fieldId: fieldId as FieldId }
}

function meta(isDirty: boolean) {
  return {
    isDirty,
    isTouched: false,
    isBlurred: false,
    isDefaultValue: true,
    validity: 'valid' as const,
  }
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

    expect(predicate(field('pinned', 'field-pinned'), meta(false))).toBe(true)
    expect(predicate(field('other', 'field-other'), meta(false))).toBe(false)

    search.tagsInputApi().addValue('dirty')
    await Promise.resolve()

    expect(activePipeline()).toHaveLength(2)
    expect(
      activePipeline().every((activePredicate) =>
        activePredicate(field('pinned', 'field-pinned'), meta(true)),
      ),
    ).toBe(true)
    expect(
      activePipeline().every((activePredicate) =>
        activePredicate(field('pristine', 'field-pinned'), meta(false)),
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
    expect(dirtyPredicate(field('dirty', 'field-dirty'), meta(true))).toBe(true)
    expect(
      dirtyPredicate(field('pristine', 'field-pristine'), meta(false)),
    ).toBe(false)
    search.clearSelection()
    search.tagsInputApi().addValue('pristine')
    await Promise.resolve()

    const pristinePredicate = activePipeline()[0]!
    expect(pristinePredicate(field('dirty', 'field-dirty'), meta(true))).toBe(
      false,
    )
    expect(
      pristinePredicate(field('pristine', 'field-pristine'), meta(false)),
    ).toBe(true)
  })

  it('filters Invalid and Valid rows from hydrated summaries', async () => {
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

    search.tagsInputApi().addValue('invalid')
    await Promise.resolve()

    const invalidPredicate = activePipeline()[0]!
    expect(invalidPredicate.usesSummary).toBe(true)
    expect(
      invalidPredicate(field('invalid', 'field-invalid'), {
        ...meta(false),
        validity: 'invalid',
      }),
    ).toBe(true)
    expect(
      invalidPredicate(field('hidden', 'field-hidden'), {
        ...meta(false),
        validity: 'invalidHidden',
      }),
    ).toBe(true)
    expect(invalidPredicate(field('valid', 'field-valid'), meta(false))).toBe(
      false,
    )
    expect(
      search.tagsSuggestions().items.map((filter) => filter.id),
    ).not.toContain('valid')

    search.clearSelection()
    search.tagsInputApi().addValue('valid')
    await Promise.resolve()

    const validPredicate = activePipeline()[0]!
    expect(
      validPredicate(field('invalid', 'field-invalid'), {
        ...meta(false),
        validity: 'invalid',
      }),
    ).toBe(false)
    expect(
      validPredicate(field('hidden', 'field-hidden'), {
        ...meta(false),
        validity: 'invalidHidden',
      }),
    ).toBe(false)
    expect(validPredicate(field('valid', 'field-valid'), meta(false))).toBe(
      true,
    )
  })

  it('filters Blurred and Not blurred rows from hydrated summaries', async () => {
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

    search.tagsInputApi().addValue('blurred')
    await Promise.resolve()

    const blurredPredicate = activePipeline()[0]!
    expect(blurredPredicate.usesSummary).toBe(true)
    expect(
      blurredPredicate(field('blurred', 'field-blurred'), {
        ...meta(false),
        isBlurred: true,
      }),
    ).toBe(true)
    expect(
      blurredPredicate(field('not-blurred', 'field-not-blurred'), meta(false)),
    ).toBe(false)
    expect(
      search.tagsSuggestions().items.map((filter) => filter.id),
    ).not.toContain('not-blurred')

    search.clearSelection()
    search.tagsInputApi().addValue('not-blurred')
    await Promise.resolve()

    const notBlurredPredicate = activePipeline()[0]!
    expect(
      notBlurredPredicate(field('blurred', 'field-blurred'), {
        ...meta(false),
        isBlurred: true,
      }),
    ).toBe(false)
    expect(
      notBlurredPredicate(
        field('not-blurred', 'field-not-blurred'),
        meta(false),
      ),
    ).toBe(true)
  })

  it('filters Default and Non-default value rows from hydrated summaries', async () => {
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

    search.tagsInputApi().addValue('non-default-value')
    await Promise.resolve()

    const nonDefaultPredicate = activePipeline()[0]!
    expect(nonDefaultPredicate.usesSummary).toBe(true)
    expect(
      nonDefaultPredicate(field('changed', 'field-changed'), {
        ...meta(false),
        isDefaultValue: false,
      }),
    ).toBe(true)
    expect(
      nonDefaultPredicate(field('default', 'field-default'), meta(false)),
    ).toBe(false)
    expect(
      search.tagsSuggestions().items.map((filter) => filter.id),
    ).not.toContain('default-value')

    search.clearSelection()
    search.tagsInputApi().addValue('default-value')
    await Promise.resolve()

    const defaultPredicate = activePipeline()[0]!
    expect(
      defaultPredicate(field('changed', 'field-changed'), {
        ...meta(false),
        isDefaultValue: false,
      }),
    ).toBe(false)
    expect(
      defaultPredicate(field('default', 'field-default'), meta(false)),
    ).toBe(true)
  })
})
