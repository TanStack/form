import { render, waitFor, screen } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { useForm } from '../src/useForm'
import { describe, it, expect, vi } from 'vitest'

describe('useForm deferred mounting', () => {
  it('should not run onMount listeners or validation until defaultValues are provided', async () => {
    const onMountListener = vi.fn()
    const onMountValidator = vi.fn()

    function Form() {
      const [data, setData] = useState<any>(undefined)

      const form = useForm({
        defaultValues: data,
        listeners: {
          onMount: onMountListener,
        },
        validators: {
          onMount: onMountValidator,
        },
      })

      useEffect(() => {
        setTimeout(() => {
          setData({ firstName: 'Test' })
        }, 100)
      }, [])

      return <div>Form loaded</div>
    }

    render(<Form />)

    // Initially, listeners should not have run
    expect(onMountListener).not.toHaveBeenCalled()
    expect(onMountValidator).not.toHaveBeenCalled()

    // Wait for data to populate
    await waitFor(() => expect(onMountListener).toHaveBeenCalledTimes(1))

    // Check that it ran once
    expect(onMountValidator).toHaveBeenCalledTimes(1)
  })

  it('should run onMount listeners immediately if defaultValues are provided initially', async () => {
    const onMountListener = vi.fn()
    const onMountValidator = vi.fn()

    function Form() {
      const form = useForm({
        defaultValues: { firstName: 'Test' },
        listeners: {
          onMount: onMountListener,
        },
        validators: {
          onMount: onMountValidator,
        },
      })

      return <div>Form loaded</div>
    }

    render(<Form />)

    await waitFor(() => expect(onMountListener).toHaveBeenCalledTimes(1))
    expect(onMountValidator).toHaveBeenCalledTimes(1)
  })

  it('should not run FIELD onMount listeners or validation until defaultValues are provided', async () => {
    const onMountFieldListener = vi.fn()
    const onMountFieldValidator = vi.fn()

    function Form() {
      const [data, setData] = useState<any>(undefined)

      const form = useForm({
        defaultValues: data,
      })

      return (
        <div>
          <form.Field
            name="firstName"
            listeners={{
              onMount: onMountFieldListener,
            }}
            validators={{
              onMount: onMountFieldValidator,
            }}
            children={(field) => (
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <button onClick={() => setData({ firstName: 'Test' })}>
            Load Data
          </button>
        </div>
      )
    }

    render(<Form />)

    // Initially, listeners should not have run
    expect(onMountFieldListener).not.toHaveBeenCalled()
    expect(onMountFieldValidator).not.toHaveBeenCalled()

    // Simulate loading data
    const button = screen.getByText('Load Data')
    button.click()

    // Wait for data to populate and listeners to run
    await waitFor(() => expect(onMountFieldListener).toHaveBeenCalledTimes(1))

    // Check that it ran once
    expect(onMountFieldValidator).toHaveBeenCalledTimes(1)
  })

  it('should run FIELD onMount listeners immediately if defaultValues are provided initially', async () => {
    const onMountFieldListener = vi.fn()
    const onMountFieldValidator = vi.fn()

    function Form() {
      const form = useForm({
        defaultValues: { firstName: 'Test' },
      })

      return (
        <div>
          <form.Field
            name="firstName"
            listeners={{
              onMount: onMountFieldListener,
            }}
            validators={{
              onMount: onMountFieldValidator,
            }}
            children={(field) => (
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
        </div>
      )
    }

    render(<Form />)

    await waitFor(() => expect(onMountFieldListener).toHaveBeenCalledTimes(1))
    expect(onMountFieldValidator).toHaveBeenCalledTimes(1)
  })
})
