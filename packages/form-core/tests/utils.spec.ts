import { describe, expect, it } from 'vitest'
import {
  deepEqual,
  deleteBy,
  determineFieldLevelErrorSourceAndValue,
  determineFormLevelErrorSourceAndValue,
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

describe('determineFormLevelErrorSourceAndValue', () => {
  describe('when a new form validator error exists', () => {
    it('should return the new form error with source "form"', () => {
      const result = determineFormLevelErrorSourceAndValue({
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
      const result = determineFormLevelErrorSourceAndValue({
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
      const result = determineFormLevelErrorSourceAndValue({
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
      const result = determineFormLevelErrorSourceAndValue({
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
      const result = determineFormLevelErrorSourceAndValue({
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
      const result = determineFormLevelErrorSourceAndValue({
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
      const result = determineFormLevelErrorSourceAndValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: false,
        previousErrorValue: undefined,
      })

      expect(result).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })
    })

    it('should handle case when previous error is undefined', () => {
      const result = determineFormLevelErrorSourceAndValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: false,
        previousErrorValue: undefined,
      })

      expect(result).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })
    })
  })

  describe('edge cases', () => {
    it('should handle complex previous error objects', () => {
      const complexError = { message: 'Complex field error', code: 456 }
      const result = determineFormLevelErrorSourceAndValue({
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
      const result1 = determineFormLevelErrorSourceAndValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: true,
        previousErrorValue: '',
      })
      expect(result1).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })

      // Test with 0
      const result2 = determineFormLevelErrorSourceAndValue({
        newFormValidatorError: undefined,
        isPreviousErrorFromFormValidator: true,
        previousErrorValue: 0,
      })
      expect(result2).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })

      // Test with false
      const result3 = determineFormLevelErrorSourceAndValue({
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
      const result = determineFormLevelErrorSourceAndValue({
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

describe('determineFieldLevelErrorSourceAndValue', () => {
  describe('when a field level error exists', () => {
    it('should prioritize field error over form error', () => {
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: 'Field error',
        formLevelError: 'Form error',
      })

      expect(result).toEqual({
        newErrorValue: 'Field error',
        newSource: 'field',
      })
    })

    it('should return the field error when no form error exists', () => {
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: 'Field error',
        formLevelError: undefined,
      })

      expect(result).toEqual({
        newErrorValue: 'Field error',
        newSource: 'field',
      })
    })

    it('should handle complex field error objects', () => {
      const complexError = { message: 'Complex field error', code: 123 }
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: complexError,
        formLevelError: 'Form error',
      })

      expect(result).toEqual({
        newErrorValue: complexError,
        newSource: 'field',
      })
    })
  })

  describe('when no field level error exists', () => {
    it('should use form error when field error is undefined', () => {
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: undefined,
        formLevelError: 'Form error',
      })

      expect(result).toEqual({
        newErrorValue: 'Form error',
        newSource: 'form',
      })
    })

    it('should use form error when field error is null', () => {
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: null,
        formLevelError: 'Form error',
      })

      expect(result).toEqual({
        newErrorValue: 'Form error',
        newSource: 'form',
      })
    })

    it('should handle complex form error objects', () => {
      const complexError = { message: 'Complex form error', code: 789 }
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: undefined,
        formLevelError: complexError,
      })

      expect(result).toEqual({
        newErrorValue: complexError,
        newSource: 'form',
      })
    })
  })

  describe('when neither field nor form level errors exist', () => {
    it('should clear the error when both are undefined', () => {
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: undefined,
        formLevelError: undefined,
      })

      expect(result).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })
    })

    it('should clear the error when both are null', () => {
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: null,
        formLevelError: null,
      })

      expect(result).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })
    })
  })

  describe('edge cases', () => {
    it('should treat empty string as not an error', () => {
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: '',
        formLevelError: undefined,
      })

      expect(result).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })
    })

    it('should treat zero as not an error', () => {
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: 0,
        formLevelError: undefined,
      })

      expect(result).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })
    })

    it('should treat false as not an error', () => {
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: false,
        formLevelError: undefined,
      })

      expect(result).toEqual({
        newErrorValue: undefined,
        newSource: undefined,
      })
    })

    it('should prioritize field level errors over form level errors', () => {
      const result = determineFieldLevelErrorSourceAndValue({
        fieldLevelError: 'Field error',
        formLevelError: 'Form error',
      })

      expect(result).toEqual({
        newErrorValue: 'Field error',
        newSource: 'field',
      })
    })
  })
})

describe('deepEqual', () => {
  it('should test equality between primitives', () => {
    const numbersTrue = deepEqual(1, 1)
    expect(numbersTrue).toEqual(true)

    const stringFalse = deepEqual('uh oh', '')
    expect(stringFalse).toEqual(false)

    const boolTrue = deepEqual(true, true)
    expect(boolTrue).toEqual(true)

    const nullFalse = deepEqual(null, {})
    expect(nullFalse).toEqual(false)

    const undefinedFalse = deepEqual(undefined, null)
    expect(undefinedFalse).toEqual(false)
  })

  it('should test equality between arrays', () => {
    const arrayTrue = deepEqual([], [])
    expect(arrayTrue).toEqual(true)

    const arrayDeepTrue = deepEqual([[1]], [[1]])
    expect(arrayDeepTrue).toEqual(true)

    const arrayFalse = deepEqual([], [''])
    expect(arrayFalse).toEqual(false)

    const arrayDeepFalse = deepEqual([[1]], [])
    expect(arrayDeepFalse).toEqual(false)

    const arrayComplexFalse = deepEqual([[{ test: 'true' }], null], [[1], {}])
    expect(arrayComplexFalse).toEqual(false)

    const arrayComplexTrue = deepEqual(
      [[{ test: 'true' }], null],
      [[{ test: 'true' }], null],
    )
    expect(arrayComplexTrue).toEqual(true)
  })

  it('should test equality between objects', () => {
    const objTrue = deepEqual({ test: 'same' }, { test: 'same' })
    expect(objTrue).toEqual(true)

    const objFalse = deepEqual({ test: 'not' }, { test: 'same' })
    expect(objFalse).toEqual(false)

    const objDeepFalse = deepEqual({ test: 'not' }, { test: { test: 'same' } })
    expect(objDeepFalse).toEqual(false)

    const objDeepArrFalse = deepEqual({ test: [] }, { test: [[]] })
    expect(objDeepArrFalse).toEqual(false)

    const objNullFalse = deepEqual({ test: '' }, null)
    expect(objNullFalse).toEqual(false)

    const objComplexFalse = deepEqual(
      { test: { testTwo: '' }, arr: [[1]] },
      { test: { testTwo: false }, arr: [[1], [0]] },
    )
    expect(objComplexFalse).toEqual(false)

    const objComplexTrue = deepEqual(
      { test: { testTwo: '' }, arr: [[1]] },
      { test: { testTwo: '' }, arr: [[1]] },
    )
    expect(objComplexTrue).toEqual(true)
  })
})
