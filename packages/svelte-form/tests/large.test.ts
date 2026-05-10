import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import TestForm, { getSampleData } from './large.svelte'

const user = userEvent.setup()

describe('Svelte Tests', () => {
  it('should have initial values', () => {
    const { container } = render(TestForm)
    expect(container.querySelector<HTMLInputElement>('#firstName')).toHaveValue(
      getSampleData().firstName,
    )
  })

  it('should mirror user input', async () => {
    const { container } = render(TestForm)
    const firstName = container.querySelector<HTMLInputElement>('#firstName')!
    const firstNameValue = 'Jobs'
    await user.type(firstName, firstNameValue)

    const form = JSON.parse(container.querySelector('pre')!.textContent!)
    expect(form.values.firstName).toBe(
      getSampleData().firstName + firstNameValue,
    )
  })
})
