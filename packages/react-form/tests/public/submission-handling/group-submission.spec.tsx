import React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { promiseWithResolvers } from '../../test-utils'
import { GroupSubmissionStages } from './GroupSubmissionStages'
import { GroupSubmitNotifications } from './GroupSubmitNotifications'
import { EditedDuringGroupSubmit } from './EditedDuringGroupSubmit'
import { GroupSubmissionCallbacks } from './GroupSubmissionCallbacks'
import { SubmissionWizard } from './SubmissionWizard'

it('publishes field errors together before group validators and preserves bailIfInvalid', async () => {
  const first = promiseWithResolvers<string | null>()
  const second = promiseWithResolvers<string | null>()
  const validateGroup = vi.fn(() => null)
  const validateDependent = vi.fn(() => null)
  const validateUnflagged = vi.fn(() => null)
  const onFieldErrors = vi.fn()
  const screen = await render(
    <GroupSubmissionStages
      validateFirst={() => first.promise}
      validateSecond={() => second.promise}
      validateGroup={validateGroup}
      validateDependent={validateDependent}
      validateUnflagged={validateUnflagged}
      onFieldErrors={onFieldErrors}
    />,
  )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  expect(validateGroup).not.toHaveBeenCalled()
  first.resolve('First error')
  await expect
    .element(screen.getByRole('status', { name: 'First validating' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'First errors' }))
    .toHaveTextContent('None')
  expect(validateGroup).not.toHaveBeenCalled()

  second.resolve('Second error')
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('[{"message":"First error"},{"message":"Second error"}]')
  await expect
    .element(screen.getByRole('status', { name: 'First errors' }))
    .toHaveTextContent('First error')
  await expect
    .element(screen.getByRole('status', { name: 'Second errors' }))
    .toHaveTextContent('Second error')
  expect(validateGroup).toHaveBeenCalledWith([
    ['First error'],
    ['Second error'],
  ])
  expect(onFieldErrors).toHaveBeenCalledWith([
    ['First error'],
    ['Second error'],
  ])
  expect(onFieldErrors).not.toHaveBeenCalledWith([['First error'], []])
  expect(onFieldErrors).not.toHaveBeenCalledWith([[], ['Second error']])
  expect(validateDependent).not.toHaveBeenCalled()
  expect(validateUnflagged).toHaveBeenCalledOnce()
})

it('settles sibling fields and publishes their errors before rejecting without starting group validators', async () => {
  const first = promiseWithResolvers<string | null>()
  const second = promiseWithResolvers<string | null>()
  const validateGroup = vi.fn(() => null)
  const screen = await render(
    <GroupSubmissionStages
      validateFirst={() => first.promise}
      validateSecond={() => second.promise}
      validateGroup={validateGroup}
      validateDependent={() => null}
      validateUnflagged={() => null}
    />,
  )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  first.reject(new Error('Field failed'))
  await expect
    .element(screen.getByRole('status', { name: 'First validating' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Submitting' }))
    .toHaveTextContent('true')
  expect(validateGroup).not.toHaveBeenCalled()
  second.resolve('Second error')
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('Rejected')
  await expect
    .element(screen.getByRole('status', { name: 'Second errors' }))
    .toHaveTextContent('Second error')
  await expect
    .element(screen.getByRole('status', { name: 'Submitting' }))
    .toHaveTextContent('false')
  expect(validateGroup).not.toHaveBeenCalled()
})

it('cancels submission during field validation without starting group validators', async () => {
  const first = promiseWithResolvers<string | null>()
  const second = promiseWithResolvers<string | null>()
  const validateGroup = vi.fn(() => null)
  const screen = await render(
    <GroupSubmissionStages
      validateFirst={() => first.promise}
      validateSecond={() => second.promise}
      validateGroup={validateGroup}
      validateDependent={() => null}
      validateUnflagged={() => null}
    />,
  )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('[]')
  await expect
    .element(screen.getByRole('status', { name: 'Submitting' }))
    .toHaveTextContent('false')
  first.resolve('Late first error')
  second.resolve('Late second error')
  await Promise.all([first.promise, second.promise])
  await expect
    .element(screen.getByRole('status', { name: 'First errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Second errors' }))
    .toHaveTextContent('None')
  expect(validateGroup).not.toHaveBeenCalled()
})

it('notifies watchers of fields without listeners or validators and leaves outside fields untouched and unvalidated', async () => {
  const onNotification = vi.fn()
  const validateForm = vi.fn(() => null)
  const validateGroup = vi.fn(() => null)
  const validateSibling = vi.fn(() => null)
  const validateOutside = vi.fn(() => null)
  const screen = await render(
    <GroupSubmitNotifications
      onNotification={onNotification}
      validateForm={validateForm}
      validateGroup={validateGroup}
      validateSibling={validateSibling}
      validateOutside={validateOutside}
    />,
  )

  await expect
    .element(screen.getByRole('status', { name: 'Watched touched' }))
    .toHaveTextContent('false')
  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('[]')
  expect(onNotification).toHaveBeenCalledTimes(2)
  expect(onNotification).toHaveBeenCalledWith('inside')
  expect(onNotification).toHaveBeenCalledWith('watching')
  await expect
    .element(screen.getByRole('status', { name: 'Watched touched' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Outside touched' }))
    .toHaveTextContent('false')
  expect(validateGroup).toHaveBeenCalledOnce()
  expect(validateForm).not.toHaveBeenCalled()
  expect(validateSibling).not.toHaveBeenCalled()
  expect(validateOutside).not.toHaveBeenCalled()
})

it('notifies the form listener first and excludes mounted group validators from form submission', async () => {
  const onNotification = vi.fn()
  const validateForm = vi.fn(() => null)
  const validateGroup = vi.fn(() => null)
  const validateSibling = vi.fn(() => null)
  const validateOutside = vi.fn(() => null)
  const screen = await render(
    <GroupSubmitNotifications
      onNotification={onNotification}
      validateForm={validateForm}
      validateGroup={validateGroup}
      validateSibling={validateSibling}
      validateOutside={validateOutside}
    />,
  )

  await screen.getByRole('button', { name: 'Submit form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('[]')
  expect(onNotification).toHaveBeenNthCalledWith(1, 'form')
  expect(onNotification).toHaveBeenCalledWith('inside')
  expect(validateForm).toHaveBeenCalledOnce()
  expect(validateOutside).toHaveBeenCalledOnce()
  expect(validateGroup).not.toHaveBeenCalled()
  expect(validateSibling).not.toHaveBeenCalled()
})

it.each([
  {
    submittedResult: 'Submitted error',
    editedValue: 'valid',
    currentError: 'None',
    submissionErrors: [{ message: 'Submitted error' }],
  },
  {
    submittedResult: 'Submitted error',
    editedValue: 'invalid',
    currentError: 'Current error',
    submissionErrors: [{ message: 'Submitted error' }],
  },
  {
    submittedResult: null,
    editedValue: 'invalid',
    currentError: 'Current error',
    submissionErrors: [],
  },
])(
  'keeps live group field errors after editing to $editedValue while submission returns $submittedResult',
  async ({ submittedResult, editedValue, currentError, submissionErrors }) => {
    const pending = promiseWithResolvers<string | null>()
    const validateSubmission = vi.fn(() => pending.promise)
    const onValidatedValue = vi.fn()
    const onSubmittedValue = vi.fn()
    const screen = await render(
      <EditedDuringGroupSubmit
        validateSubmission={validateSubmission}
        onValidatedValue={onValidatedValue}
        onSubmittedValue={onSubmittedValue}
      />,
    )

    await screen.getByRole('button', { name: 'Submit group' }).click()
    expect(validateSubmission).toHaveBeenCalledWith('submitted')
    await screen.getByRole('textbox', { name: 'Name' }).fill(editedValue)
    await expect
      .element(screen.getByRole('status', { name: 'Name errors' }))
      .toHaveTextContent(currentError)
    pending.resolve(submittedResult)
    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent(JSON.stringify(submissionErrors))
    await expect
      .element(screen.getByRole('textbox', { name: 'Name' }))
      .toHaveValue(editedValue)
    await expect
      .element(screen.getByRole('status', { name: 'Name errors' }))
      .toHaveTextContent(currentError)
    expect(onValidatedValue).toHaveBeenCalledWith({ name: 'submitted' })
    expect(onSubmittedValue).toHaveBeenCalledWith({ name: 'submitted' })
  },
)

it('awaits invalid callbacks, routes returned group errors, clears empty maps, and preserves output slots', async () => {
  const invalid = promiseWithResolvers<void>()
  const submit = vi
    .fn<(value: string) => Promise<string | null>>()
    .mockResolvedValueOnce('Remote error')
    .mockResolvedValue(null)
  const onInvalid = vi.fn(() => invalid.promise)
  const onOutputs = vi.fn()
  const screen = await render(
    <GroupSubmissionCallbacks
      submit={submit}
      onInvalid={onInvalid}
      onOutputs={onOutputs}
    />,
  )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('Name error')
  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('Remote error')
  await expect
    .element(screen.getByRole('status', { name: 'Group submission state' }))
    .toHaveTextContent(
      '{"isSubmitting":true,"isSubmitSuccessful":false,"submissionAttempts":1}',
    )
  expect(onInvalid).toHaveBeenCalledWith({ name: 'submitted' })
  expect(onOutputs).toHaveBeenCalledWith(['Group output', undefined, undefined])
  invalid.resolve()
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent(
      '[{"form":[{"message":"Remote error"}],"fields":{"name":[{"message":"Name error"}]}}]',
    )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('[]')
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Group submission state' }))
    .toHaveTextContent(
      '{"isSubmitting":false,"isSubmitSuccessful":true,"submissionAttempts":2}',
    )
})

it('propagates an invalid callback rejection and clears submission state', async () => {
  const screen = await render(
    <GroupSubmissionCallbacks
      submit={() => Promise.resolve('Remote error')}
      onInvalid={() => Promise.reject(new Error('Invalid callback failed'))}
      onOutputs={() => {}}
    />,
  )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('Invalid callback failed')
  await expect
    .element(screen.getByRole('status', { name: 'Group submission state' }))
    .toHaveTextContent(
      '{"isSubmitting":false,"isSubmitSuccessful":false,"submissionAttempts":1}',
    )
})

it('returns a detached group callback result without changing reset state', async () => {
  const pending = promiseWithResolvers<string | null>()
  const submit = vi.fn(() => pending.promise)
  const onInvalid = vi.fn()
  const screen = await render(
    <GroupSubmissionCallbacks
      submit={submit}
      onInvalid={onInvalid}
      onOutputs={() => {}}
    />,
  )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  expect(submit).toHaveBeenCalledWith('submitted')
  await screen.getByRole('button', { name: 'Reset group' }).click()
  pending.resolve('Late error')
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent(
      '[{"form":[{"message":"Late error"}],"fields":{"name":[{"message":"Name error"}]}}]',
    )
  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Group submission state' }))
    .toHaveTextContent(
      '{"isSubmitting":false,"isSubmitSuccessful":false,"submissionAttempts":0}',
    )
  expect(onInvalid).toHaveBeenCalledWith({ name: 'submitted' })
})

it('keeps group submission state reset after a pending callback completes following form reset', async () => {
  const pending = promiseWithResolvers<string | null>()
  const screen = await render(
    <GroupSubmissionCallbacks
      submit={() => pending.promise}
      onInvalid={() => {}}
      onOutputs={() => {}}
    />,
  )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group submission state' }))
    .toHaveTextContent(
      '{"isSubmitting":true,"isSubmitSuccessful":false,"submissionAttempts":1}',
    )

  await screen.getByRole('button', { name: 'Reset form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group submission state' }))
    .toHaveTextContent(
      '{"isSubmitting":false,"isSubmitSuccessful":false,"submissionAttempts":0}',
    )

  pending.resolve('Late error')
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent(
      '[{"form":[{"message":"Late error"}],"fields":{"name":[{"message":"Name error"}]}}]',
    )
  await expect
    .element(screen.getByRole('status', { name: 'Group submission state' }))
    .toHaveTextContent(
      '{"isSubmitting":false,"isSubmitSuccessful":false,"submissionAttempts":0}',
    )
  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('None')
})

it('keeps overlapping group attempts active until their own callbacks finish', async () => {
  const first = promiseWithResolvers<string | null>()
  const second = promiseWithResolvers<string | null>()
  const submit = vi
    .fn()
    .mockReturnValueOnce(first.promise)
    .mockReturnValueOnce(second.promise)
  const screen = await render(
    <GroupSubmissionCallbacks
      submit={submit}
      onInvalid={() => {}}
      onOutputs={() => {}}
    />,
  )

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await screen.getByRole('button', { name: 'Submit group' }).click()
  expect(submit).toHaveBeenCalledTimes(2)
  first.resolve(null)
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('[]')
  await expect
    .element(screen.getByRole('status', { name: 'Group submission state' }))
    .toHaveTextContent(
      '{"isSubmitting":true,"isSubmitSuccessful":true,"submissionAttempts":2}',
    )
  second.resolve('Second error')
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent(
      '[{"form":[{"message":"Second error"}],"fields":{"name":[{"message":"Name error"}]}}]',
    )
  await expect
    .element(screen.getByRole('status', { name: 'Group submission state' }))
    .toHaveTextContent(
      '{"isSubmitting":false,"isSubmitSuccessful":false,"submissionAttempts":2}',
    )
})

it('enforces the complete form schema before and after a wizard step unmounts', async () => {
  const onSubmit = vi.fn()
  const onResult = vi.fn()
  const screen = await render(
    <SubmissionWizard onSubmit={onSubmit} onResult={onResult} />,
  )

  await screen.getByRole('button', { name: 'Submit form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('Invalid')
  await screen.getByRole('button', { name: 'Next step' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Visible step' }))
    .toHaveTextContent('Second: Valid')
  await screen.getByRole('button', { name: 'Submit form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Submission result' }))
    .toHaveTextContent('Invalid')
  const expectedErrors = [
    {
      form: [],
      fields: {
        'first.name': [
          expect.objectContaining({ message: 'First step invalid' }),
        ],
      },
    },
  ]
  expect(onResult).toHaveBeenCalledTimes(2)
  expect(onResult).toHaveBeenNthCalledWith(1, expectedErrors)
  expect(onResult).toHaveBeenNthCalledWith(2, expectedErrors)
  expect(onSubmit).not.toHaveBeenCalled()
})
