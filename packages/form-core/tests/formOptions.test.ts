import { describe, expect, it } from 'vitest'
import { FormApi, formOptions } from '../src/index'

describe('formOptions', () => {
  it('should allow default values to be set', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      } as Person,
    })

    const form = new FormApi({
      ...formOpts,
    })

    expect(form.state.values['firstName']).toBe('FirstName')
    expect(form.state.values['lastName']).toBe('LastName')
  })
})
