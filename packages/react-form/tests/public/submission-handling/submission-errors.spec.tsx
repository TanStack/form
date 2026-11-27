import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { promiseWithResolvers } from '../../test-utils'
import { FormSubmissionErrors } from './FormSubmissionErrors'
import { GroupSubmissionErrors } from './GroupSubmissionErrors'

describe.each([
  { scope: 'form', Component: FormSubmissionErrors },
  { scope: 'group', Component: GroupSubmissionErrors },
])('$scope submission exceptions', ({ Component }) => {
  it('rejects an unhandled submit exception after cleanup and allows retry', async () => {
    const error = new Error('Save failed')
    const submit = vi.fn().mockRejectedValueOnce(error).mockResolvedValue(null)
    const screen = await render(<Component submit={submit} />)

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Rejected: Save failed')
    await expect
      .element(screen.getByRole('status', { name: 'Submitting', exact: true }))
      .toHaveTextContent('false')
    await expect
      .element(screen.getByRole('status', { name: 'Submit successful' }))
      .toHaveTextContent('false')
    await expect.element(screen.getByLabelText('Name')).toHaveValue('submitted')

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Resolved: []')
    await expect
      .element(screen.getByRole('status', { name: 'Submit successful' }))
      .toHaveTextContent('true')
    expect(submit).toHaveBeenLastCalledWith('submitted')
  })

  it('awaits the invalid callback and preserves an unsuppressed exception', async () => {
    const invalid = promiseWithResolvers<void>()
    const error = new Error('Save failed')
    const onInvalid = vi.fn(() => invalid.promise)
    const screen = await render(
      <Component submit={() => Promise.reject(error)} onInvalid={onInvalid} />,
    )

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await vi.waitFor(() => expect(onInvalid).toHaveBeenCalledOnce())
    expect(onInvalid).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'exception',
        source: 'onSubmit',
        error,
        preventThrow: expect.any(Function),
      }),
    )
    await expect
      .element(screen.getByRole('status', { name: 'Submitting', exact: true }))
      .toHaveTextContent('true')
    invalid.resolve()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Rejected: Save failed')
  })

  it('lets an awaited invalid callback suppress an exception without marking success', async () => {
    const invalid = promiseWithResolvers<void>()
    const error = new Error('Save failed')
    const onInvalid = vi.fn()
    const screen = await render(
      <Component
        submit={() => Promise.reject(error)}
        onInvalid={async (context) => {
          onInvalid(context)
          await invalid.promise
          context.preventThrow()
        }}
      />,
    )

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await vi.waitFor(() => expect(onInvalid).toHaveBeenCalledOnce())
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Pending')
    invalid.resolve()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Resolved: []')
    await expect
      .element(screen.getByRole('status', { name: 'Submitting', exact: true }))
      .toHaveTextContent('false')
    await expect
      .element(screen.getByRole('status', { name: 'Submit successful' }))
      .toHaveTextContent('false')
  })

  it('offers validator exceptions to the invalid callback before rejecting', async () => {
    const error = new Error('Validation failed')
    const submit = vi.fn(() => null)
    const onInvalid = vi.fn()
    const screen = await render(
      <Component
        submit={submit}
        validate={() => {
          throw error
        }}
        onInvalid={onInvalid}
      />,
    )

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Rejected: Pipeline execution failed')
    expect(onInvalid).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'exception',
        source: 'validators',
        error: expect.objectContaining({ errors: [error] }),
      }),
    )
    expect(submit).not.toHaveBeenCalled()
    await expect
      .element(screen.getByRole('status', { name: 'Submitting', exact: true }))
      .toHaveTextContent('false')
  })

  it('suppresses a field exception and skips submit even when no validation errors remain', async () => {
    const error = new Error('Field validation failed')
    const submit = vi.fn(() => null)
    const onInvalid = vi.fn()
    const screen = await render(
      <Component
        submit={submit}
        validateField={() => Promise.reject(error)}
        onInvalid={(context) => {
          onInvalid(context)
          context.preventThrow()
        }}
      />,
    )

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Resolved: []')
    expect(onInvalid).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'exception',
        source: 'validators',
        error: expect.objectContaining({ errors: [error] }),
      }),
    )
    expect(submit).not.toHaveBeenCalled()
    await expect
      .element(screen.getByRole('status', { name: 'Submit successful' }))
      .toHaveTextContent('false')
  })

  it('preserves collected field errors when a later validator exception is suppressed', async () => {
    const screen = await render(
      <Component
        submit={() => null}
        validateField={() => 'Name is invalid'}
        validate={() => Promise.reject(new Error('Validation failed'))}
        onInvalid={({ preventThrow }) => preventThrow()}
      />,
    )

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Resolved: [{"message":"Name is invalid"}]')
  })

  it('does not suppress an exception thrown by the invalid callback itself', async () => {
    const screen = await render(
      <Component
        submit={() => Promise.reject(new Error('Save failed'))}
        onInvalid={({ preventThrow }) => {
          preventThrow()
          throw new Error('Error handler failed')
        }}
      />,
    )

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Rejected: Error handler failed')
    await expect
      .element(screen.getByRole('status', { name: 'Submitting', exact: true }))
      .toHaveTextContent('false')
  })

  it('keeps suppression local to one attempt and preserves undefined rejections', async () => {
    const submit = vi.fn(() => Promise.reject(undefined))
    let suppress = true
    const screen = await render(
      <Component
        submit={submit}
        onInvalid={({ reason, error, preventThrow }) => {
          expect(reason).toBe('exception')
          expect(error).toBeUndefined()
          if (suppress) preventThrow()
          suppress = false
        }}
      />,
    )

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Resolved: []')
    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Rejected: undefined')
  })

  it('preserves reset state when an invalid callback later allows the exception to propagate', async () => {
    const invalid = promiseWithResolvers<void>()
    const onInvalid = vi.fn(() => invalid.promise)
    const screen = await render(
      <Component
        submit={() => Promise.reject(new Error('Save failed'))}
        onInvalid={onInvalid}
      />,
    )

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await vi.waitFor(() => expect(onInvalid).toHaveBeenCalledOnce())
    await screen.getByRole('button', { name: 'Reset' }).click()
    await expect
      .element(screen.getByRole('status', { name: 'Submitting', exact: true }))
      .toHaveTextContent('false')
    invalid.resolve()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Rejected: Save failed')
    await expect
      .element(screen.getByRole('status', { name: 'Submit successful' }))
      .toHaveTextContent('false')
    expect(onInvalid).toHaveBeenCalledOnce()
  })

  it('returns validation failures without throwing or changing their result', async () => {
    const onInvalid = vi.fn()
    const screen = await render(
      <Component
        submit={() => 'Server rejected the value'}
        onInvalid={(context) => {
          onInvalid(context)
          context.preventThrow()
        }}
      />,
    )

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent('Resolved: [{"message":"Server rejected the value"}]')
    expect(onInvalid).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'validation',
        source: 'onSubmit',
        error: undefined,
      }),
    )
  })
})
