import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { useForm } from '../src'

describe('useForm', () => {
  it('should mount the form to the dom', () => {
    const { result } = renderHook(() => {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })

      return form
    })

    expect(result.current.state.values).toEqual({ name: 'tony-hawk' })
  })

  it('uses a supplied formId', () => {
    const { result } = renderHook(() =>
      useForm({
        formId: 'signup-form',
        defaultValues: { name: '' },
      }),
    )

    expect(result.current.formId).toBe('signup-form')
  })

  it('creates a stable formId when one is not supplied', () => {
    const { result, rerender } = renderHook(() =>
      useForm({ defaultValues: { name: '' } }),
    )
    const formId = result.current.formId

    expect(formId).toBeTypeOf('string')
    expect(formId.length).toBeGreaterThan(0)

    rerender()

    expect(result.current.formId).toBe(formId)
  })

  it('should support async defaultValues with useState', () => {
    const { result } = renderHook(() => {
      const [defaultValues, setDefaultValues] = useState({ name: 'initial' })
      const form = useForm({ defaultValues })
      return { form, setDefaultValues }
    })

    expect(result.current.form.state.values).toEqual({ name: 'initial' })

    act(() => {
      result.current.setDefaultValues({ name: 'async-value' })
    })

    expect(result.current.form.state.values).toEqual({ name: 'async-value' })
  })

  it('should not overwrite a touched field with async defaultValues', () => {
    const { result } = renderHook(() => {
      const [defaultValues, setDefaultValues] = useState({
        name: 'initial',
        age: 0,
      })
      const form = useForm({ defaultValues })
      return { form, setDefaultValues }
    })

    // Touch the name field
    act(() => {
      result.current.form.setFieldValue('name', 'touched')
    })

    // Update defaultValues - name is touched so should NOT be overwritten
    act(() => {
      result.current.setDefaultValues({ name: 'new-default', age: 99 })
    })

    expect(result.current.form.state.values.name).toBe('touched')
    expect(result.current.form.state.values.age).toBe(99)
  })

  it('should overwrite field B if only field A was touched and B is not a child of A', async () => {
    const { result } = renderHook(() => {
      const [defaultValues, setDefaultValues] = useState({
        a: { nested: 'initial-a' },
        b: 'initial-b',
      })
      const form = useForm({ defaultValues })
      return { form, setDefaultValues }
    })

    // Touch field A
    act(() => {
      result.current.form.setFieldValue('a.nested', 'touched-a')
    })

    await vi.waitFor(() => {
      expect(result.current.form.state.values.a.nested).toBe('touched-a')
    })

    // Update defaultValues
    act(() => {
      result.current.setDefaultValues({
        a: { nested: 'new-a' },
        b: 'new-b',
      })
    })

    await vi.waitFor(() => {
      // A should keep its touched value, B should be overwritten
      expect(result.current.form.state.values.a.nested).toBe('touched-a')
      expect(result.current.form.state.values.b).toBe('new-b')
    })
  })
})
