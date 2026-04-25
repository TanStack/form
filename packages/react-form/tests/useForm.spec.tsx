import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useForm } from '../src'

describe('FormApi', () => {
  it('should mount the form to the dom', () => {
    const { result } = renderHook(() => {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })

      return form
    })

    expect(result.current.state.values).toEqual({ name: 'tony-hawk' })
  })
})
