import { describe, expect, it } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import {
  collectFieldSubtree,
  visitAllFormFields,
  visitFieldAndAncestors,
  visitFieldSubtree,
} from '../../src/FieldApi/fieldTraversal.lib'
import type { AnyInternalFieldApi } from '../../src/FieldApi/FieldApi.lib'

function createFieldTree() {
  const form = new InternalFormApi({
    defaultValues: {
      section: { first: '', second: { deep: '' } },
      other: '',
    },
  })
  const section = form._getOrCreateFieldApi({ name: 'section' })
  const first = form._getOrCreateFieldApi({ name: 'section.first' })
  const second = form._getOrCreateFieldApi({ name: 'section.second' })
  const deep = form._getOrCreateFieldApi({ name: 'section.second.deep' })
  const other = form._getOrCreateFieldApi({ name: 'other' })

  return { form, section, first, second, deep, other }
}

function collectNames(
  visit: (visitor: (field: AnyInternalFieldApi) => void) => void,
): Array<string> {
  const names: Array<string> = []
  visit((field) => names.push(field.name))
  return names
}

describe('field traversal', () => {
  it('visits a field and its ancestors without visiting the synthetic root', () => {
    const { deep } = createFieldTree()

    expect(
      collectNames((visitor) => visitFieldAndAncestors(deep, visitor)),
    ).toEqual(['section.second.deep', 'section.second', 'section'])
  })

  it('visits subtrees and complete forms in insertion-order preorder', () => {
    const { form, section } = createFieldTree()

    expect(
      collectNames((visitor) => visitFieldSubtree(section, visitor)),
    ).toEqual([
      'section',
      'section.first',
      'section.second',
      'section.second.deep',
    ])
    expect(
      collectNames((visitor) =>
        visitAllFormFields(form._fieldRootNode, visitor),
      ),
    ).toEqual([
      'section',
      'section.first',
      'section.second',
      'section.second.deep',
      'other',
    ])
  })

  it('stops ancestor and subtree traversal when the visitor returns false', () => {
    const { section, deep } = createFieldTree()
    const ancestors: Array<string> = []
    const subtree: Array<string> = []

    visitFieldAndAncestors(deep, (field) => {
      ancestors.push(field.name)
      if (field.name === 'section.second') return false
      return undefined
    })
    visitFieldSubtree(section, (field) => {
      subtree.push(field.name)
      if (field.name === 'section.second') return false
      return undefined
    })

    expect(ancestors).toEqual(['section.second.deep', 'section.second'])
    expect(subtree).toEqual(['section', 'section.first', 'section.second'])
  })

  it('collects the same ordered fields produced by subtree visitation', () => {
    const { section } = createFieldTree()
    const visited: Array<AnyInternalFieldApi> = []

    visitFieldSubtree(section, (field) => {
      visited.push(field)
    })

    expect(collectFieldSubtree(section)).toEqual(visited)
  })
})
