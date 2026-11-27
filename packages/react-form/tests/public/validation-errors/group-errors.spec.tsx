import React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { UnmountGroupErrors } from './UnmountGroupErrors'

it('clears group-routed errors when the group unmounts', async () => {
  const screen = await render(<UnmountGroupErrors />)
  const errors = screen.getByRole('status', { name: 'Name errors' })
  const invalid = screen.getByRole('status', { name: 'Form invalid' })

  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect.element(errors).toHaveTextContent('Name is required')
  await expect.element(invalid).toHaveTextContent('true')
  await screen.getByRole('button', { name: 'Hide group' }).click()
  await expect.element(invalid).toHaveTextContent('false')

  await screen.getByRole('button', { name: 'Show group' }).click()
  await expect.element(errors).toHaveTextContent('None')
})
