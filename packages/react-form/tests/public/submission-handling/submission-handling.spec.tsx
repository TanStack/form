import React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { promiseWithResolvers } from '../../test-utils'
import { EditedDuringSubmit } from './EditedDuringSubmit'

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
  'keeps $editedValue field errors when submitted validation returns $submittedResult',
  async ({ submittedResult, editedValue, currentError, submissionErrors }) => {
    const pending = promiseWithResolvers<string | null>()
    const validateSubmission = vi.fn(() => pending.promise)
    const onSubmittedValue = vi.fn()
    const screen = await render(
      <EditedDuringSubmit
        validateSubmission={validateSubmission}
        onSubmittedValue={onSubmittedValue}
      />,
    )
    const name = screen.getByRole('textbox', { name: 'Name' })
    const errors = screen.getByRole('status', { name: 'Name errors' })

    await screen.getByRole('button', { name: 'Submit' }).click()
    expect(validateSubmission).toHaveBeenCalledWith('submitted')
    await name.fill(editedValue)
    await expect.element(errors).toHaveTextContent(currentError)

    pending.resolve(submittedResult)

    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent(JSON.stringify(submissionErrors))
    await expect.element(name).toHaveValue(editedValue)
    await expect.element(errors).toHaveTextContent(currentError)
    expect(onSubmittedValue).toHaveBeenCalledWith({ name: 'submitted' })
  },
)
