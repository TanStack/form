import React from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import {
  ArrayMetaSubscription,
  DynamicArrayMetaSubscription,
} from './ArrayMetaSubscription'
import { GroupArrayMetaSubscriptions } from './GroupArrayMetaSubscriptions'
import { AppArrayMetaSubscriptions } from './AppArrayMetaSubscriptions'

it.each([
  { mode: 'omitted', props: {} },
  { mode: 'false', props: { subscribeToMeta: false } },
])(
  'ignores meta-only updates when subscribeToMeta is $mode',
  async ({ props }) => {
    const screen = await render(<ArrayMetaSubscription {...props} />)

    await screen.getByRole('button', { name: 'Blur array' }).click()

    await expect
      .element(screen.getByRole('status', { name: 'Backing array blurred' }))
      .toHaveTextContent('true')
    await expect
      .element(
        screen.getByRole('status', { name: 'Array blurred', exact: true }),
      )
      .toHaveTextContent('false')
  },
)

it('subscribes to the backing field meta, including derived and subfield flags', async () => {
  const screen = await render(<ArrayMetaSubscription subscribeToMeta />)

  await expect
    .element(screen.getByRole('status', { name: 'Array dirty' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Array default' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Subfields dirty' }))
    .toHaveTextContent('false')
  await screen.getByRole('button', { name: 'Blur array' }).click()
  await expect
    .element(screen.getByRole('status', { name: 'Array blurred', exact: true }))
    .toHaveTextContent('true')

  await screen.getByRole('textbox', { name: 'Item 1' }).fill('Edited')
  await expect
    .element(screen.getByRole('status', { name: 'Array dirty' }))
    .toHaveTextContent('true')
  await expect
    .element(screen.getByRole('status', { name: 'Array default' }))
    .toHaveTextContent('false')
  await expect
    .element(screen.getByRole('status', { name: 'Subfields dirty' }))
    .toHaveTextContent('true')
})

it.each([false, true])(
  'preserves length and version updates with subscribeToMeta=%s',
  async (subscribeToMeta) => {
    const screen = await render(
      <ArrayMetaSubscription subscribeToMeta={subscribeToMeta} />,
    )
    const value = screen.getByRole('status', { name: 'Array value' })

    await screen.getByRole('button', { name: 'Add item' }).click()
    await expect.element(value).toHaveTextContent('Initial, Added')
    await screen.getByRole('button', { name: 'Replace first item' }).click()
    await expect.element(value).toHaveTextContent('Replacement, Added')
    await screen.getByRole('button', { name: 'Remove last item' }).click()
    await expect.element(value).toHaveTextContent('Replacement')
    await expect.element(value).not.toHaveTextContent('Added')
    await screen.getByRole('button', { name: 'Clear items' }).click()
    await expect.element(value).toBeEmptyDOMElement()
  },
)

it.each([
  { subscribeToMeta: false, displayedValue: 'Initial' },
  { subscribeToMeta: true, displayedValue: 'Edited' },
])(
  'does not subscribe to the full value with subscribeToMeta=$subscribeToMeta',
  async ({ subscribeToMeta, displayedValue }) => {
    const screen = await render(
      <ArrayMetaSubscription subscribeToMeta={subscribeToMeta} />,
    )
    const input = screen.getByRole('textbox', { name: 'Item 1' })
    const backingValue = screen.getByRole('status', {
      name: 'Backing first item',
    })
    const arrayValue = screen.getByRole('status', { name: 'Array value' })

    await input.fill('Edited')
    await expect.element(backingValue).toHaveTextContent('Edited')
    await expect.element(arrayValue).toHaveTextContent(displayedValue)

    await input.fill('Another edit')
    await expect.element(backingValue).toHaveTextContent('Another edit')
    await expect.element(arrayValue).toHaveTextContent(displayedValue)
  },
)

it('starts and stops meta updates when the prop changes without remounting', async () => {
  const screen = await render(<DynamicArrayMetaSubscription />)
  const blurred = screen.getByRole('status', {
    name: 'Array blurred',
    exact: true,
  })
  const backingBlurred = screen.getByRole('status', {
    name: 'Backing array blurred',
  })
  const toggle = screen.getByRole('button', {
    name: 'Toggle meta subscription',
  })

  await screen.getByRole('button', { name: 'Blur array' }).click()
  await expect.element(backingBlurred).toHaveTextContent('true')
  await expect.element(blurred).toHaveTextContent('false')

  await toggle.click()
  await expect.element(blurred).toHaveTextContent('true')
  await screen.getByRole('button', { name: 'Reset array' }).click()
  await expect.element(backingBlurred).toHaveTextContent('false')
  await expect.element(blurred).toHaveTextContent('false')

  await toggle.click()
  await screen.getByRole('button', { name: 'Blur array' }).click()
  await expect.element(backingBlurred).toHaveTextContent('true')
  await expect.element(blurred).toHaveTextContent('false')
  await screen.getByRole('button', { name: 'Add item' }).click()
  await expect.element(blurred).toHaveTextContent('true')
})

it.each([
  {
    name: 'form groups',
    Component: GroupArrayMetaSubscriptions,
    label: 'Group array',
  },
  {
    name: 'field groups',
    Component: GroupArrayMetaSubscriptions,
    label: 'Field group array',
  },
  {
    name: 'App Forms',
    Component: AppArrayMetaSubscriptions,
    label: 'App array',
  },
  {
    name: 'App Form groups',
    Component: AppArrayMetaSubscriptions,
    label: 'App group array',
  },
  {
    name: 'App Form field groups',
    Component: AppArrayMetaSubscriptions,
    label: 'App field group array',
  },
])(
  'forwards meta subscriptions through $name',
  async ({ Component, label }) => {
    const screen = await render(<Component />)
    const blurred = screen.getByRole('status', {
      name: `${label} blurred`,
      exact: true,
    })

    await expect.element(blurred).toHaveTextContent('false')
    await screen
      .getByRole('button', { name: `${label} blur`, exact: true })
      .click()
    await expect.element(blurred).toHaveTextContent('true')
  },
)
