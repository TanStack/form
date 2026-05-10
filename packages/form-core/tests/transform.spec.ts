import { expect, it } from 'vitest'
import { FieldApi, FormApi, mergeAndUpdate, mergeForm } from '../src'
import type { AnyFormState } from '../src'

it('transform option does not invalidate state for the field', () => {
  const state: Partial<AnyFormState> = {
    errorMap: {
      onChange: {
        fields: {
          age: 'Age is required',
        },
      },
    },
  }

  const form = new FormApi({
    defaultValues: {
      age: 0,
    },
  })

  form.mount()

  const ageField = new FieldApi({
    form,
    name: 'age',
  })

  ageField.mount()

  expect(ageField.state.meta.isValid).toBe(true)

  mergeAndUpdate(form, (f) => mergeForm(f, state))

  expect(ageField.state.meta.isValid).toBe(false)
})
