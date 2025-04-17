import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { mount, unmount } from 'svelte'
import TestForm, { getSampleData } from './simple.svelte'

describe('Svelte Tests', () => {
  let element: HTMLDivElement
  let instance: any
  beforeEach(async () => {
    element = document.createElement('div')
    document.body.appendChild(element)
    instance = mount(TestForm, {
      target: element,
    })
  })

  afterEach(() => {
    unmount(instance)
    element.remove()
  })

  it('should have initial values', async () => {
    expect(element.querySelector<HTMLInputElement>('#firstName')).toHaveValue(
      getSampleData().firstName,
    )
    expect(element.querySelector<HTMLInputElement>('#lastName')).toHaveValue(
      getSampleData().lastName,
    )
  })

  it('should change initial values when defaults update', async () => {
    await userEvent.click(element.querySelector<HTMLButtonElement>('#change')!)

    expect(element.querySelector<HTMLInputElement>('#firstName')).toHaveValue(
      getSampleData().firstName,
    )
    expect(getSampleData().firstName).toBe('Julian')
  })

  it('should mirror user input', async () => {
    const lastName = element.querySelector<HTMLInputElement>('#lastName')!
    const lastNameValue = 'Jobs'
    await userEvent.type(lastName, lastNameValue)

    const form = JSON.parse(element.querySelector('pre')!.textContent!)
    expect(form.values.lastName).toBe(lastNameValue)
  })

  it('Reset form to initial value', async () => {
    const firstName = element.querySelector<HTMLInputElement>('#firstName')!
    await userEvent.type(firstName, '-Joseph')

    expect(firstName).toHaveValue(getSampleData().firstName + '-Joseph')

    await userEvent.click(element.querySelector<HTMLButtonElement>('#reset')!)
    expect(firstName).toHaveValue(getSampleData().firstName)
  })

  it('should display validation', async () => {
    const lastName = element.querySelector<HTMLInputElement>('#lastName')!
    const lastNameValue = 'Jo'
    await userEvent.type(lastName, lastNameValue)
    expect(lastName).toHaveValue('Jo')
    expect(element.querySelector('em')?.textContent).toBe('Not long enough')

    await userEvent.type(lastName, lastNameValue)

    expect(lastName.getAttribute('error-text')).toBeFalsy()
    expect(element.querySelector('em')).not.toBeInTheDocument()
  })
})
