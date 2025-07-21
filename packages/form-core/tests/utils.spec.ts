import { describe, expect, it } from 'vitest'
import {
  deleteBy,
  determineFieldLevelErrorSourceAndValue,
  determineFormLevelErrorSourceAndValue,
  evaluate,
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

  it('should preserve arrays when setting them within other arrays', () => {
    const table: { field: { value: number }[][] } = {
      field: [
        [
          {
            value: 0,
          },
          {
            value: 1,
          },
        ],
        [
          {
            value: 2,
          },
        ],
      ],
    }

    const newTable = setBy(table, 'field[0][1].value', 2)
    expect(newTable.field).toStrictEqual([
      [
        {
          value: 0,
        },
        {
          value: 2,
        },
      ],
      [
        {
          value: 2,
        },
      ],
    ])
  })

  it('should correctly set a value on a key with leading zeros', () => {
    const initial = { name: 'test' }
    const result = setBy(initial, '01234', 'some-value')

    expect(result).toHaveProperty('01234')
    expect(result['01234']).toBe('some-value')

    expect(result).not.toHaveProperty('1234')
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
  it('should convert chained property access', () => {
    expect(makePathArray('a')).toEqual(['a'])
    expect(makePathArray('a.b')).toEqual(['a', 'b'])
    expect(makePathArray('foo.bar.baz')).toEqual(['foo', 'bar', 'baz'])
  })

  it('should convert property access followed by array indeces', () => {
    expect(makePathArray('a[0]')).toEqual(['a', 0])
    expect(makePathArray('foo[1]')).toEqual(['foo', 1])
    expect(makePathArray('a.b[2]')).toEqual(['a', 'b', 2])
  })

  it('should convert chained array indeces', () => {
    expect(makePathArray('a[0][1]')).toEqual(['a', 0, 1])
    expect(makePathArray('foo[3][4][5]')).toEqual(['foo', 3, 4, 5])
  })

  it('should convert array indeces followed by property access', () => {
    expect(makePathArray('a[0].b')).toEqual(['a', 0, 'b'])
    expect(makePathArray('foo[1].bar')).toEqual(['foo', 1, 'bar'])
    expect(makePathArray('[2].bar')).toEqual([2, 'bar'])
    expect(makePathArray('[1][5].baz')).toEqual([1, 5, 'baz'])
  })

  it('should convert mixed chains of access', () => {
    expect(makePathArray('a.b[0].c[1].d')).toEqual(['a', 'b', 0, 'c', 1, 'd'])
    expect(makePathArray('x[0].y[1].z')).toEqual(['x', 0, 'y', 1, 'z'])
  })

  it('should handle deeply nested paths', () => {
    expect(makePathArray('a.b[0][1].c.d[2][3].e')).toEqual([
      'a',
      'b',
      0,
      1,
      'c',
      'd',
      2,
      3,
      'e',
    ])
  })

  it('should convert paths starting with multiple array indeces', () => {
    expect(makePathArray('[0][1]')).toEqual([0, 1])
    expect(makePathArray('[2][3].a')).toEqual([2, 3, 'a'])
    expect(makePathArray('[4][5][6].b[7]')).toEqual([4, 5, 6, 'b', 7])
  })

  it('should preserve leading zeros on purely numeric strings', () => {
    expect(makePathArray('01234')).toEqual(['01234'])
    expect(makePathArray('007')).toEqual(['007'])
  })

  it('should still convert non-leading-zero numbers to number types', () => {
    expect(makePathArray('12345')).toEqual([12345])
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

describe('evaluate', () => {
  it('should test equality between primitives', () => {
    const numbersTrue = evaluate(1, 1)
    expect(numbersTrue).toEqual(true)

    const stringFalse = evaluate('uh oh', '')
    expect(stringFalse).toEqual(false)

    const boolTrue = evaluate(true, true)
    expect(boolTrue).toEqual(true)

    const nullFalse = evaluate(null, {})
    expect(nullFalse).toEqual(false)

    const undefinedFalse = evaluate(undefined, null)
    expect(undefinedFalse).toEqual(false)
  })

  it('should test equality between arrays', () => {
    const arrayTrue = evaluate([], [])
    expect(arrayTrue).toEqual(true)

    const arrayDeepSearchTrue = evaluate([[1]], [[1]])
    expect(arrayDeepSearchTrue).toEqual(true)

    const arrayFalse = evaluate([], [''])
    expect(arrayFalse).toEqual(false)

    const arrayDeepFalse = evaluate([[1]], [])
    expect(arrayDeepFalse).toEqual(false)

    const arrayComplexFalse = evaluate([[{ test: 'true' }], null], [[1], {}])
    expect(arrayComplexFalse).toEqual(false)

    const arrayComplexTrue = evaluate(
      [[{ test: 'true' }], null],
      [[{ test: 'true' }], null],
    )
    expect(arrayComplexTrue).toEqual(true)
  })

  it('should test equality between objects', () => {
    const objTrue = evaluate({ test: 'same' }, { test: 'same' })
    expect(objTrue).toEqual(true)

    const objFalse = evaluate({ test: 'not' }, { test: 'same' })
    expect(objFalse).toEqual(false)

    const objDeepFalse = evaluate({ test: 'not' }, { test: { test: 'same' } })
    expect(objDeepFalse).toEqual(false)

    const objDeepArrFalse = evaluate({ test: [] }, { test: [[]] })
    expect(objDeepArrFalse).toEqual(false)

    const objNullFalse = evaluate({ test: '' }, null)
    expect(objNullFalse).toEqual(false)

    const objComplexFalse = evaluate(
      { test: { testTwo: '' }, arr: [[1]] },
      { test: { testTwo: false }, arr: [[1], [0]] },
    )
    expect(objComplexFalse).toEqual(false)

    const objComplexTrue = evaluate(
      { test: { testTwo: '' }, arr: [[1]] },
      { test: { testTwo: '' }, arr: [[1]] },
    )
    expect(objComplexTrue).toEqual(true)
  })
})
