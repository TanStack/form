import React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { SubmitOnlyValidation } from './SubmitOnlyValidation'

it.each<{ name: string; options: { triggers?: [] } }>([
  { name: 'omitted', options: {} },
  { name: 'undefined', options: { triggers: undefined } },
  { name: 'empty', options: { triggers: [] } },
])('validates only on submit with $name triggers', async ({ options }) => {
  const screen = await render(<SubmitOnlyValidation options={options} />)
  const formErrors = screen.getByRole('status', { name: 'Form errors' })
  const groupErrors = screen.getByRole('status', { name: 'Group errors' })
  const fieldErrors = screen.getByRole('status', { name: 'Field errors' })

  await expect.element(formErrors).toHaveTextContent('None')
  await expect.element(groupErrors).toHaveTextContent('None')
  await expect.element(fieldErrors).toHaveTextContent('None')

  await screen.getByRole('textbox', { name: 'Name' }).fill('Ada')
  await screen.getByRole('button', { name: 'Blur input' }).click()

  await expect.element(formErrors).toHaveTextContent('None')
  await expect.element(groupErrors).toHaveTextContent('None')
  await expect.element(fieldErrors).toHaveTextContent('None')

  await screen.getByRole('button', { name: 'Submit group' }).click()

  await expect.element(formErrors).toHaveTextContent('None')
  await expect.element(groupErrors).toHaveTextContent('Group validation')
  await expect.element(fieldErrors).toHaveTextContent('Field validation')

  await screen.getByRole('button', { name: 'Submit form' }).click()

  await expect.element(formErrors).toHaveTextContent('Form validation')
})
