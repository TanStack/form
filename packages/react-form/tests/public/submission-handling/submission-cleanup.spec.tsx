import React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { promiseWithResolvers } from '../../test-utils'
import { UnmountGroupSubmission } from './UnmountGroupSubmission'

it('cancels group submission validation when the group unmounts', async () => {
  const pending = promiseWithResolvers<string | null>()
  const submit = vi.fn(() => null)
  const onInvalid = vi.fn()
  const onResult = vi.fn()
  const screen = await render(
    <UnmountGroupSubmission
      validate={() => pending.promise}
      submit={submit}
      onInvalid={onInvalid}
      onResult={onResult}
    />,
  )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name validating' }))
    .toHaveTextContent('true')
  await screen.getByRole('button', { name: 'Hide group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('[]')
  await screen.getByRole('button', { name: 'Show group' }).click()
  pending.resolve('Late field error')
  await pending.promise

  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('None')
  expect(submit).not.toHaveBeenCalled()
  expect(onInvalid).not.toHaveBeenCalled()
  expect(onResult).toHaveBeenCalledWith([])
})

it('settles a detached group callback without publishing into a remounted group', async () => {
  const pending = promiseWithResolvers<string | null>()
  const submit = vi.fn(() => pending.promise)
  const onInvalid = vi.fn()
  const screen = await render(
    <UnmountGroupSubmission
      validate={() => null}
      submit={submit}
      onInvalid={onInvalid}
      onResult={() => {}}
    />,
  )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await vi.waitFor(() => expect(submit).toHaveBeenCalledOnce())
  await screen.getByRole('button', { name: 'Hide group' }).click()
  await screen.getByRole('button', { name: 'Show group' }).click()
  pending.resolve('Late submit error')

  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent(
      '[{"form":[{"message":"Late submit error"}],"fields":{}}]',
    )
  await expect
    .element(screen.getByRole('status', { name: 'Group submission state' }))
    .toHaveTextContent(
      '{"isSubmitting":false,"isSubmitSuccessful":false,"submissionAttempts":0}',
    )
  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('None')
  expect(onInvalid).toHaveBeenCalledOnce()
})

it('cancels form submission validation when the form unmounts', async () => {
  const pending = promiseWithResolvers<string | null>()
  const submit = vi.fn(() => null)
  const onInvalid = vi.fn()
  const onResult = vi.fn()
  const screen = await render(
    <UnmountGroupSubmission
      validate={() => pending.promise}
      submit={submit}
      onInvalid={onInvalid}
      onResult={onResult}
    />,
  )

  await screen.getByRole('button', { name: 'Submit form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name validating' }))
    .toHaveTextContent('true')
  await screen.unmount()
  await vi.waitFor(() => expect(onResult).toHaveBeenCalledExactlyOnceWith([]))
  pending.resolve('Late field error')
  await pending.promise

  expect(submit).not.toHaveBeenCalled()
  expect(onInvalid).not.toHaveBeenCalled()
})

it('settles a detached form callback after the form unmounts', async () => {
  const pending = promiseWithResolvers<string | null>()
  const submit = vi.fn(() => pending.promise)
  const onInvalid = vi.fn()
  const onResult = vi.fn()
  const screen = await render(
    <UnmountGroupSubmission
      validate={() => null}
      submit={submit}
      onInvalid={onInvalid}
      onResult={onResult}
    />,
  )

  await screen.getByRole('button', { name: 'Submit form' }).click()
  await vi.waitFor(() => expect(submit).toHaveBeenCalledOnce())
  await screen.unmount()
  expect(onResult).not.toHaveBeenCalled()
  pending.resolve('Late submit error')

  await vi.waitFor(() =>
    expect(onResult).toHaveBeenCalledExactlyOnceWith([
      { form: [{ message: 'Late submit error' }], fields: {} },
    ]),
  )
  expect(onInvalid).toHaveBeenCalledOnce()
})
