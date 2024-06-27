/// <reference lib="dom" />
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { TestForm, sampleData } from './simple'

window.customElements.define('test-form', TestForm)
describe('Lit Tests', () => {
  let element: TestForm
  beforeEach(async () => {
    element = document.createElement('test-form') as TestForm
    document.body.appendChild(element)
    await element.updateComplete
  })

  afterEach(() => {
    element.remove()
  })

  it('should have initial values', async () => {
    expect(
      await element.shadowRoot!.querySelector<HTMLInputElement>('#firstName'),
    ).toHaveValue(sampleData.firstName)
    expect(
      await element.shadowRoot!.querySelector<HTMLInputElement>('#lastName'),
    ).toHaveValue('')
    const form = element.form!
    expect(form.api.getFieldValue('firstName')).toBe(sampleData.firstName)
    expect(form.api.getFieldMeta('firstName')?.isTouched).toBeFalsy()
    expect(form.api.getFieldValue('lastName')).toBe('')
    expect(form.api.getFieldMeta('lastName')?.isTouched).toBeFalsy()
  })
  it('should mirror user input', async () => {
    const lastName =
      await element.shadowRoot!.querySelector<HTMLInputElement>('#lastName')!
    const lastNameValue = 'Jobs'
    await userEvent.type(lastName, lastNameValue)

    const form = element.form!
    expect(form.api.getFieldValue('lastName')).toBe(lastNameValue)
    expect(form.api.getFieldMeta('lastName')?.isTouched).toBeTruthy()
  })
  it('Reset form to initial value', async () => {
    const firstName =
      await element.shadowRoot!.querySelector<HTMLInputElement>('#firstName')!
    await userEvent.type(firstName, '-Joseph')

    expect(firstName).toHaveValue('Christian-Joseph')

    const form = element.form
    await element
      .shadowRoot!.querySelector<HTMLButtonElement>('#reset')
      ?.click()
    expect(form.api.getFieldValue('firstName')).toBe(sampleData.firstName)
  })

  it('should display validation', async () => {
    const lastName =
      await element.shadowRoot!.querySelector<HTMLInputElement>('#lastName')!
    const lastNameValue = 'Jo'
    await userEvent.type(lastName, lastNameValue)
    expect(lastName).toHaveValue('Jo')
    const form = element.form
    expect(form.api.getFieldMeta('lastName')?.errors[0]).toBe('Not long enough')

    await userEvent.type(lastName, lastNameValue)

    expect(await lastName.getAttribute('error-text')).toBeFalsy()
    expect(form.api.getFieldValue('lastName')).toBe('JoJo')
    expect(form.api.getFieldMeta('lastName')?.isTouched).toBeTruthy()
    expect(form.api.getFieldMeta('lastName')?.errors.length).toBeFalsy()
  })
})
