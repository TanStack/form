import { describe, expect, it } from 'vitest'
import { mutateMergeDeep } from '@tanstack/react-form'
import { initialFormState } from '../src/createServerValidate'

describe('initialFormState', () => {
  it('should not contain values property', () => {
    expect(initialFormState).not.toHaveProperty('values')
  })

  it('should not override client values when merged', () => {
    const clientState = {
      values: { name: 'client-name' },
      errors: [],
      errorMap: {}
    }

    // @ts-ignore
    mutateMergeDeep(clientState, initialFormState)

    expect(clientState.values).toEqual({ name: 'client-name' })
  })
})
