import { describe, expect, it } from 'vitest'
import {
  deleteBy,
  determineErrorValue,
  getBy,
  makePathArray,
  setBy,
} from '../src/index'

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

  it("should create an object if it doesn't exist", () => {
    expect(setBy(structure, 'father.name', 'John').father.name).toBe('John')
  })

  it('should create an array if it doesnt exist', () => {
    expect(setBy(structure, 'kids[2].name', 'John').kids[2].name).toBe('John')
  })

  it('should set a value in an object if the key is a number but the parent is an object', () => {
    const newStructure = setBy(structure, '5.name', 'John')
    expect(newStructure['5'].name).toBe('John')
    expect(newStructure).toStrictEqual({ ...structure, 5: { name: 'John' } })
  })

  it('should set a value in an array if the key is a number and the parent is an array', () => {
    const newStructure = setBy(structure, 'kids.2.name', 'John')
    expect(newStructure.kids[2].name).toBe('John')
    expect(newStructure).toStrictEqual({
      ...structure,
      kids: [...structure.kids, { name: 'John' }],
    })
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

describe('determineErrorValue', () => {
  describe('when a new form validator error exists', () => {
    it('should return the new form error with source "form"', () => {
      const result = determineErrorValue({
        newFormValidatorError: 'Form error',
        isPreviousErrorFromFormValidator: false,
        previousErrorValue: 'Field error',
      })

      expect(result).toEqual({
        newErrorValue: 'Form error',
        newSource: 'form',
      })
    })

    it('should return the new form error even if previous error was from form', () => {
      const result = determineErrorValue({
        newFormValidatorError: 'New form error',
        isPreviousErrorFromFormValidator: true,
        previousErrorValue: 'Old form error',
      })

      expect(result).toEqual({
        newErrorValue: 'New form error',
        newSource: 'form',
      })
    })
  })

  describe('when no new form validator error exists', () => {
    it('should clear the error if previous error was from form validator', () => {
      const result = determineErrorValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: true,
        previousErrorValue: 'Old form error',
      })

      expect(result).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })
    })

    it('should clear the error if new error is null and previous error was from form', () => {
      const result = determineErrorValue({
        newFormValidatorError: null,
        isPreviousErrorFromFormValidator: true,
        previousErrorValue: 'Old form error',
      })

      expect(result).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })
    })

    it('should retain field error if previous error was from field', () => {
      const result = determineErrorValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: false,
        previousErrorValue: 'Field error',
      })

      expect(result).toEqual({
        newErrorValue: 'Field error',
        newSource: 'field',
      })
    })

    it('should retain field error if new error is null and previous error was from field', () => {
      const result = determineErrorValue({
        newFormValidatorError: null,
        isPreviousErrorFromFormValidator: false,
        previousErrorValue: 'Field error',
      })

      expect(result).toEqual({
        newErrorValue: 'Field error',
        newSource: 'field',
      })
    })

    it('should handle case when previous error is null', () => {
      const result = determineErrorValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: false,
        previousErrorValue: null,
      })

      expect(result).toEqual({
        newErrorValue: null,
        newSource: 'field',
      })
    })

    it('should handle case when previous error is undefined', () => {
      const result = determineErrorValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: false,
        previousErrorValue: undefined,
      })

      expect(result).toEqual({
        newErrorValue: undefined,
        newSource: 'field',
      })
    })
  })

  describe('edge cases', () => {
    it('should handle complex previous error objects', () => {
      const complexError = { message: 'Complex field error', code: 456 }
      const result = determineErrorValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: false,
        previousErrorValue: complexError,
      })

      expect(result).toEqual({
        newErrorValue: complexError,
        newSource: 'field',
      })
    })

    it('should treat falsy values as not errors', () => {
      // This is consistent with current behavior as of v1.1.2

      // Test with empty string
      const result1 = determineErrorValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: true,
        previousErrorValue: '',
      })
      expect(result1).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })

      // Test with 0
      const result2 = determineErrorValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: true,
        previousErrorValue: 0,
      })
      expect(result2).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })

      // Test with false
      const result3 = determineErrorValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: true,
        previousErrorValue: false,
      })
      expect(result3).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })
    })

    it('should prioritize form validator errors over field errors', () => {
      // Note that field level validation will prioritize field errors over form errors, this function is only used for form level validation
      const result = determineErrorValue({
        newFormValidatorError: 'Form error',
        isPreviousErrorFromFormValidator: false,
        previousErrorValue: 'Field error',
      })

      expect(result).toEqual({
        newErrorValue: 'Form error',
        newSource: 'form',
      })
    })
  })
})
