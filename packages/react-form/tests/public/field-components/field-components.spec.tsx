import React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { FieldComponents } from './FieldComponents'

it('injects selected field props and preserves props on branded components', async () => {
  const screen = await render(<FieldComponents />)

  await expect.element(screen.getByText('Choose a name')).toBeVisible()
  await screen.getByRole('textbox', { name: 'Name' }).fill('Ada')
  await expect
    .element(screen.getByRole('status', { name: 'Name summary' }))
    .toHaveTextContent('Ada')

  await screen.getByRole('radio', { name: 'blue' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Selected color' }))
    .toHaveTextContent('blue')
})
