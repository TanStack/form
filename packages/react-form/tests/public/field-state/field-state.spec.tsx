import React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { ArrayReplacement } from './ArrayReplacement'

it('displays a replacement array with the same length', async () => {
  const screen = await render(<ArrayReplacement />)

  await expect
    .element(screen.getByRole('status', { name: 'First item' }))
    .toHaveTextContent('A')
  await screen.getByRole('button', { name: 'Replace array' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'First item' }))
    .toHaveTextContent('B')
})
