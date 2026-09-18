import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import BaseForm from './adapter/BaseForm.svelte'
import AppForm from './adapter/AppForm.svelte'
import FieldGroup from './adapter/FieldGroup.svelte'
import IdentityFieldGroup from './adapter/IdentityFieldGroup.svelte'
import ParityForm from './adapter/ParityForm.svelte'

describe('Svelte Form v2 adapter', () => {
  it('renders reactive fields, arrays, subscriptions, groups, and resets', async () => {
    const { getByLabelText, getByRole, getByTestId } = await render(BaseForm)

    const name = getByLabelText('Name')
    await name.clear()
    await userEvent.type(name, 'x')
    expect(getByRole('alert')).toHaveTextContent('Name is too short')
    await name.clear()
    await userEvent.type(name, 'Updated')
    expect(getByTestId('name-value')).toHaveTextContent('Updated')

    await getByRole('button', { name: 'Push' }).click()
    expect(getByTestId('items')).toHaveTextContent('one,two')

    const guest = getByLabelText('Guest')
    await guest.clear()
    await userEvent.type(guest, 'Changed')
    expect(getByTestId('group-value')).toHaveTextContent('Changed')

    await expect.element(getByTestId('visible')).not.toBeInTheDocument()
    await getByRole('button', { name: 'Show' }).click()
    expect(getByTestId('visible')).toBeInTheDocument()

    await getByRole('button', { name: 'Reset' }).click()
    expect(name).toHaveValue('Rodney')
    expect(getByTestId('items')).toHaveTextContent('reset')
    expect(getByTestId('group-value')).toHaveTextContent('Reset Guest')
  })

  it('provides typed app field and form contexts through form groups', async () => {
    const { getByRole, getByTestId } = await render(AppForm)
    expect(getByTestId('app-field')).toHaveTextContent('Name:guest.name:Tony')
    expect(getByTestId('summary')).toHaveTextContent(
      JSON.stringify({ guest: { name: 'Tony' } }),
    )
    await getByRole('button', { name: 'Update label' }).click()
    expect(getByTestId('app-field')).toHaveTextContent(
      'Guest name:guest.name:Tony',
    )
  })

  it('maps reusable logical fields and forwards methods and atoms', async () => {
    const { getByRole, getByTestId } = await render(FieldGroup)
    expect(getByTestId('logical-field')).toHaveTextContent(
      'profile.name:Initial',
    )
    await getByRole('button', { name: 'Update logical' }).click()
    expect(getByTestId('logical-value')).toHaveTextContent('Updated')
    expect(getByTestId('logical-field')).toHaveTextContent(
      'profile.name:Updated',
    )
    await getByRole('button', { name: 'Move logical item' }).click()
    expect(getByTestId('logical-items')).toHaveTextContent('b,c,a')
  })

  it('defaults omitted bindings to same-named form fields', async () => {
    const { getByRole, getByTestId } = await render(IdentityFieldGroup)
    expect(getByTestId('logical-field')).toHaveTextContent('name:Initial')
    await getByRole('button', { name: 'Update logical' }).click()
    expect(getByTestId('logical-value')).toHaveTextContent('Updated')
    expect(getByTestId('logical-field')).toHaveTextContent('name:Updated')
    await getByRole('button', { name: 'Move logical item' }).click()
    expect(getByTestId('logical-items')).toHaveTextContent('b,c,a')
  })

  it('prefixes watched fields, preserves field registration, and isolates array updates', async () => {
    let watchedCalls = 0
    let mountCalls = 0
    let unmountCalls = 0
    const { getByRole, getByTestId, unmount } = await render(ParityForm, {
      watchedListener: () => watchedCalls++,
      mountListener: () => mountCalls++,
      unmountListener: () => unmountCalls++,
    })

    await getByRole('button', { name: 'Change watched field' }).click()
    expect(watchedCalls).toBe(1)

    const initialMounts = mountCalls
    const initialUnmounts = unmountCalls
    await getByRole('button', { name: 'Update options' }).click()
    expect(mountCalls).toBe(initialMounts)
    expect(unmountCalls).toBe(initialUnmounts)

    const initialArrayRuns = Number(
      getByTestId('array-runs').element().textContent,
    )
    await getByRole('button', { name: 'Change array child' }).click()
    expect(Number(getByTestId('array-runs').element().textContent)).toBe(
      initialArrayRuns,
    )

    await getByRole('button', { name: 'Push array item' }).click()
    expect(Number(getByTestId('array-runs').element().textContent)).toBe(
      initialArrayRuns + 1,
    )
    expect(getByTestId('array-length')).toHaveTextContent('2')

    await unmount()
    expect(mountCalls - unmountCalls).toBe(0)
  })
})
