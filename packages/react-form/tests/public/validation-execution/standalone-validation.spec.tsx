import React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { promiseWithResolvers } from '../../test-utils'
import { StandaloneValidation } from './StandaloneValidation'

it.each(['change', 'blur'] as const)(
  'runs only the owner validators for standalone %s validation',
  async (trigger) => {
    const validateField = vi.fn(() => 'Field error')
    const validateGroup = vi.fn(() => 'Group error')
    const screen = await render(
      <StandaloneValidation
        validateField={validateField}
        validateGroup={validateGroup}
      />,
    )

    await screen
      .getByRole('button', { name: `Validate form ${trigger}` })
      .click()
    await expect
      .element(screen.getByRole('status', { name: 'Form result' }))
      .toHaveTextContent('[{"message":"Form error"}]')
    expect(validateGroup).not.toHaveBeenCalled()
    expect(validateField).not.toHaveBeenCalled()

    await screen
      .getByRole('button', { name: `Validate group ${trigger}` })
      .click()
    await expect
      .element(screen.getByRole('status', { name: 'Group result' }))
      .toHaveTextContent('[{"message":"Group error"}]')
    expect(validateGroup).toHaveBeenCalledOnce()
    expect(validateField).not.toHaveBeenCalled()
    await expect
      .element(screen.getByRole('status', { name: 'First errors' }))
      .toHaveTextContent('None')
    await expect
      .element(screen.getByRole('status', { name: 'Second errors' }))
      .toHaveTextContent('None')
  },
)

it('validates the active grouped field without validating its sibling on change', async () => {
  const validateField = vi.fn((name: string) => `${name} error`)
  const screen = await render(
    <StandaloneValidation validateField={validateField} />,
  )

  await screen
    .getByRole('textbox', { name: 'First', exact: true })
    .fill('Edited')

  await expect
    .element(screen.getByRole('status', { name: 'First errors' }))
    .toHaveTextContent('First error')
  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('Group error')
  await expect
    .element(screen.getByRole('status', { name: 'Second errors' }))
    .toHaveTextContent('None')
  expect(validateField).not.toHaveBeenCalledWith('Second')
})

it('validates the active grouped field without validating its sibling on blur', async () => {
  const validateField = vi.fn((name: string) => `${name} error`)
  const screen = await render(
    <StandaloneValidation validateField={validateField} />,
  )

  await screen.getByRole('textbox', { name: 'First', exact: true }).click()
  await screen.getByRole('textbox', { name: 'Second', exact: true }).click()

  await expect
    .element(screen.getByRole('status', { name: 'First errors' }))
    .toHaveTextContent('First error')
  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('Group error')
  await expect
    .element(screen.getByRole('status', { name: 'Second errors' }))
    .toHaveTextContent('None')
  expect(validateField).not.toHaveBeenCalledWith('Second')
})

it('preserves an independent field validation during standalone group validation', async () => {
  const pending = promiseWithResolvers<string | null>()
  const validateField = vi.fn(() => pending.promise)
  const screen = await render(
    <StandaloneValidation validateField={validateField} />,
  )

  await screen.getByRole('textbox', { name: 'Second', exact: true }).click()
  await screen.getByRole('button', { name: 'Validate group change' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group result' }))
    .toHaveTextContent('[{"message":"Group error"}]')
  expect(validateField).toHaveBeenCalledExactlyOnceWith('Second')
  await expect
    .element(screen.getByRole('status', { name: 'Second validating' }))
    .toHaveTextContent('true')

  pending.resolve('Second error')
  await expect
    .element(screen.getByRole('status', { name: 'Second errors' }))
    .toHaveTextContent('Second error')
  await expect
    .element(screen.getByRole('status', { name: 'Second validating' }))
    .toHaveTextContent('false')
})

it('rejects an asynchronous standalone group validator exception and clears validation state', async () => {
  const pending = promiseWithResolvers<never>()
  const screen = await render(
    <StandaloneValidation validateGroup={() => pending.promise} />,
  )

  await screen.getByRole('button', { name: 'Validate group change' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group validating' }))
    .toHaveTextContent('true')
  pending.reject(new Error('Group validation failed'))
  await expect
    .element(screen.getByRole('status', { name: 'Group result' }))
    .toHaveTextContent('Rejected')
  await expect
    .element(screen.getByRole('status', { name: 'Group validating' }))
    .toHaveTextContent('false')
})

it('cancels a waiting group validator and allows a fresh validation', async () => {
  const pending = promiseWithResolvers<string | null>()
  const validateGroup = vi
    .fn<() => Promise<string | null>>()
    .mockReturnValueOnce(pending.promise)
    .mockResolvedValue(null)
  const validateNext = vi.fn(() => null)
  const screen = await render(
    <StandaloneValidation
      validateGroup={validateGroup}
      validateNext={validateNext}
    />,
  )

  await screen.getByRole('button', { name: 'Validate group change' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group validating' }))
    .toHaveTextContent('true')
  await screen.getByRole('button', { name: 'Reset group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group result' }))
    .toHaveTextContent('[]')
  await expect
    .element(screen.getByRole('status', { name: 'Group validating' }))
    .toHaveTextContent('false')
  pending.resolve(null)
  await pending.promise

  await screen.getByRole('button', { name: 'Validate group change' }).click()
  await vi.waitFor(() => expect(validateNext).toHaveBeenCalledOnce())
  await expect
    .element(screen.getByRole('status', { name: 'Group result' }))
    .toHaveTextContent('[]')
  await expect
    .element(screen.getByRole('status', { name: 'Group validating' }))
    .toHaveTextContent('false')
  expect(validateGroup).toHaveBeenCalledTimes(2)
  expect(validateNext).toHaveBeenCalledOnce()
})

it('rejects standalone group validator selection failures', async () => {
  const screen = await render(
    <StandaloneValidation
      shouldValidateGroup={() => {
        throw new Error('Selection failure')
      }}
    />,
  )

  await screen.getByRole('button', { name: 'Validate group change' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Group result' }))
    .toHaveTextContent('Rejected')
  await expect
    .element(screen.getByRole('status', { name: 'Group validating' }))
    .toHaveTextContent('false')
})
