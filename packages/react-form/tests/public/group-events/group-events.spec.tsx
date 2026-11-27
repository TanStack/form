import React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { GroupEventBoundary } from './GroupEventBoundary'
import { CrossGroupWatches } from './CrossGroupWatches'
import { GroupArrayEvents } from './GroupArrayEvents'
import { FullPathGroupField } from './FullPathGroupField'

it('uses group validation for a full-path form field on change', async () => {
  const screen = await render(<FullPathGroupField />)

  await screen
    .getByRole('textbox', { name: 'Name', exact: true })
    .fill('edited')

  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('Group validation')
  await expect
    .element(screen.getByRole('status', { name: 'Form errors' }))
    .toHaveTextContent('None')
})

it('uses group validation for a full-path form field on blur', async () => {
  const screen = await render(<FullPathGroupField />)

  await screen.getByRole('textbox', { name: 'Name', exact: true }).click()
  await screen.getByRole('button', { name: 'Blur input' }).click()

  await expect
    .element(screen.getByRole('status', { name: 'Group errors' }))
    .toHaveTextContent('Group validation')
  await expect
    .element(screen.getByRole('status', { name: 'Form errors' }))
    .toHaveTextContent('None')
})

it('uses group submission state for a full-path form field touch and error visibility', async () => {
  const screen = await render(<FullPathGroupField />)

  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('None')
  await expect
    .element(screen.getByRole('status', { name: 'Name touched' }))
    .toHaveTextContent('false')
  await screen.getByRole('button', { name: 'Submit group' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Name errors' }))
    .toHaveTextContent('Name required')
  await expect
    .element(screen.getByRole('status', { name: 'Name touched' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Form attempts' }))
    .toHaveTextContent('0')
})

it('keeps automatic change listeners and validation within the group', async () => {
  const onListener = vi.fn()
  const onValidate = vi.fn(() => null)
  const screen = await render(
    <GroupEventBoundary onListener={onListener} onValidate={onValidate} />,
  )

  await screen
    .getByRole('textbox', { name: 'Name', exact: true })
    .fill('edited')

  expect(onListener).toHaveBeenCalledTimes(3)
  expect(onListener).toHaveBeenCalledWith('name')
  expect(onListener).toHaveBeenCalledWith('nested')
  expect(onListener).toHaveBeenCalledWith('watching group')
  expect(onValidate).toHaveBeenCalledTimes(3)
  expect(onValidate).toHaveBeenCalledWith('group')
  expect(onValidate).toHaveBeenCalledWith('name')
  expect(onValidate).toHaveBeenCalledWith('nested')
  await expect
    .element(screen.getByRole('status', { name: 'Section blurred' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('true')
})

it('keeps automatic blur listeners and validation within the group', async () => {
  const onListener = vi.fn()
  const onValidate = vi.fn(() => null)
  const screen = await render(
    <GroupEventBoundary onListener={onListener} onValidate={onValidate} />,
  )

  await screen.getByRole('textbox', { name: 'Name', exact: true }).click()
  await screen.getByRole('button', { name: 'Blur input' }).click()

  expect(onListener).toHaveBeenCalledTimes(3)
  expect(onListener).toHaveBeenCalledWith('name')
  expect(onListener).toHaveBeenCalledWith('nested')
  expect(onListener).toHaveBeenCalledWith('watching group')
  expect(onValidate).toHaveBeenCalledTimes(3)
  expect(onValidate).toHaveBeenCalledWith('group')
  expect(onValidate).toHaveBeenCalledWith('name')
  expect(onValidate).toHaveBeenCalledWith('nested')
  await expect
    .element(screen.getByRole('status', { name: 'Section blurred' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('true')
})

it('preserves ancestor and form notifications for an outside change', async () => {
  const onListener = vi.fn()
  const onValidate = vi.fn(() => null)
  const screen = await render(
    <GroupEventBoundary onListener={onListener} onValidate={onValidate} />,
  )

  await screen.getByRole('textbox', { name: 'Outside' }).fill('edited')

  expect(onListener).toHaveBeenCalledTimes(3)
  expect(onListener).toHaveBeenCalledWith('form')
  expect(onListener).toHaveBeenCalledWith('outside')
  expect(onListener).toHaveBeenCalledWith('section')
  expect(onValidate).toHaveBeenCalledTimes(3)
  expect(onValidate).toHaveBeenCalledWith('form')
  expect(onValidate).toHaveBeenCalledWith('outside')
  expect(onValidate).toHaveBeenCalledWith('section')
})

it('preserves ancestor and form notifications for an outside blur', async () => {
  const onListener = vi.fn()
  const onValidate = vi.fn(() => null)
  const screen = await render(
    <GroupEventBoundary onListener={onListener} onValidate={onValidate} />,
  )

  await screen.getByRole('textbox', { name: 'Outside' }).click()
  await screen.getByRole('button', { name: 'Blur input' }).click()

  expect(onListener).toHaveBeenCalledTimes(3)
  expect(onListener).toHaveBeenCalledWith('form')
  expect(onListener).toHaveBeenCalledWith('outside')
  expect(onListener).toHaveBeenCalledWith('section')
  expect(onValidate).toHaveBeenCalledTimes(3)
  expect(onValidate).toHaveBeenCalledWith('form')
  expect(onValidate).toHaveBeenCalledWith('outside')
  expect(onValidate).toHaveBeenCalledWith('section')
})

it('resolves group ownership for a change without a rendered field', async () => {
  const onListener = vi.fn()
  const onValidate = vi.fn(() => null)
  const screen = await render(
    <GroupEventBoundary onListener={onListener} onValidate={onValidate} />,
  )

  await screen.getByRole('button', { name: 'Write unrendered field' }).click()

  await expect
    .element(screen.getByRole('status', { name: 'Unrendered value' }))
    .toHaveTextContent('edited')
  expect(onListener).toHaveBeenCalledTimes(2)
  expect(onListener).toHaveBeenCalledWith('watching')
  expect(onListener).toHaveBeenCalledWith('watching group')
  expect(onValidate).toHaveBeenCalledExactlyOnceWith('group')
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Form dirty' }))
    .toHaveTextContent('false')
})

it('isolates grouped change listeners when validation is disabled', async () => {
  const onListener = vi.fn()
  const onValidate = vi.fn(() => null)
  const screen = await render(
    <GroupEventBoundary onListener={onListener} onValidate={onValidate} />,
  )

  await screen.getByRole('button', { name: 'Write without validation' }).click()

  expect(onListener).toHaveBeenCalledTimes(2)
  expect(onListener).toHaveBeenCalledWith('watching')
  expect(onListener).toHaveBeenCalledWith('watching group')
  expect(onValidate).not.toHaveBeenCalled()
  await expect
    .element(screen.getByRole('status', { name: 'Form touched' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Form dirty' }))
    .toHaveTextContent('false')
})

it('delivers explicit watches across groups without invoking their owners', async () => {
  const onListener = vi.fn()
  const onValidate = vi.fn(() => null)
  const screen = await render(
    <CrossGroupWatches onListener={onListener} onValidate={onValidate} />,
  )

  await screen
    .getByRole('textbox', { name: 'Name', exact: true })
    .fill('edited')

  expect(onListener).toHaveBeenCalledTimes(2)
  expect(onListener).toHaveBeenCalledWith('last')
  expect(onListener).toHaveBeenCalledWith('second watching')
  expect(onValidate).toHaveBeenCalledTimes(3)
  expect(onValidate).toHaveBeenCalledWith('first')
  expect(onValidate).toHaveBeenCalledWith('last')
  expect(onValidate).toHaveBeenCalledWith('second watching')
})

it.each([
  { button: 'Add tag', expectedTags: 'initial, added' },
  { button: 'Filter tags', expectedTags: 'initial' },
])(
  'keeps the $button array operation within an array-index group',
  async ({ button, expectedTags }) => {
    const onListener = vi.fn()
    const onValidate = vi.fn(() => null)
    const screen = await render(
      <GroupArrayEvents onListener={onListener} onValidate={onValidate} />,
    )

    await screen.getByRole('button', { name: button, exact: true }).click()

    expect(onListener).toHaveBeenCalledExactlyOnceWith('tags')
    expect(onValidate).toHaveBeenCalledTimes(2)
    expect(onValidate).toHaveBeenCalledWith('group')
    expect(onValidate).toHaveBeenCalledWith('tags')
    await expect
      .element(screen.getByRole('status', { name: 'Tags' }))
      .toHaveTextContent(expectedTags)
  },
)

it('keeps a field event within its array-index group', async () => {
  const onListener = vi.fn()
  const onValidate = vi.fn(() => null)
  const screen = await render(
    <GroupArrayEvents onListener={onListener} onValidate={onValidate} />,
  )

  await screen
    .getByRole('textbox', { name: 'Name', exact: true })
    .fill('edited')

  expect(onListener).not.toHaveBeenCalled()
  expect(onValidate).toHaveBeenCalledExactlyOnceWith('group')
})

it('keeps an operation above the groups owned by the form', async () => {
  const onListener = vi.fn()
  const onValidate = vi.fn(() => null)
  const screen = await render(
    <GroupArrayEvents onListener={onListener} onValidate={onValidate} />,
  )

  await screen
    .getByRole('button', { name: 'Filter users', exact: true })
    .click()

  expect(onListener).toHaveBeenCalledTimes(2)
  expect(onListener).toHaveBeenCalledWith('form')
  expect(onListener).toHaveBeenCalledWith('users')
  expect(onValidate).toHaveBeenCalledTimes(2)
  expect(onValidate).toHaveBeenCalledWith('form')
  expect(onValidate).toHaveBeenCalledWith('users')
})
