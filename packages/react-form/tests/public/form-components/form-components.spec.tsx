import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { OwningForms } from './OwningForms'
import { StableFormComponents } from './StableFormComponents'
import { MixedFormComponents } from './MixedFormComponents'
import { MemoLazyFormComponents } from './MemoLazyFormComponents'
import { InheritedFormComponents } from './InheritedFormComponents'
import { MissingFormOwner } from './MissingFormOwner'

describe('form component wrapping', () => {
  it.each(['MemoInside', 'MemoOutside', 'LazyOutside'] as const)(
    'injects the form through %s',
    async (component) => {
      await render(<MemoLazyFormComponents component={component} />)

      await expect
        .element(page.getByLabelText('Form status'))
        .toHaveTextContent('Pristine')
      await page.getByRole('textbox', { name: 'Name' }).fill('Bob')
      await expect
        .element(page.getByLabelText('Form status'))
        .toHaveTextContent('Edited')
    },
  )

  it('binds destructured components to their own form and overrides extra injected props', async () => {
    await render(<OwningForms />)

    await expect
      .element(page.getByLabelText('First values'))
      .toHaveTextContent('{"name":"Alice"}')
    await expect
      .element(page.getByLabelText('Second values'))
      .toHaveTextContent('{"count":1}')
    await page.getByRole('textbox', { name: 'First name' }).fill('Bob')
    await page.getByRole('spinbutton', { name: 'Second count' }).fill('2')
    await expect
      .element(page.getByLabelText('First values'))
      .toHaveTextContent('{"name":"Bob"}')
    await expect
      .element(page.getByLabelText('Second values'))
      .toHaveTextContent('{"count":2}')

    await page.getByRole('button', { name: 'Reset First' }).click()
    await expect
      .element(page.getByRole('textbox', { name: 'First name' }))
      .toHaveValue('Alice')
    await expect
      .element(page.getByLabelText('Second values'))
      .toHaveTextContent('{"count":2}')
    await page.getByRole('button', { name: 'Reset Second' }).click()
    await expect
      .element(page.getByRole('spinbutton', { name: 'Second count' }))
      .toHaveValue(1)
  })

  it('retains component state across rerenders and observes updated form options', async () => {
    const onSubmit = vi.fn()
    await render(<StableFormComponents onSubmit={onSubmit} />)

    await page
      .getByRole('button', { name: 'Increment component state' })
      .click()
    await page.getByRole('button', { name: 'Increment ordinary state' }).click()
    await page.getByRole('button', { name: 'Submit', exact: true }).click()
    await vi.waitFor(() => expect(onSubmit).toHaveBeenLastCalledWith(0))
    await page.getByRole('button', { name: 'Update form options' }).click()
    await expect
      .element(page.getByLabelText('Component count'))
      .toHaveTextContent('1')
    await expect
      .element(page.getByLabelText('Ordinary count'))
      .toHaveTextContent('1')
    await expect
      .element(page.getByLabelText('Ordinary props'))
      .toHaveTextContent('Caller form / Caller owner')
    await page.getByRole('button', { name: 'Submit', exact: true }).click()
    await vi.waitFor(() => expect(onSubmit).toHaveBeenLastCalledWith(1))
  })

  it('preserves ordinary memo and lazy components alongside prepared lazy components', async () => {
    await render(<MixedFormComponents />)

    await expect
      .element(page.getByText('Memo component', { exact: true }))
      .toBeVisible()
    await expect
      .element(page.getByText('Lazy component', { exact: true }))
      .toBeVisible()
    await expect
      .element(page.getByLabelText('Form status'))
      .toHaveTextContent('Pristine')
    await page.getByRole('textbox', { name: 'Name' }).fill('Bob')
    await expect
      .element(page.getByLabelText('Form status'))
      .toHaveTextContent('Edited')
  })

  it('lets unregistered prepared descendants inherit the nearest owning form across hooks', async () => {
    await render(<InheritedFormComponents />)

    await expect
      .element(page.getByLabelText('First values', { exact: true }))
      .toHaveTextContent('{"name":"Alice"}')
    await expect
      .element(page.getByLabelText('Second values'))
      .toHaveTextContent('{"count":1}')
    await page.getByRole('textbox', { name: 'First name' }).fill('Bob')
    await page.getByRole('spinbutton', { name: 'Second count' }).fill('2')
    await expect
      .element(page.getByLabelText('First values', { exact: true }))
      .toHaveTextContent('{"name":"Bob"}')
    await expect
      .element(page.getByLabelText('Second values'))
      .toHaveTextContent('{"count":2}')
    await expect
      .element(page.getByLabelText('First after nested values'))
      .toHaveTextContent('{"name":"Bob"}')

    await page.getByRole('button', { name: 'Reset Second' }).click()
    await expect
      .element(page.getByLabelText('Second values'))
      .toHaveTextContent('{"count":1}')
    await expect
      .element(page.getByLabelText('First values', { exact: true }))
      .toHaveTextContent('{"name":"Bob"}')
  })

  it('reports a missing owner even with an explicit form prop', async () => {
    await expect(render(<MissingFormOwner />)).rejects.toThrow(
      'TanStack Form: Components prepared with `formComponent.create()` must be rendered within a registered form component.',
    )
  })
})
