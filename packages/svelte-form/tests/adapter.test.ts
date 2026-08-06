import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import BaseForm from './adapter/BaseForm.svelte'
import AppForm from './adapter/AppForm.svelte'
import FieldGroup from './adapter/FieldGroup.svelte'
import ParityForm from './adapter/ParityForm.svelte'

const user = userEvent.setup()

describe('Svelte Form v2 adapter', () => {
  it('renders reactive fields, arrays, subscriptions, groups, and resets', async () => {
    const { getByLabelText, getByRole, getByTestId, queryByTestId } =
      render(BaseForm)

    const name = getByLabelText('Name')
    await user.clear(name)
    await user.type(name, 'x')
    expect(getByRole('alert')).toHaveTextContent('Name is too short')
    await user.clear(name)
    await user.type(name, 'Updated')
    expect(getByTestId('name-value')).toHaveTextContent('Updated')

    await user.click(getByRole('button', { name: 'Push' }))
    expect(getByTestId('items')).toHaveTextContent('one,two')

    const guest = getByLabelText('Guest')
    await user.clear(guest)
    await user.type(guest, 'Changed')
    expect(getByTestId('group-value')).toHaveTextContent('Changed')

    expect(queryByTestId('visible')).toBeNull()
    await user.click(getByRole('button', { name: 'Show' }))
    expect(getByTestId('visible')).toBeInTheDocument()

    await user.click(getByRole('button', { name: 'Reset' }))
    expect(name).toHaveValue('Rodney')
    expect(getByTestId('items')).toHaveTextContent('reset')
    expect(getByTestId('group-value')).toHaveTextContent('Reset Guest')
  })

  it('provides typed app field and form contexts through form groups', async () => {
    const { getByRole, getByTestId } = render(AppForm)
    expect(getByTestId('app-field')).toHaveTextContent('Name:guest.name:Tony')
    expect(getByTestId('summary')).toHaveTextContent(
      JSON.stringify({ guest: { name: 'Tony' } }),
    )
    await user.click(getByRole('button', { name: 'Update label' }))
    expect(getByTestId('app-field')).toHaveTextContent(
      'Guest name:guest.name:Tony',
    )
  })

  it('maps reusable logical fields and forwards methods and atoms', async () => {
    const { getByRole, getByTestId } = render(FieldGroup)
    expect(getByTestId('logical-field')).toHaveTextContent(
      'profile.name:Initial',
    )
    await user.click(getByRole('button', { name: 'Update logical' }))
    expect(getByTestId('logical-value')).toHaveTextContent('Updated')
    expect(getByTestId('logical-field')).toHaveTextContent(
      'profile.name:Updated',
    )
  })

  it('prefixes watched fields, preserves field registration, and isolates array updates', async () => {
    let watchedCalls = 0
    let mountCalls = 0
    let unmountCalls = 0
    const { getByRole, getByTestId, unmount } = render(ParityForm, {
      watchedListener: () => watchedCalls++,
      mountListener: () => mountCalls++,
      unmountListener: () => unmountCalls++,
    })

    await user.click(getByRole('button', { name: 'Change watched field' }))
    expect(watchedCalls).toBe(1)

    const initialMounts = mountCalls
    const initialUnmounts = unmountCalls
    await user.click(getByRole('button', { name: 'Update options' }))
    expect(mountCalls).toBe(initialMounts)
    expect(unmountCalls).toBe(initialUnmounts)

    const initialArrayRuns = Number(getByTestId('array-runs').textContent)
    await user.click(getByRole('button', { name: 'Change array child' }))
    expect(Number(getByTestId('array-runs').textContent)).toBe(initialArrayRuns)

    await user.click(getByRole('button', { name: 'Push array item' }))
    expect(Number(getByTestId('array-runs').textContent)).toBe(
      initialArrayRuns + 1,
    )
    expect(getByTestId('array-length')).toHaveTextContent('2')

    unmount()
    expect(mountCalls - unmountCalls).toBe(0)
  })
})
