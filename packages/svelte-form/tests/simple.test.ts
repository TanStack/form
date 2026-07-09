import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import TestForm, { getSampleData } from './simple.svelte'

const user = userEvent.setup()

describe('Svelte Tests', () => {
  it('should have initial values', () => {
    const { getByLabelText } = render(TestForm)
    expect(getByLabelText('First Name')).toHaveValue(getSampleData().firstName)
    expect(getByLabelText('Last Name')).toHaveValue(getSampleData().lastName)
  })

  it('should change initial values when defaults update', async () => {
    const { getByLabelText, getByRole } = render(TestForm)
    await user.click(getByRole('button', { name: 'Change Sample Data' }))

    expect(getByLabelText('First Name')).toHaveValue(getSampleData().firstName)
    expect(getSampleData().firstName).toBe('Julian')
  })

  it('should mirror user input', async () => {
    const { getByLabelText, getByTestId } = render(TestForm)
    const lastName = getByLabelText('Last Name')
    const lastNameValue = 'Jobs'
    await user.type(lastName, lastNameValue)

    const form = JSON.parse(getByTestId('form-state').textContent!)
    expect(form.values.lastName).toBe(lastNameValue)
  })

  it('Reset form to initial value', async () => {
    const { getByLabelText, getByRole } = render(TestForm)
    const firstName = getByLabelText('First Name')
    await user.type(firstName, '-Joseph')

    expect(firstName).toHaveValue(getSampleData().firstName + '-Joseph')

    await user.click(getByRole('button', { name: 'Reset' }))
    expect(firstName).toHaveValue(getSampleData().firstName)
  })

  it('should display validation', async () => {
    const { getByLabelText, getByText, queryByText } = render(TestForm)
    const lastName = getByLabelText('Last Name')
    const lastNameValue = 'Jo'
    await user.type(lastName, lastNameValue)
    expect(lastName).toHaveValue('Jo')
    expect(getByText('Not long enough')).toBeInTheDocument()

    await user.type(lastName, lastNameValue)

    expect(lastName.getAttribute('error-text')).toBeFalsy()
    expect(queryByText('Not long enough')).not.toBeInTheDocument()
  })
})
