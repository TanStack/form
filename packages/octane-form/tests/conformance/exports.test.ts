import { describe, expect, it } from 'vitest'
import { renderHook } from '@octanejs/testing-library'
import { act } from 'octane'
import { FormApi, useSelector } from '@tanstack/octane-form'

describe('package exports', () => {
  it('exports useSelector from the Octane Store adapter', () => {
    expect(useSelector).toBeTypeOf('function')
  })
})

describe('useSelector', () => {
  it('keeps multiple subscriptions in the same component independent', () => {
    const form = new FormApi({
      defaultValues: { firstName: 'Ada', lastName: 'Lovelace' },
    })
    const { result } = renderHook(() => ({
      firstName: useSelector(form.store, (state) => state.values.firstName),
      lastName: useSelector(form.store, (state) => state.values.lastName),
    }))

    expect(result.current).toEqual({ firstName: 'Ada', lastName: 'Lovelace' })
    act(() => form.setFieldValue('firstName', 'Grace'))
    expect(result.current).toEqual({ firstName: 'Grace', lastName: 'Lovelace' })
    act(() => form.setFieldValue('lastName', 'Hopper'))
    expect(result.current).toEqual({ firstName: 'Grace', lastName: 'Hopper' })
  })
})
