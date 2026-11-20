import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { promiseWithResolvers } from '../../test-utils'
import { FormEditedDuringSubmitCallback } from './FormEditedDuringSubmitCallback'
import { GroupEditedDuringSubmitCallback } from './GroupEditedDuringSubmitCallback'

describe.each([
  { scope: 'form', Component: FormEditedDuringSubmitCallback },
  { scope: 'group', Component: GroupEditedDuringSubmitCallback },
])('$scope submit callback field errors', ({ Component }) => {
  it('skips errors for edited fields while publishing other errors and returning the complete submission result', async () => {
    const pending = promiseWithResolvers<void>()
    const submit = vi.fn(() => pending.promise)
    const screen = await render(<Component submit={submit} />)

    await screen.getByRole('button', { name: 'Submit', exact: true }).click()
    await vi.waitFor(() =>
      expect(submit).toHaveBeenCalledWith({
        name: 'submitted',
        email: 'submitted@example.com',
      }),
    )
    await screen.getByRole('textbox', { name: 'Name' }).fill('edited')
    pending.resolve()

    await expect
      .element(screen.getByRole('status', { name: 'Submission result' }))
      .toHaveTextContent(
        JSON.stringify([
          {
            form: [{ message: 'Submission failed' }],
            fields: {
              name: [{ message: 'Name was rejected' }],
              email: [{ message: 'Email was rejected' }],
            },
          },
        ]),
      )
    await expect
      .element(screen.getByRole('status', { name: 'Submission errors' }))
      .toHaveTextContent('Submission failed')
    await expect
      .element(screen.getByRole('status', { name: 'Email errors' }))
      .toHaveTextContent('Email was rejected')
    await expect
      .element(screen.getByRole('textbox', { name: 'Name' }))
      .toHaveValue('edited')
    await expect
      .element(screen.getByRole('status', { name: 'Name errors' }))
      .toHaveTextContent('None')
  })
})
