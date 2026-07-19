import {
  InternalFormApi,
  InternalFormGroupApi,
} from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import { createFieldIdentityController } from '../src/bridge/fields/identity'
import { getFieldRowsSnapshot } from '../src/bridge/fields/list'

describe('form devtools bridge field snapshots', () => {
  it('includes mounted and unmounted fields and omits raw values', () => {
    const identity = createFieldIdentityController()
    const form = new InternalFormApi({
      defaultValues: { name: 'Ada', password: 'secret' },
    })
    const mountedField = form._getOrCreateFieldApi({ name: 'name' })
    form._getOrCreateFieldApi({ name: 'password' })
    const unregister = mountedField._register()

    try {
      const rows = getFieldRowsSnapshot(form, identity)
      const row = rows[0]!

      expect(rows).toHaveLength(2)
      expect(row.path).toBe('name')
      expect(row.fieldId).toEqual(expect.any(String))
      expect(row.summary).toBeUndefined()
      expect(Object.keys(row).sort()).toEqual(['fieldId', 'path'])
      expect(rows[1]).toEqual({
        fieldId: expect.any(String),
        path: 'password',
        isMounted: false,
      })

      mountedField.handleChange('Grace')
      expect(getFieldRowsSnapshot(form, identity)[0]?.summary).toEqual({
        isDirty: true,
        isTouched: true,
        isDefaultValue: false,
      })

      mountedField._setMeta((meta) => ({ ...meta, isDirty: false }))
      expect(getFieldRowsSnapshot(form, identity)[0]?.summary).toEqual({
        isTouched: true,
        isDefaultValue: false,
      })

      mountedField._setMeta((meta) => ({ ...meta, isTouched: false }))
      expect(getFieldRowsSnapshot(form, identity)[0]?.summary).toEqual({
        isDefaultValue: false,
      })

      mountedField._setMeta((meta) => ({ ...meta, isBlurred: true }))
      expect(getFieldRowsSnapshot(form, identity)[0]?.summary).toEqual({
        isBlurred: true,
        isDefaultValue: false,
      })

      mountedField._setMeta((meta) => ({ ...meta, isBlurred: false }))
      expect(getFieldRowsSnapshot(form, identity)[0]?.summary).toEqual({
        isDefaultValue: false,
      })

      mountedField.handleChange('Ada', {
        markAsDirty: false,
        markAsTouched: false,
        causeValidation: false,
      })
      expect(getFieldRowsSnapshot(form, identity)[0]?.summary).toBeUndefined()

      mountedField._setMeta((meta) => ({
        ...meta,
        _fieldValidatorErrors: [[{ message: 'Invalid name' }]],
      }))
      expect(getFieldRowsSnapshot(form, identity)[0]?.summary).toEqual({
        hasSelfErrors: true,
        validity: 'invalid',
      })

      mountedField._setMeta((meta) => ({
        ...meta,
        _fieldValidatorErrors: [[]],
      }))
      expect(getFieldRowsSnapshot(form, identity)[0]?.summary).toBeUndefined()
    } finally {
      unregister()
    }
  })

  it('represents nested fields without transporting trie linkage', () => {
    const identity = createFieldIdentityController()
    const form = new InternalFormApi({
      defaultValues: { user: { profile: { name: '' } } },
    })
    form._getOrCreateFieldApi({ name: 'user.profile.name' })

    const rows = getFieldRowsSnapshot(form, identity)
    expect(rows.map(({ path }) => path)).toEqual([
      'user',
      'user.profile',
      'user.profile.name',
    ])
    expect(rows.map((row) => Object.keys(row).sort())).toEqual([
      ['fieldId', 'isMounted', 'path'],
      ['fieldId', 'isMounted', 'path'],
      ['fieldId', 'isMounted', 'path'],
    ])
  })

  it('keeps unmounted fields while their summaries change', () => {
    const identity = createFieldIdentityController()
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    const fieldId = getFieldRowsSnapshot(form, identity)[0]!.fieldId
    expect(getFieldRowsSnapshot(form, identity)).toEqual([
      { fieldId, path: 'name', isMounted: false },
    ])

    field._setMeta((meta) => ({
      ...meta,
      _fieldValidatorErrors: [[{ message: 'Invalid name' }]],
    }))
    expect(getFieldRowsSnapshot(form, identity)).toEqual([
      {
        fieldId,
        path: 'name',
        isMounted: false,
        summary: { hasSelfErrors: true, validity: 'invalid' },
      },
    ])

    field._setMeta((meta) => ({
      ...meta,
      _fieldValidatorErrors: [[]],
    }))
    expect(getFieldRowsSnapshot(form, identity)).toEqual([
      { fieldId, path: 'name', isMounted: false },
    ])
  })

  it('excludes FormGroup backing fields', () => {
    const identity = createFieldIdentityController()
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { wrong: '' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'guestDetails' })
    const child = form._getOrCreateFieldApi({ name: 'guestDetails.wrong' })
    const group = new InternalFormGroupApi({ form, name: 'guestDetails' })

    try {
      child._setMeta((meta) => ({
        ...meta,
        _fieldValidatorErrors: [[{ message: 'Invalid field' }]],
      }))

      expect(parent.state.meta.isValid).toBe(false)
      expect(getFieldRowsSnapshot(form, identity)).toEqual([
        {
          fieldId: expect.any(String),
          path: 'guestDetails.wrong',
          isMounted: false,
          summary: { hasSelfErrors: true, validity: 'invalid' },
        },
      ])
    } finally {
      group._cleanup()
    }
  })

  it('distinguishes errors hidden by error visibility', () => {
    const identity = createFieldIdentityController()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      errorVisibility: () => false,
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregister = field._register()

    try {
      field._setMeta((meta) => ({
        ...meta,
        _fieldValidatorErrors: [[{ message: 'Invalid name' }]],
      }))

      expect(field.meta.isValid).toBe(true)
      expect(field.meta.original.isValid).toBe(false)
      expect(getFieldRowsSnapshot(form, identity)[0]?.summary).toEqual({
        hasSelfErrors: true,
        validity: 'invalidHidden',
      })
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
      const before = getFieldRowsSnapshot(form, identity).find(
        (row) => row.path === 'items[0]',
      )!

      form.swapFieldValues('items', 0, 1)

      const after = getFieldRowsSnapshot(form, identity).find(
        (row) => row.path === 'items[1]',
      )!
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
      const movedFieldId = getFieldRowsSnapshot(form, identity).find(
        (row) => row.path === 'items[1]',
      )!.fieldId

      form.removeFieldValue('items', 0)

      const rows = getFieldRowsSnapshot(form, identity)
      expect(rows).toHaveLength(2)
      expect(rows).toEqual(
        expect.arrayContaining([
          {
            path: 'items',
            fieldId: expect.any(String),
            isMounted: false,
            summary: {
              isDirty: true,
              isTouched: true,
              isDefaultValue: false,
            },
          },
          {
            path: 'items[0]',
            fieldId: movedFieldId,
            summary: { isDefaultValue: false },
          },
        ]),
      )
    } finally {
      unregisterRemoved()
      unregisterMoved()
    }
  })
})
