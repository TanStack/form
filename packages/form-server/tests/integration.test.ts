import { describe, expect, it, vi } from 'vitest'
import {
  applyServerErrors,
  mapServerErrors,
  onServerSuccess,
} from '../src/index'

describe('integration tests', () => {
  it('should handle complete error mapping and application flow', () => {
    const mockForm = {
      setFieldMeta: vi.fn(),
      setFormMeta: vi.fn(),
      reset: vi.fn(),
    }

    const serverError = {
      issues: [
        { path: ['name'], message: 'Name is required' },
        { path: ['email'], message: 'Invalid email format' },
        { path: ['items', 0, 'price'], message: 'Price must be positive' },
      ],
    }

    const mappedErrors = mapServerErrors(serverError)

    applyServerErrors(mockForm, mappedErrors)

    expect(mockForm.setFieldMeta).toHaveBeenCalledTimes(3)
    expect(mockForm.setFieldMeta).toHaveBeenCalledWith(
      'name',
      expect.any(Function),
    )
    expect(mockForm.setFieldMeta).toHaveBeenCalledWith(
      'email',
      expect.any(Function),
    )
    expect(mockForm.setFieldMeta).toHaveBeenCalledWith(
      'items.0.price',
      expect.any(Function),
    )
  })

  it('should handle success flow with all options', async () => {
    const mockForm = {
      reset: vi.fn(),
    }
    const mockFlashSet = vi.fn()
    const mockAfter = vi.fn()

    const serverResponse = { id: 123, message: 'User created successfully' }

    await onServerSuccess(mockForm, serverResponse, {
      resetStrategy: 'all',
      flash: {
        set: mockFlashSet,
        message: 'User created successfully!',
      },
      after: mockAfter,
    })

    expect(mockForm.reset).toHaveBeenCalledWith()
    expect(mockFlashSet).toHaveBeenCalledWith('User created successfully!')
    expect(mockAfter).toHaveBeenCalled()
  })

  it('should handle mixed field and form errors', () => {
    const mockForm = {
      setFieldMeta: vi.fn(),
      setFormMeta: vi.fn(),
    }

    const serverError = {
      fieldErrors: [{ path: 'username', message: 'Username already taken' }],
      formError: { message: 'Account creation failed' },
    }

    const mappedErrors = mapServerErrors(serverError)
    applyServerErrors(mockForm, mappedErrors)

    expect(mockForm.setFieldMeta).toHaveBeenCalledWith(
      'username',
      expect.any(Function),
    )
    expect(mockForm.setFormMeta).toHaveBeenCalledWith(expect.any(Function))

    const fieldCallback = mockForm.setFieldMeta.mock.calls[0]?.[1]
    const fieldMeta = fieldCallback?.({ errorMap: {}, errorSourceMap: {} })
    expect(fieldMeta?.errorMap.onServer).toBe('Username already taken')

    const formCallback = mockForm.setFormMeta.mock.calls[0]?.[0]
    const formMeta = formCallback?.({ errorMap: {}, errorSourceMap: {} })
    expect(formMeta?.errorMap.onServer).toBe('Account creation failed')
  })

  it('should handle path mapping with complex nested structures', () => {
    const serverError = {
      errors: {
        'user[profile][addresses][0][street]': 'Street is required',
        'items[1][variants][0][price]': 'Price must be positive',
      },
    }

    const mappedErrors = mapServerErrors(serverError)

    expect(mappedErrors).toEqual({
      fields: {
        'user.profile.addresses.0.street': ['Street is required'],
        'items.1.variants.0.price': ['Price must be positive'],
      },
    })
  })

  it('should handle custom path mapper with real-world scenario', () => {
    const railsError = {
      errors: {
        'user_attributes[profile_attributes][name]': 'Name is required',
        'items_attributes[0][name]': 'Item name is required',
        'items_attributes[0][price]': 'Price must be positive',
      },
    }

    const pathMapper = (path: string) => {
      return path
        .replace(/_attributes/g, '')
        .replace(/\[(\d+)\]/g, '.$1')
        .replace(/\[([^\]]+)\]/g, '.$1')
        .replace(/^\./, '')
    }

    const mappedErrors = mapServerErrors(railsError, { pathMapper })

    expect(mappedErrors).toEqual({
      fields: {
        'user.profile.name': ['Name is required'],
        'items.0.name': ['Item name is required'],
        'items.0.price': ['Price must be positive'],
      },
    })
  })
})
