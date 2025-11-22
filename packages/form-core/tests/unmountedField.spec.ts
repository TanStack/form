import { describe, expect, it } from 'vitest'
import { FormApi } from '../src/index'

describe('unmounted field validation', () => {
  it('clears validation when setFieldValue is used for an unmounted field', async () => {
    const form = new FormApi<string | any>({
      validators: {
        onChange: ({ value }) => {
          if (!value || !value.name) {
            return { fields: { name: 'Required' } }
          }
          return
        },
      },
    })

    form.mount()

    // populate initial errors
    await form.validateAllFields('change')

    const before = form.getFieldMeta('name')
    expect(before?.errors).toContain('Required')

    // Programmatically set the value for a field that has no mounted FieldApi
    form.setFieldValue('name', 'now valid')

    // allow microtask queue to flush (validation may run sync or async paths)
    await Promise.resolve()

    const after = form.getFieldMeta('name')
    expect(after?.errors).toEqual([])
  })
})
