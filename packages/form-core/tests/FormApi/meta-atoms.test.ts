import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('form - error visibility meta atom subscriptions', () => {
  it('tracks only accessed form metadata through the visibility proxy', () => {
    const errorVisibility = vi.fn(
      ({ state }) => state.submissionAttempts > 0,
    )
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      errorVisibility,
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.store.get()
    errorVisibility.mockClear()

    form._atoms.meta.isDirty.set(true)
    field.store.get()
    expect(errorVisibility).not.toHaveBeenCalled()

    form._atoms.meta.submissionAttempts.set(1)
    field.store.get()
    expect(errorVisibility).toHaveBeenCalledOnce()
  })

  it('tracks form values through the existing whole-values atom', () => {
    const errorVisibility = vi.fn(
      ({ state }) => state.values.name.length > 0,
    )
    const form = new InternalFormApi({
      defaultValues: { name: '', other: '' },
      errorVisibility,
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    field.store.get()
    errorVisibility.mockClear()

    form.setFieldValue('other', 'changed', {
      markAsDirty: false,
      markAsTouched: false,
      causeValidation: false,
    })
    field.store.get()

    expect(errorVisibility).toHaveBeenCalledOnce()
  })
})
