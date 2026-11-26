import React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { DefaultFormVisibility } from './DefaultFormVisibility'
import { DefaultFieldBoundaries } from './DefaultFieldBoundaries'

it('uses default error visibility and honors explicit and undefined overrides', async () => {
  const screen = await render(<DefaultFormVisibility />)
  const inherited = screen.getByRole('status', { name: 'Inherited errors' })
  const overridden = screen.getByRole('status', { name: 'Overridden errors' })
  const cleared = screen.getByRole('status', { name: 'Cleared errors' })

  await expect.element(inherited).toHaveTextContent('None')
  await expect.element(overridden).toHaveTextContent('None')
  await expect.element(cleared).toHaveTextContent('Cleared error')

  await screen.getByRole('textbox', { name: 'Inherited name' }).fill('Edited')
  await expect.element(inherited).toHaveTextContent('Inherited error')

  await screen.getByRole('button', { name: 'Submit overridden' }).click()
  await expect.element(overridden).toHaveTextContent('None')
})

it('routes descendant errors to default field boundaries and honors explicit and undefined overrides', async () => {
  const screen = await render(<DefaultFieldBoundaries />)

  await screen.getByRole('button', { name: 'Submit form' }).click()

  await expect
    .element(screen.getByRole('status', { name: 'Direct errors' }))
    .toHaveTextContent('Direct error')
  await expect
    .element(screen.getByRole('status', { name: 'Array errors' }))
    .toHaveTextContent('Array error')
  await expect
    .element(screen.getByRole('status', { name: 'Overridden errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Cleared errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Group field errors' }))
    .toHaveTextContent('Group field error')
  await expect
    .element(screen.getByRole('status', { name: 'Group array errors' }))
    .toHaveTextContent('Group array error')
})
