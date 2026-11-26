import React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { BoundFieldMeta } from './BoundFieldMeta'
import { MemoizedFieldGroup } from './MemoizedFieldGroup'

it('updates blur metadata without changing the value of a field bound to a different form path', async () => {
  const screen = await render(<BoundFieldMeta />)
  const input = screen.getByRole('textbox', { name: 'Name' })
  const blurred = screen.getByRole('status', { name: 'Name blurred' })

  await expect.element(input).toHaveValue('Tony')
  await expect.element(blurred).toHaveTextContent('false')
  await input.click()
  await screen.getByRole('button', { name: 'Leave field' }).click()
  await expect.element(blurred).toHaveTextContent('true')
  await expect.element(input).toHaveValue('Tony')
})

it('updates a memoized field component when its value changes through the form', async () => {
  const screen = await render(<MemoizedFieldGroup />)
  const input = screen.getByRole('textbox', { name: 'Memoized' })

  await expect.element(input).toHaveValue('')
  await screen.getByRole('button', { name: 'Update value' }).click()
  await expect.element(input).toHaveValue('Updated')
  await input.fill('Edited')
  await expect.element(input).toHaveValue('Edited')
})
