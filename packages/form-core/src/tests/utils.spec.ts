import { describe, expect, it } from 'vitest'
import { deleteBy, getBy, setBy } from '../utils'

describe('getBy', () => {
  const structure = {
    name: 'Marc',
    kids: [
      { name: 'Stephen', age: 10 },
      { name: 'Taylor', age: 15 },
    ],
    mother: {
      name: 'Lisa',
    },
  }

  it('should get subfields by path', () => {
    expect(getBy(structure, 'name')).toBe(structure.name)
    expect(getBy(structure, 'mother.name')).toBe(structure.mother.name)
  })

  it('should get array subfields by path', () => {
    expect(getBy(structure, 'kids.0.name')).toBe(structure.kids[0]!.name)
    expect(getBy(structure, 'kids.0.age')).toBe(structure.kids[0]!.age)
  })
})

describe('setBy', () => {
  const structure = {
    name: 'Marc',
    kids: [
      { name: 'Stephen', age: 10 },
      { name: 'Taylor', age: 15 },
    ],
    mother: {
      name: 'Lisa',
    },
  }

  it('should set subfields by path', () => {
    expect(setBy(structure, 'name', 'Lisa').name).toBe('Lisa')
    expect(setBy(structure, 'mother.name', 'Tina').mother.name).toBe('Tina')
  })

  it('should set array subfields by path', () => {
    expect(setBy(structure, 'kids.0.name', 'Taylor').kids[0].name).toBe(
      'Taylor',
    )
    expect(setBy(structure, 'kids.0.age', 20).kids[0].age).toBe(20)
  })
})

describe('deleteBy', () => {
  const structure = {
    name: 'Marc',
    kids: [
      { name: 'Stephen', age: 10 },
      { name: 'Taylor', age: 15 },
    ],
    mother: {
      name: 'Lisa',
    },
  }

  it('should delete subfields by path', () => {
    expect(deleteBy(structure, 'name').name).not.toBeDefined()
    expect(deleteBy(structure, 'mother.name').mother.name).not.toBeDefined()
  })

  it('should delete array subfields by path', () => {
    expect(deleteBy(structure, 'kids.0.name').kids[0].name).not.toBeDefined()
    expect(deleteBy(structure, 'kids.0.age').kids[0].age).not.toBeDefined()
  })
})
