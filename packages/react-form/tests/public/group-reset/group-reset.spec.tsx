import React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { promiseWithResolvers } from '../../test-utils'
import { GroupResetFields } from './GroupResetFields'
import { GroupResetPending } from './GroupResetPending'
import { FormResetGroupSubmissions } from './FormResetGroupSubmissions'

it('resets every group attempt counter on form reset and gates change validation until another group submission', async () => {
  const screen = await render(<FormResetGroupSubmissions />)

  await screen.getByRole('button', { name: 'Submit details' }).click()
  await screen.getByRole('button', { name: 'Submit step' }).click()
  await screen.getByRole('button', { name: 'Submit step' }).click()
  await screen.getByRole('button', { name: 'Submit form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Details attempts' }))
    .toHaveTextContent('1')
  await expect
    .element(screen.getByRole('status', { name: 'Step attempts' }))
    .toHaveTextContent('2')
  await expect
    .element(screen.getByRole('status', { name: 'Form attempts' }))
    .toHaveTextContent('1')

  await screen.getByRole('textbox', { name: 'Name', exact: true }).fill('')
  await expect
    .element(screen.getByRole('status', { name: 'Details errors' }))
    .toHaveTextContent('Name is required')

  await screen.getByRole('button', { name: 'Reset form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Details attempts' }))
    .toHaveTextContent('0')
  await expect
    .element(screen.getByRole('status', { name: 'Step attempts' }))
    .toHaveTextContent('0')
  await expect
    .element(screen.getByRole('status', { name: 'Form attempts' }))
    .toHaveTextContent('0')
  await expect
    .element(screen.getByRole('textbox', { name: 'Name', exact: true }))
    .toHaveValue('Ada')

  await screen.getByRole('textbox', { name: 'Name', exact: true }).fill('')
  await expect
    .element(screen.getByRole('status', { name: 'Details errors' }))
    .toHaveTextContent('None')

  await screen.getByRole('button', { name: 'Submit details' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Details attempts' }))
    .toHaveTextContent('1')
  await expect
    .element(screen.getByRole('status', { name: 'Details errors' }))
    .toHaveTextContent('Name is required')
  await expect
    .element(screen.getByRole('status', { name: 'Step attempts' }))
    .toHaveTextContent('0')
  await expect
    .element(screen.getByRole('status', { name: 'Form attempts' }))
    .toHaveTextContent('0')

  await screen.getByRole('button', { name: 'Reset form' }).click()
  await screen.getByRole('button', { name: 'Reset form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Details attempts' }))
    .toHaveTextContent('0')
})

it('clears field validation errors throughout a group and preserves errors outside it', async () => {
  const screen = await render(<GroupResetFields />)

  await screen.getByRole('textbox', { name: 'Outside', exact: true }).click()
  await screen.getByRole('textbox', { name: 'Name', exact: true }).fill('')
  await screen.getByRole('textbox', { name: 'City', exact: true }).fill('')
  await expect
    .element(screen.getByRole('status', { name: 'Outside errors' }))
    .toHaveTextContent('Outside is required')
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('Name is required')
  await expect
    .element(screen.getByRole('status', { name: 'City errors' }))
    .toHaveTextContent('City is required')
  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('Complete details')

  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('textbox', { name: 'Name', exact: true }))
    .toHaveValue('Default name')
  await expect
    .element(screen.getByRole('textbox', { name: 'City', exact: true }))
    .toHaveValue('Default city')
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'City errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Group valid' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Group dirty' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Group touched' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Outside errors' }))
    .toHaveTextContent('Outside is required')

  await screen.getByRole('textbox', { name: 'Name', exact: true }).fill('')
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('Name is required')
  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('None')
})

it('preserves form-owned errors when resetting the group field validators', async () => {
  const screen = await render(<GroupResetFields />)

  await screen.getByRole('textbox', { name: 'Name', exact: true }).fill('')
  await screen.getByRole('button', { name: 'Validate form' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('Name is required, Form name error')

  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('Form name error')
  await expect
    .element(screen.getByRole('status', { name: 'Group valid' }))
    .toHaveTextContent('false')
})

it('cancels pending field validation at default values without cancelling fields outside the group', async () => {
  const name = promiseWithResolvers<string | null>()
  const outside = promiseWithResolvers<string | null>()
  const validateName = vi.fn((_signal: AbortSignal) => name.promise)
  const validateNext = vi.fn(() => null)
  const screen = await render(
    <GroupResetPending
      validateName={validateName}
      validateNext={validateNext}
      validateOutside={() => outside.promise}
    />,
  )

  await screen.getByRole('textbox', { name: 'Outside', exact: true }).click()
  await screen.getByRole('textbox', { name: 'Name', exact: true }).click()
  await screen.getByRole('button', { name: 'Validate group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name validating' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Outside validating' }))
    .toHaveTextContent('true')
  expect(validateName).toHaveBeenCalledOnce()
  const signal = validateName.mock.calls[0]![0]
  expect(signal.aborted).toBe(false)

  await screen.getByRole('button', { name: 'Reset group' }).click()
  expect(signal.aborted).toBe(true)
  await expect
    .element(screen.getByRole('status', { name: 'Name validating' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Outside validating' }))
    .toHaveTextContent('true')

  name.resolve('Stale name error')
  outside.resolve('Outside error')
  await expect
    .element(screen.getByRole('status', { name: 'Outside errors' }))
    .toHaveTextContent('Outside error')
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Group valid' }))
    .toHaveTextContent('true')
  expect(validateNext).not.toHaveBeenCalled()
})
