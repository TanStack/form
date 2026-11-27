import React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { SubmissionVisibility } from './SubmissionVisibility'

it('updates form error visibility when submission attempts change or reset', async () => {
  const screen = await render(<SubmissionVisibility />)

  await expect
    .element(screen.getByRole('status', { name: 'Form name errors' }))
    .toHaveTextContent('None')
  await screen.getByLabelText('Other').fill('Edited')
  await expect
    .element(screen.getByRole('status', { name: 'Form name errors' }))
    .toHaveTextContent('None')

  await screen.getByRole('button', { name: 'Submit form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Form name errors' }))
    .toHaveTextContent('Name required')
  await screen.getByRole('button', { name: 'Reset form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Form name errors' }))
    .toHaveTextContent('None')
})

it('uses group submission attempts independently of the form for error visibility', async () => {
  const screen = await render(<SubmissionVisibility />)

  await expect
    .element(screen.getByRole('status', { name: 'Group name errors' }))
    .toHaveTextContent('None')
  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group name errors' }))
    .toHaveTextContent('Group name required')
  await expect
    .element(screen.getByRole('status', { name: 'Form name errors' }))
    .toHaveTextContent('None')

  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group name errors' }))
    .toHaveTextContent('None')
  await screen.getByRole('button', { name: 'Submit form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Form name errors' }))
    .toHaveTextContent('Name required')
  await expect
    .element(screen.getByRole('status', { name: 'Group name errors' }))
    .toHaveTextContent('None')
})

it('updates error visibility when another form value changes', async () => {
  const screen = await render(<SubmissionVisibility />)

  await expect
    .element(screen.getByRole('status', { name: 'Watched errors' }))
    .toHaveTextContent('None')
  await screen.getByLabelText('Other').fill('Edited')
  await expect
    .element(screen.getByRole('status', { name: 'Watched errors' }))
    .toHaveTextContent('Watched required')
  await screen.getByLabelText('Other').fill('')
  await expect
    .element(screen.getByRole('status', { name: 'Watched errors' }))
    .toHaveTextContent('None')
})
