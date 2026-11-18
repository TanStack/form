import React from 'react'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { GroupEventBoundary } from './GroupEventBoundary'
import { CrossGroupWatches } from './CrossGroupWatches'
import { GroupArrayEvents } from './GroupArrayEvents'
import { FullPathGroupField } from './FullPathGroupField'

it.each(['change', 'blur'] as const)(
  'uses group validation for a full-path form field on %s',
  async (trigger) => {
    const screen = await render(<FullPathGroupField />)

    if (trigger === 'change') {
      await screen
        .getByRole('textbox', { name: 'Name', exact: true })
        .fill('edited')
    } else {
      await screen.getByRole('textbox', { name: 'Name', exact: true }).click()
      await screen.getByRole('button', { name: 'Blur input' }).click()
    }

    await expect
      .element(screen.getByRole('status', { name: 'Group errors' }))
      .toHaveTextContent('Group validation')
    await expect
      .element(screen.getByRole('status', { name: 'Form errors' }))
      .toHaveTextContent('None')
  },
)

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

it.each(['change', 'blur'] as const)(
  'keeps automatic %s listeners and validation within the group',
  async (trigger) => {
    const onListener = vi.fn()
    const onValidate = vi.fn(() => null)
    const screen = await render(
      <GroupEventBoundary onListener={onListener} onValidate={onValidate} />,
    )

    if (trigger === 'change') {
      await screen
        .getByRole('textbox', { name: 'Name', exact: true })
        .fill('edited')
    } else {
      await screen.getByRole('textbox', { name: 'Name', exact: true }).click()
      await screen.getByRole('button', { name: 'Blur input' }).click()
    }

    expect(onListener.mock.calls.toSorted()).toEqual([
      ['name'],
      ['nested'],
      ['watching group'],
    ])
    expect(onValidate.mock.calls.toSorted()).toEqual([
      ['group'],
      ['name'],
      ['nested'],
    ])
    await expect
      .element(screen.getByRole('status', { name: 'Section blurred' }))
      .toHaveTextContent('false')
    await expect
      .element(screen.getByRole('status', { name: 'Form touched' }))
      .toHaveTextContent('true')
  },
)

it.each(['change', 'blur'] as const)(
  'preserves ancestor and form notifications for an outside %s',
  async (trigger) => {
    const onListener = vi.fn()
    const onValidate = vi.fn(() => null)
    const screen = await render(
      <GroupEventBoundary onListener={onListener} onValidate={onValidate} />,
    )

    if (trigger === 'change') {
      await screen.getByRole('textbox', { name: 'Outside' }).fill('edited')
    } else {
      await screen.getByRole('textbox', { name: 'Outside' }).click()
      await screen.getByRole('button', { name: 'Blur input' }).click()
    }

    expect(onListener.mock.calls.toSorted()).toEqual([
      ['form'],
      ['outside'],
      ['section'],
    ])
    expect(onValidate.mock.calls.toSorted()).toEqual([
      ['form'],
      ['outside'],
      ['section'],
    ])
  },
)

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
  expect(onListener.mock.calls.toSorted()).toEqual([
    ['watching'],
    ['watching group'],
  ])
  expect(onValidate.mock.calls).toEqual([['group']])
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

  expect(onListener.mock.calls.toSorted()).toEqual([
    ['watching'],
    ['watching group'],
  ])
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

  expect(onListener.mock.calls.toSorted()).toEqual([
    ['last'],
    ['second watching'],
  ])
  expect(onValidate.mock.calls.toSorted()).toEqual([
    ['first'],
    ['last'],
    ['second watching'],
  ])
})

it.each(['Add tag', 'Filter tags'])(
  'keeps the %s array operation within an array-index group',
  async (button) => {
    const onListener = vi.fn()
    const onValidate = vi.fn(() => null)
    const screen = await render(
      <GroupArrayEvents onListener={onListener} onValidate={onValidate} />,
    )

    await screen.getByRole('button', { name: button, exact: true }).click()

    expect(onListener.mock.calls).toEqual([['tags']])
    expect(onValidate.mock.calls.toSorted()).toEqual([['group'], ['tags']])
    await expect
      .element(screen.getByRole('status', { name: 'Tags' }))
      .toHaveTextContent(button === 'Add tag' ? 'initial, added' : 'initial')
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
  expect(onValidate.mock.calls).toEqual([['group']])
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

  expect(onListener.mock.calls.toSorted()).toEqual([['form'], ['users']])
  expect(onValidate.mock.calls.toSorted()).toEqual([['form'], ['users']])
})
