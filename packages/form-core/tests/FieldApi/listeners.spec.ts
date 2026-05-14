import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi.lib'

describe('field - listeners', () => {
  it('change listeners', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ triggers: ['change'], run: listener }],
    })

    field.handleChange('x')
    expect(listener).toHaveBeenCalledOnce()
  })

  it('blur listeners', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ triggers: ['blur'], run: listener }],
    })

    field.handleBlur()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('reset listeners', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ triggers: ['reset'], run: listener }],
    })

    field.reset()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('mount listeners', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ triggers: ['mount'], run: listener }],
    })

    field._register()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('unmount listeners', () => {
    const listener = vi.fn()

    const form = new InternalFormApi({ defaultValues: { x: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'x',
      listeners: [{ triggers: ['unmount'], run: listener }],
    })

    field._register()
    field._unregister()
    expect(listener).toHaveBeenCalledOnce()
  })
})

describe('field - linked listeners ', () => {
  it('change listeners', () => {})

  it('blur listeners', () => {})
})
