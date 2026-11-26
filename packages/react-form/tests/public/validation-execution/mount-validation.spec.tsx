import React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { promiseWithResolvers } from '../../test-utils'
import { PendingMountValidation } from './PendingMountValidation'
import { SyncMountValidation } from './SyncMountValidation'

it('shows synchronous mount errors and disables submission', async () => {
  const screen = await render(<SyncMountValidation />)

  await expect
    .element(screen.getByRole('status', { name: 'Form errors' }))
    .toHaveTextContent('Name is required')
  await expect
    .element(screen.getByRole('button', { name: 'Submit' }))
    .toBeDisabled()
})

it('shows pending mount validation and publishes its asynchronous errors', async () => {
  const pending = promiseWithResolvers<string>()
  const screen = await render(
    <PendingMountValidation validate={() => pending.promise} />,
  )
  const errors = screen.getByRole('status', { name: 'Form errors' })
  const validating = screen.getByRole('status', { name: 'Validating' })

  await expect.element(errors).toHaveTextContent('None')
  await expect.element(validating).toHaveTextContent('true')

  pending.resolve('Name is required')

  await expect.element(errors).toHaveTextContent('Name is required')
  await expect.element(validating).toHaveTextContent('false')
})
