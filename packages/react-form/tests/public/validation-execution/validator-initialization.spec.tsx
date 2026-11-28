import React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { ValidatorInitialization } from './ValidatorInitialization'

it('does not warn when form, group, and field validator counts stay unchanged', async ({
  onTestFinished,
}) => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  onTestFinished(() => warn.mockRestore())

  const screen = await render(<ValidatorInitialization />)
  await screen.rerender(<ValidatorInitialization />)

  await expect
    .element(screen.getByRole('textbox', { name: 'A' }))
    .toHaveValue('')
  expect(warn).not.toHaveBeenCalled()
})
