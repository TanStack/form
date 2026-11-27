import React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { UnrenderedFieldChange } from './UnrenderedFieldChange'

it('supplies the changed field to form callbacks without marking an unrendered value touched or dirty', async () => {
  const onChange = vi.fn()
  const onValidate = vi.fn(() => null)
  const screen = await render(
    <UnrenderedFieldChange
      onChange={onChange}
      onValidate={onValidate}
      onWatchedReset={() => {}}
    />,
  )

  await screen.getByRole('button', { name: 'Write unrendered value' }).click()

  await expect
    .element(screen.getByRole('status', { name: 'Name value' }))
    .toHaveTextContent('Ada')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Form dirty' }))
    .toHaveTextContent('false')
  expect(onChange).toHaveBeenCalledWith('profile.name')
  expect(onValidate).toHaveBeenCalledWith('profile.name')
})

it('notifies reset watchers after writing an unrendered value without changing interaction metadata', async () => {
  const onWatchedReset = vi.fn()
  const screen = await render(
    <UnrenderedFieldChange
      onChange={() => {}}
      onValidate={() => null}
      onWatchedReset={onWatchedReset}
    />,
  )

  await screen.getByRole('button', { name: 'Write unrendered value' }).click()
  expect(onWatchedReset).not.toHaveBeenCalled()

  await screen.getByRole('button', { name: 'Reset name' }).click()

  expect(onWatchedReset).toHaveBeenCalledOnce()
  await expect
    .element(screen.getByRole('status', { name: 'Name value' }))
    .toBeEmptyDOMElement()
})
