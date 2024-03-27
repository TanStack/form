import { describe, expect, it } from 'vitest'
import { deleteBy, getBy, makePathArray, setBy } from '../utils'

describe('getBy', () => {
  const structure = {
    name: 'Marc',
    kids: [
      { name: 'Stephen', age: 10, hobbies: ['soccer', 'reading'] },
      { name: 'Taylor', age: 15, hobbies: ['swimming', 'gaming'] },
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
    expect(getBy(structure, 'kids[0].name')).toBe(structure.kids[0]!.name)
    expect(getBy(structure, 'kids[0].age')).toBe(structure.kids[0]!.age)
  })

  it('should get nested array subfields by path', () => {
    expect(getBy(structure, 'kids[0].hobbies[0]')).toBe(
      structure.kids[0]!.hobbies[0],
    )
    expect(getBy(structure, 'kids[0].hobbies[1]')).toBe(
      structure.kids[0]!.hobbies[1],
    )
  })
})

describe('setBy', () => {
  const structure = {
    name: 'Marc',
    kids: [
      { name: 'Stephen', age: 10, hobbies: ['soccer', 'reading'] },
      { name: 'Taylor', age: 15, hobbies: ['swimming', 'gaming'] },
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
    expect(setBy(structure, 'kids[0].name', 'Taylor').kids[0].name).toBe(
      'Taylor',
    )
    expect(setBy(structure, 'kids[0].age', 20).kids[0].age).toBe(20)
  })

  it('should set nested array subfields by path', () => {
    expect(
      setBy(structure, 'kids[0].hobbies[0]', 'swimming').kids[0].hobbies[0],
    ).toBe('swimming')
    expect(
      setBy(structure, 'kids[0].hobbies[1]', 'gaming').kids[0].hobbies[1],
    ).toBe('gaming')
  })
})

describe('deleteBy', () => {
  const structure = {
    name: 'Marc',
    kids: [
      { name: 'Stephen', age: 10, hobbies: ['soccer', 'reading'] },
      { name: 'Taylor', age: 15, hobbies: ['swimming', 'gaming'] },
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
    expect(deleteBy(structure, 'kids[0].name').kids[0].name).not.toBeDefined()
    expect(deleteBy(structure, 'kids[0].age').kids[0].age).not.toBeDefined()
  })

  it('should delete nested array subfields by path', () => {
    expect(deleteBy(structure, 'kids[0].hobbies[0]').kids[0].hobbies[0]).toBe(
      'reading',
    )
    expect(
      deleteBy(structure, 'kids[0].hobbies[1]').kids[0].hobbies[1],
    ).not.toBeDefined()
  })

  it('should delete non-existent paths like a noop', () => {
    expect(deleteBy(structure, 'nonexistent')).toEqual(structure)
    expect(deleteBy(structure, 'nonexistent.nonexistent')).toEqual(structure)
    expect(deleteBy(structure, 'kids[3].name')).toEqual(structure)
    expect(deleteBy(structure, 'nonexistent[3].nonexistent')).toEqual(structure)
  })
})

describe('makePathArray', () => {
  it('should convert dot notation to array', () => {
    expect(makePathArray('name')).toEqual(['name'])
    expect(makePathArray('mother.name')).toEqual(['mother', 'name'])
    expect(makePathArray('kids[0].name')).toEqual(['kids', 0, 'name'])
    expect(makePathArray('kids[0].name[1]')).toEqual(['kids', 0, 'name', 1])
    expect(makePathArray('kids[0].name[1].age')).toEqual([
      'kids',
      0,
      'name',
      1,
      'age',
    ])
    expect(makePathArray('kids[0].name[1].age[2]')).toEqual([
      'kids',
      0,
      'name',
      1,
      'age',
      2,
    ])
  })
})
