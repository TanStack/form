import { describe, expect, it, vi } from 'vitest'
import {  applyServerErrors } from '../src/index'
import type {MappedServerErrors} from '../src/index';

describe('applyServerErrors', () => {
  it('should apply field errors to form', () => {
    const mockForm = {
      setFieldMeta: vi.fn(),
      setFormMeta: vi.fn(),
    }

    const mappedErrors: MappedServerErrors = {
      fields: {
        name: ['Name is required'],
        email: ['Invalid email format'],
      },
    }

    applyServerErrors(mockForm, mappedErrors)

    expect(mockForm.setFieldMeta).toHaveBeenCalledWith('name', expect.any(Function))
    expect(mockForm.setFieldMeta).toHaveBeenCalledWith('email', expect.any(Function))
    expect(mockForm.setFormMeta).not.toHaveBeenCalled()

    
    const nameCallback = mockForm.setFieldMeta.mock.calls[0]?.[1]
    const prevMeta = { errorMap: {}, errorSourceMap: {} }
    const newMeta = nameCallback?.(prevMeta)

    expect(newMeta).toEqual({
      errorMap: { onServer: 'Name is required' },
      errorSourceMap: { onServer: 'server' },
    })
  })

  it('should apply form-level error', () => {
    const mockForm = {
      setFieldMeta: vi.fn(),
      setFormMeta: vi.fn(),
    }

    const mappedErrors: MappedServerErrors = {
      fields: {},
      form: 'Form submission failed',
    }

    applyServerErrors(mockForm, mappedErrors)

    expect(mockForm.setFieldMeta).not.toHaveBeenCalled()
    expect(mockForm.setFormMeta).toHaveBeenCalledWith(expect.any(Function))

    
    const formCallback = mockForm.setFormMeta.mock.calls[0]?.[0]
    const prevMeta = { errorMap: {}, errorSourceMap: {} }
    const newMeta = formCallback?.(prevMeta)

    expect(newMeta).toEqual({
      errorMap: { onServer: 'Form submission failed' },
      errorSourceMap: { onServer: 'server' },
    })
  })

  it('should apply both field and form errors', () => {
    const mockForm = {
      setFieldMeta: vi.fn(),
      setFormMeta: vi.fn(),
    }

    const mappedErrors: MappedServerErrors = {
      fields: {
        name: ['Name is required'],
      },
      form: 'Form has errors',
    }

    applyServerErrors(mockForm, mappedErrors)

    expect(mockForm.setFieldMeta).toHaveBeenCalledWith('name', expect.any(Function))
    expect(mockForm.setFormMeta).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should preserve existing error maps', () => {
    const mockForm = {
      setFieldMeta: vi.fn(),
      setFormMeta: vi.fn(),
    }

    const mappedErrors: MappedServerErrors = {
      fields: {
        name: ['Server error'],
      },
      form: 'Server form error',
    }

    applyServerErrors(mockForm, mappedErrors)

    
    const fieldCallback = mockForm.setFieldMeta.mock.calls[0]?.[1]
    const prevFieldMeta = {
      errorMap: { onChange: 'Client validation error' },
      errorSourceMap: { onChange: 'client' },
    }
    const newFieldMeta = fieldCallback?.(prevFieldMeta)

    expect(newFieldMeta).toEqual({
      errorMap: { 
        onChange: 'Client validation error',
        onServer: 'Server error' 
      },
      errorSourceMap: { 
        onChange: 'client',
        onServer: 'server' 
      },
    })

    
    const formCallback = mockForm.setFormMeta.mock.calls[0]?.[0]
    const prevFormMeta = {
      errorMap: { onSubmit: 'Client form error' },
      errorSourceMap: { onSubmit: 'client' },
    }
    const newFormMeta = formCallback?.(prevFormMeta)

    expect(newFormMeta).toEqual({
      errorMap: { 
        onSubmit: 'Client form error',
        onServer: 'Server form error' 
      },
      errorSourceMap: { 
        onSubmit: 'client',
        onServer: 'server' 
      },
    })
  })

  it('should handle empty field arrays', () => {
    const mockForm = {
      setFieldMeta: vi.fn(),
      setFormMeta: vi.fn(),
    }

    const mappedErrors: MappedServerErrors = {
      fields: {
        name: [],
        email: ['Email error'],
      },
    }

    applyServerErrors(mockForm, mappedErrors)

    expect(mockForm.setFieldMeta).toHaveBeenCalledTimes(1)
    expect(mockForm.setFieldMeta).toHaveBeenCalledWith('email', expect.any(Function))
  })

  it('should use first error message when multiple exist', () => {
    const mockForm = {
      setFieldMeta: vi.fn(),
      setFormMeta: vi.fn(),
    }

    const mappedErrors: MappedServerErrors = {
      fields: {
        email: ['First error', 'Second error', 'Third error'],
      },
    }

    applyServerErrors(mockForm, mappedErrors)

    const callback = mockForm.setFieldMeta.mock.calls[0]?.[1]
    const newMeta = callback?.({ errorMap: {}, errorSourceMap: {} })

    expect(newMeta.errorMap.onServer).toBe('First error')
  })
})
