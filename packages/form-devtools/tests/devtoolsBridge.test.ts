import { InternalFormApi } from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import { createFieldIdentityController } from '../src/bridge/fields/identity'
import { getMountedFieldRowsSnapshot } from '../src/bridge/fields/list'

describe('form devtools bridge field snapshots', () => {
  it('includes mounted fields only and omits raw values', () => {
    const identity = createFieldIdentityController()
    const form = new InternalFormApi({
      defaultValues: { name: 'Ada', password: 'secret' },
    })
    const mountedField = form._getOrCreateFieldApi({ name: 'name' })
    form._getOrCreateFieldApi({ name: 'password' })
    const unregister = mountedField._register()

    try {
      const rows = getMountedFieldRowsSnapshot(form, identity)
      const row = rows[0]!

      expect(rows).toHaveLength(1)
      expect(row.path).toBe('name')
      expect(row.fieldId).toEqual(expect.any(String))
      expect(Object.keys(row).sort()).toEqual(['fieldId', 'path'])
    } finally {
      unregister()
    }
  })

  it('keeps field identity stable when a mounted field path changes', () => {
    const identity = createFieldIdentityController()
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items[0]' })
    const unregister = field._register()

    try {
      const before = getMountedFieldRowsSnapshot(form, identity)[0]!

      form.swapFieldValues('items', 0, 1)

      const after = getMountedFieldRowsSnapshot(form, identity)[0]!
      expect(before.path).toBe('items[0]')
      expect(after.path).toBe('items[1]')
      expect(after.fieldId).toBe(before.fieldId)
    } finally {
      unregister()
    }
  })

  it('drops killed fields and keeps moved mounted fields after removal', () => {
    const identity = createFieldIdentityController()
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b'] },
    })
    const removedField = form._getOrCreateFieldApi({ name: 'items[0]' })
    const movedField = form._getOrCreateFieldApi({ name: 'items[1]' })
    const unregisterRemoved = removedField._register()
    const unregisterMoved = movedField._register()

    try {
      const movedFieldId = getMountedFieldRowsSnapshot(form, identity).find(
        (row) => row.path === 'items[1]',
      )!.fieldId

      form.removeFieldValue('items', 0)

      const rows = getMountedFieldRowsSnapshot(form, identity)
      expect(rows).toEqual([{ path: 'items[0]', fieldId: movedFieldId }])
    } finally {
      unregisterRemoved()
      unregisterMoved()
    }
  })
})
