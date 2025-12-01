import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { mount, unmount } from 'svelte'
import TestForm, { getSampleData } from './large.svelte'

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
  })

  it('should mirror user input', async () => {
    const firstName = element.querySelector<HTMLInputElement>('#firstName')!
    const firstNameValue = 'Jobs'
    await userEvent.type(firstName, firstNameValue)

    const form = JSON.parse(element.querySelector('pre')!.textContent!)
    expect(form.values.firstName).toBe(
      getSampleData().firstName + firstNameValue,
    )
  })
})
