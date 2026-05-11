import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import TestForm, { getSampleData } from './large.svelte'

const user = userEvent.setup()

describe('Svelte Tests', () => {
  it('should have initial values', () => {
    const { getByLabelText } = render(TestForm)
    expect(getByLabelText('First name')).toHaveValue(getSampleData().firstName)
  })

  it('should mirror user input', async () => {
    const { getByLabelText, getByTestId } = render(TestForm)
    const firstName = getByLabelText('First name')
    const firstNameValue = 'Jobs'
    await user.type(firstName, firstNameValue)

    const form = JSON.parse(getByTestId('form-state').textContent!)
    expect(form.values.firstName).toBe(
      getSampleData().firstName + firstNameValue,
    )
  })
})
