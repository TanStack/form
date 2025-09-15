import { describe, expect, it, vi } from 'vitest'
import { onServerSuccess } from '../src/index'
import type { SuccessOptions } from '../src/index'

describe('onServerSuccess', () => {
  it('should handle success with no options', async () => {
    const mockForm = {
      reset: vi.fn(),
    }

    await onServerSuccess(mockForm, { success: true })

    expect(mockForm.reset).not.toHaveBeenCalled()
  })

  it('should reset values only when resetStrategy is "values"', async () => {
    const mockForm = {
      reset: vi.fn(),
    }

    const options: SuccessOptions = {
      resetStrategy: 'values',
    }

    await onServerSuccess(mockForm, { success: true }, options)

    expect(mockForm.reset).toHaveBeenCalledWith({ resetValidation: false })
  })

  it('should reset all when resetStrategy is "all"', async () => {
    const mockForm = {
      reset: vi.fn(),
    }

    const options: SuccessOptions = {
      resetStrategy: 'all',
    }

    await onServerSuccess(mockForm, { success: true }, options)

    expect(mockForm.reset).toHaveBeenCalledWith()
  })

  it('should not reset when resetStrategy is "none"', async () => {
    const mockForm = {
      reset: vi.fn(),
    }

    const options: SuccessOptions = {
      resetStrategy: 'none',
    }

    await onServerSuccess(mockForm, { success: true }, options)

    expect(mockForm.reset).not.toHaveBeenCalled()
  })

  it('should set flash message when provided', async () => {
    const mockForm = {}
    const mockFlashSet = vi.fn()

    const options: SuccessOptions = {
      flash: {
        set: mockFlashSet,
        message: 'Success! Data saved.',
      },
    }

    await onServerSuccess(mockForm, { success: true }, options)

    expect(mockFlashSet).toHaveBeenCalledWith('Success! Data saved.')
  })

  it('should not set flash message when no message provided', async () => {
    const mockForm = {}
    const mockFlashSet = vi.fn()

    const options: SuccessOptions = {
      flash: {
        set: mockFlashSet,
      },
    }

    await onServerSuccess(mockForm, { success: true }, options)

    expect(mockFlashSet).not.toHaveBeenCalled()
  })

  it('should execute after callback', async () => {
    const mockForm = {}
    const mockAfter = vi.fn()

    const options: SuccessOptions = {
      after: mockAfter,
    }

    await onServerSuccess(mockForm, { success: true }, options)

    expect(mockAfter).toHaveBeenCalled()
  })

  it('should execute async after callback', async () => {
    const mockForm = {}
    const mockAfter = vi.fn().mockResolvedValue(undefined)

    const options: SuccessOptions = {
      after: mockAfter,
    }

    await onServerSuccess(mockForm, { success: true }, options)

    expect(mockAfter).toHaveBeenCalled()
  })

  it('should execute operations in correct order', async () => {
    const mockForm = {
      reset: vi.fn(),
    }
    const mockFlashSet = vi.fn()
    const mockAfter = vi.fn()

    const options: SuccessOptions = {
      resetStrategy: 'all',
      flash: {
        set: mockFlashSet,
        message: 'Success!',
      },
      after: mockAfter,
    }

    await onServerSuccess(mockForm, { success: true }, options)

    expect(mockForm.reset).toHaveBeenCalled()
    expect(mockFlashSet).toHaveBeenCalledWith('Success!')
    expect(mockAfter).toHaveBeenCalled()

    const resetCallOrder = mockForm.reset.mock.invocationCallOrder[0]!
    const flashCallOrder = mockFlashSet.mock.invocationCallOrder[0]!
    const afterCallOrder = mockAfter.mock.invocationCallOrder[0]!

    expect(resetCallOrder).toBeLessThan(flashCallOrder)
    expect(flashCallOrder).toBeLessThan(afterCallOrder)
  })

  it('should handle form without reset method', async () => {
    const mockForm = {}

    const options: SuccessOptions = {
      resetStrategy: 'all',
    }

    await expect(
      onServerSuccess(mockForm, { success: true }, options),
    ).resolves.toBeUndefined()
  })

  it('should handle all options together', async () => {
    const mockForm = {
      reset: vi.fn(),
    }
    const mockFlashSet = vi.fn()
    const mockAfter = vi.fn()

    const options: SuccessOptions = {
      resetStrategy: 'values',
      flash: {
        set: mockFlashSet,
        message: 'Data saved successfully!',
      },
      after: mockAfter,
    }

    await onServerSuccess(mockForm, { id: 123, name: 'Test' }, options)

    expect(mockForm.reset).toHaveBeenCalledWith({ resetValidation: false })
    expect(mockFlashSet).toHaveBeenCalledWith('Data saved successfully!')
    expect(mockAfter).toHaveBeenCalled()
  })
})
