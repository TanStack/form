import { describe, expect, it } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import {
  collectFieldSubtree,
  visitAllFormFields,
  visitFieldAndAncestors,
  visitFieldSubtree,
} from '../../src/FieldApi/fieldTraversal.lib'

function createFieldTree() {
  const form = new InternalFormApi({
    defaultValues: {
      section: { first: { deep: '' }, second: '' },
      other: '',
    },
  })
  const section = form._getOrCreateFieldApi({ name: 'section' })
  form._getOrCreateFieldApi({ name: 'section.first' })
  const deep = form._getOrCreateFieldApi({ name: 'section.first.deep' })
  form._getOrCreateFieldApi({ name: 'section.second' })
  form._getOrCreateFieldApi({ name: 'other' })

  return { form, section, deep }
}

describe('visitFieldAndAncestors', () => {
  it('visits a field and its ancestors without visiting the synthetic root', () => {
    const { deep } = createFieldTree()
    const names: Array<string> = []

    visitFieldAndAncestors(deep, (field) => {
      names.push(field.name)
    })

    expect(names).toEqual(['section.first.deep', 'section.first', 'section'])
  })

  it('stops before visiting further ancestors when the visitor returns stop', () => {
    const { deep } = createFieldTree()
    const names: Array<string> = []

    visitFieldAndAncestors(deep, (field, stop) => {
      names.push(field.name)
      if (field.name === 'section.first') return stop
      return undefined
    })

    expect(names).toEqual(['section.first.deep', 'section.first'])
  })
})

describe('visitFieldSubtree', () => {
  it('visits the field and its descendants, parents before children', () => {
    const { section } = createFieldTree()
    const names: Array<string> = []

    visitFieldSubtree(section, (field) => {
      names.push(field.name)
    })

    const firstIndex = names.indexOf('section.first')
    const deepIndex = names.indexOf('section.first.deep')

    expect(names.toSorted()).toEqual([
      'section',
      'section.first',
      'section.first.deep',
      'section.second',
    ])
    expect(names[0]).toBe('section')
    expect(firstIndex).toBeLessThan(deepIndex)
  })

  it('stops before visiting any more fields when the visitor returns stop', () => {
    const { section } = createFieldTree()
    const names: Array<string> = []

    visitFieldSubtree(section, (field, stop) => {
      names.push(field.name)
      if (field.name !== 'section') return stop
      return undefined
    })

    expect(names).toEqual([
      'section',
      expect.stringMatching(/^section\.(first|second)$/),
    ])
  })
})

describe('visitAllFormFields', () => {
  it('visits every field, parents before children, without visiting the synthetic root', () => {
    const { form } = createFieldTree()
    const names: Array<string> = []

    visitAllFormFields(form._fieldRootNode, (field) => {
      names.push(field.name)
    })

    const sectionIndex = names.indexOf('section')
    const firstIndex = names.indexOf('section.first')
    const deepIndex = names.indexOf('section.first.deep')
    const secondIndex = names.indexOf('section.second')

    expect(names.toSorted()).toEqual([
      'other',
      'section',
      'section.first',
      'section.first.deep',
      'section.second',
    ])
    expect(sectionIndex).toBeLessThan(firstIndex)
    expect(sectionIndex).toBeLessThan(secondIndex)
    expect(firstIndex).toBeLessThan(deepIndex)
  })
})

describe('collectFieldSubtree', () => {
  it('collects the field and its descendants, parents before children', () => {
    const { section } = createFieldTree()

    const fields = collectFieldSubtree(section)
    const names = fields.map((field) => field.name)
    const firstIndex = names.indexOf('section.first')
    const deepIndex = names.indexOf('section.first.deep')

    expect(names.toSorted()).toEqual([
      'section',
      'section.first',
      'section.first.deep',
      'section.second',
    ])
    expect(names[0]).toBe('section')
    expect(firstIndex).toBeLessThan(deepIndex)
  })
})
