import { describe, expect, it } from 'vitest'
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

  it('recomputes when defaultValues update', () => {
    const form = new InternalFormApi({ defaultValues: { name: 'initial' } })

    form.setFieldValue('name', 'current')
    expect(form.state.isDefaultValue).toBe(false)

    form._update({ defaultValues: { name: 'current' } })
    expect(form.state.isDefaultValue).toBe(true)
  })
})
