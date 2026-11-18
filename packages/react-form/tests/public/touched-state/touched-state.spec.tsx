import React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { SubmissionTouch } from './SubmissionTouch'
import { SubmittedDefaults } from './SubmittedDefaults'
import { SubmittedGroupDefaults } from './SubmittedGroupDefaults'

it('derives group touch for existing and new fields without setting self touch or submitting new fields', async () => {
  const onEmailSubmit = vi.fn(() => null)
  const screen = await render(<SubmissionTouch onEmailSubmit={onEmailSubmit} />)

  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('None')
  await screen.getByRole('button', { name: 'Submit group' }).click()

  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":true,"self":false}')
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('Name required')
  await expect
    .element(screen.getByRole('status', { name: 'Profile touch' }))
    .toHaveTextContent('{"touched":true,"self":false,"subfields":true}')
  await expect
    .element(screen.getByRole('status', { name: 'Group touched' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Other touched' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Outside touched' }))
    .toHaveTextContent('false')

  await screen.getByRole('button', { name: 'Add email' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Email touch' }))
    .toHaveTextContent('{"touched":true,"self":false}')
  expect(onEmailSubmit).not.toHaveBeenCalled()

  await screen.getByRole('button', { name: 'Reset name' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":true,"self":false}')
  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":false,"self":false}')
  await expect
    .element(screen.getByRole('status', { name: 'Email touch' }))
    .toHaveTextContent('{"touched":false,"self":false}')
  await expect
    .element(screen.getByRole('status', { name: 'Profile touch' }))
    .toHaveTextContent('{"touched":false,"self":false,"subfields":false}')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('false')
})

it('preserves form-derived touch across field and group resets and clears it on form reset', async () => {
  const screen = await render(<SubmissionTouch onEmailSubmit={() => null} />)

  await screen.getByRole('button', { name: 'Submit form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group touched' }))
    .toHaveTextContent('true')
  await screen.getByRole('button', { name: 'Add email' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Email touch' }))
    .toHaveTextContent('{"touched":true,"self":false}')
  await screen.getByLabelText('Name', { exact: true }).fill('Edited')
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":true,"self":true}')
  await screen.getByRole('button', { name: 'Reset name' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":true,"self":false}')
  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group touched' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Outside touched' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Outside errors' }))
    .toHaveTextContent('None')
  await screen.getByLabelText('Outside', { exact: true }).click()
  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Outside errors' }))
    .toHaveTextContent('Outside required')

  await screen.getByRole('button', { name: 'Reset form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":false,"self":false}')
  await expect
    .element(screen.getByRole('status', { name: 'Group touched' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('false')
})

it('preserves field values and interaction state across wizard step visits', async () => {
  const screen = await render(<SubmissionTouch onEmailSubmit={() => null} />)

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await screen.getByLabelText('Name', { exact: true }).fill('Edited')
  await screen.getByRole('button', { name: 'Hide group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .not.toBeInTheDocument()
  await expect
    .element(screen.getByRole('status', { name: 'Profile touch' }))
    .toHaveTextContent('{"touched":true,"self":false,"subfields":true}')

  await screen.getByRole('button', { name: 'Show group' }).click()
  await expect
    .element(screen.getByLabelText('Name', { exact: true }))
    .toHaveValue('Edited')
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":true,"self":true}')
  await expect
    .element(screen.getByRole('status', { name: 'Name dirty' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Group attempts' }))
    .toHaveTextContent('0')
  await screen.getByRole('button', { name: 'Reset name' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Profile touch' }))
    .toHaveTextContent('{"touched":true,"self":false,"subfields":true}')
  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Profile touch' }))
    .toHaveTextContent('{"touched":false,"self":false,"subfields":false}')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('false')
})

it('preserves a submitted group contribution when resetting a parent field', async () => {
  const screen = await render(<SubmissionTouch onEmailSubmit={() => null} />)

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await screen.getByRole('button', { name: 'Reset profile' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":true,"self":false}')
  await expect
    .element(screen.getByRole('status', { name: 'Profile touch' }))
    .toHaveTextContent('{"touched":true,"self":false,"subfields":true}')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('true')

  await screen.getByRole('button', { name: 'Hide group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('true')
})

it('preserves group submission touch while server state clears self touch', async () => {
  const screen = await render(<SubmissionTouch onEmailSubmit={() => null} />)

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await screen.getByLabelText('Name', { exact: true }).fill('Edited')
  await screen.getByRole('button', { name: 'Apply server state' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":true,"self":false}')
  await expect
    .element(screen.getByRole('status', { name: 'Profile touch' }))
    .toHaveTextContent('{"touched":true,"self":false,"subfields":true}')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('true')

  await screen.getByRole('button', { name: 'Hide group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('true')
})

it('protects unrendered group values while refreshing defaults outside the submitted group', async () => {
  const screen = await render(<SubmittedGroupDefaults />)

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('true')
  await screen.getByRole('button', { name: 'Refresh defaults' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name value' }))
    .toHaveTextContent('Original name')
  await expect
    .element(screen.getByRole('status', { name: 'Outside value' }))
    .toHaveTextContent('Refreshed outside')

  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name value' }))
    .toHaveTextContent('Refreshed name')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('false')
})

it('preserves namespace touch across wizard steps while starting a fresh group attempt count', async () => {
  const screen = await render(<SubmissionTouch onEmailSubmit={() => null} />)

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":true,"self":false}')
  await screen.getByRole('button', { name: 'Hide group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .not.toBeInTheDocument()
  await expect
    .element(screen.getByRole('status', { name: 'Profile touch' }))
    .toHaveTextContent('{"touched":true,"self":false,"subfields":true}')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('true')

  await screen.getByRole('button', { name: 'Show group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group touched' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Group attempts' }))
    .toHaveTextContent('0')
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":false,"self":false}')
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('None')
  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group attempts' }))
    .toHaveTextContent('1')
  await expect
    .element(screen.getByRole('status', { name: 'Name touch' }))
    .toHaveTextContent('{"touched":true,"self":false}')
  await screen.getByRole('button', { name: 'Hide group' }).click()
  await screen.getByRole('button', { name: 'Reset form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('false')
})

it('protects unmounted values from refreshed defaults after a form submission', async () => {
  const screen = await render(<SubmittedDefaults />)

  await screen.getByRole('button', { name: 'Submit form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('true')
  await screen.getByRole('button', { name: 'Refresh defaults' }).click()
  await screen.getByRole('button', { name: 'Show field' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name value' }))
    .toHaveTextContent('Original')
  await expect
    .element(screen.getByRole('status', { name: 'Name touched' }))
    .toHaveTextContent('true')

  await screen.getByRole('button', { name: 'Reset name' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name value' }))
    .toHaveTextContent('Refreshed')
  await expect
    .element(screen.getByRole('status', { name: 'Name touched' }))
    .toHaveTextContent('true')
})
