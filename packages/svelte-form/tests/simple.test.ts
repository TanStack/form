import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import TestForm, { getSampleData } from './simple.svelte'

const user = userEvent.setup()

describe('Svelte Tests', () => {
  it('should have initial values', () => {
    const { container } = render(TestForm)
    expect(container.querySelector<HTMLInputElement>('#firstName')).toHaveValue(
      getSampleData().firstName,
    )
    expect(container.querySelector<HTMLInputElement>('#lastName')).toHaveValue(
      getSampleData().lastName,
    )
  })

  it('should change initial values when defaults update', async () => {
    const { container } = render(TestForm)
    await user.click(container.querySelector<HTMLButtonElement>('#change')!)

    expect(container.querySelector<HTMLInputElement>('#firstName')).toHaveValue(
      getSampleData().firstName,
    )
    expect(getSampleData().firstName).toBe('Julian')
  })

  it('should mirror user input', async () => {
    const { container } = render(TestForm)
    const lastName = container.querySelector<HTMLInputElement>('#lastName')!
    const lastNameValue = 'Jobs'
    await user.type(lastName, lastNameValue)

    const form = JSON.parse(container.querySelector('pre')!.textContent!)
    expect(form.values.lastName).toBe(lastNameValue)
  })

  it('Reset form to initial value', async () => {
    const { container } = render(TestForm)
    const firstName = container.querySelector<HTMLInputElement>('#firstName')!
    await user.type(firstName, '-Joseph')

    expect(firstName).toHaveValue(getSampleData().firstName + '-Joseph')

    await user.click(container.querySelector<HTMLButtonElement>('#reset')!)
    expect(firstName).toHaveValue(getSampleData().firstName)
  })

  it('should display validation', async () => {
    const { container } = render(TestForm)
    const lastName = container.querySelector<HTMLInputElement>('#lastName')!
    const lastNameValue = 'Jo'
    await user.type(lastName, lastNameValue)
    expect(lastName).toHaveValue('Jo')
    expect(container.querySelector('em')?.textContent).toBe('Not long enough')

    await user.type(lastName, lastNameValue)

    expect(lastName.getAttribute('error-text')).toBeFalsy()
    expect(container.querySelector('em')).not.toBeInTheDocument()
  })
})
