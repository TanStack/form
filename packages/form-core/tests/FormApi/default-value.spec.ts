import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('form - isDefaultValue', () => {
  it('tracks whether current values deeply equal default values', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })

    expect(form.state.isDefaultValue).toBe(true)

    form.setFieldValue('name', 'Alice')
    expect(form.state.isDefaultValue).toBe(false)

    form.setFieldValue('name', '')
    expect(form.state.isDefaultValue).toBe(true)
    expect(form.state.isDirty).toBe(true)
    expect(form.state.isPristine).toBe(false)
  })

  it('uses deep equality rather than reference equality', () => {
    const form = new InternalFormApi({
      defaultValues: { profile: { name: 'Tony', tags: ['skater'] } },
    })

    form.setFieldValue('profile', { name: 'Tony', tags: ['skater'] })
    expect(form.state.isDefaultValue).toBe(true)

    form.setFieldValue('profile.tags', ['skater', 'legend'])
    expect(form.state.isDefaultValue).toBe(false)
  })

  it('returns to true after field and form resets', () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', items: ['a', 'b'] },
    })

    form.setFieldValue('name', 'Alice')
    expect(form.state.isDefaultValue).toBe(false)

    form.resetField('name')
    expect(form.state.isDefaultValue).toBe(true)

    form.pushFieldValue('items', 'c')
    expect(form.state.isDefaultValue).toBe(false)

    form.reset()
    expect(form.state.isDefaultValue).toBe(true)
  })

  it('keeps isDefaultValue lazy for eager form state snapshots', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const getIsDefaultValue = vi.spyOn(form, '_getIsDefaultValue')

    const state = form.atom.get()

    expect(getIsDefaultValue).not.toHaveBeenCalled()
    expect(state.isDirty).toBe(false)
    expect(getIsDefaultValue).not.toHaveBeenCalled()
    expect(Object.keys(state)).toContain('isDefaultValue')
    expect(getIsDefaultValue).not.toHaveBeenCalled()

    expect(state.isDefaultValue).toBe(true)
    expect(getIsDefaultValue).toHaveBeenCalledOnce()
  })

  it('recomputes when defaultValues update', () => {
    const form = new InternalFormApi({ defaultValues: { name: 'initial' } })

    form.setFieldValue('name', 'current')
    expect(form.state.isDefaultValue).toBe(false)

    form._update({ defaultValues: { name: 'current' } })
    expect(form.state.isDefaultValue).toBe(true)
  })

  it('updates default values by default when resetting to new values', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })

    form.setFieldValue('name', 'dirty')
    form.reset({ name: 'reset default' })

    expect(form.state.values).toEqual({ name: 'reset default' })
    expect(form.defaultValues).toEqual({ name: 'reset default' })
    expect(form.state.isDefaultValue).toBe(true)
  })

  it('can reset values without updating default values', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })

    form.setFieldValue('name', 'dirty')
    form.reset({ name: 'reset value' }, { updateDefaultValues: false })

    expect(form.state.values).toEqual({ name: 'reset value' })
    expect(form.defaultValues).toEqual({ name: '' })
    expect(form.state.isDirty).toBe(false)
    expect(form.state.isDefaultValue).toBe(false)

    form.reset()
    expect(form.state.values).toEqual({ name: '' })
    expect(form.state.isDefaultValue).toBe(true)
  })
})
