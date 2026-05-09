import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { mount, unmount } from 'svelte'
import FormGroupSubmit from './form-group/formGroupSubmit.svelte'
import FormGroupReactive from './form-group/formGroupReactive.svelte'
import FormGroupInvalid from './form-group/formGroupInvalid.svelte'
import FormGroupOuterErrors from './form-group/formGroupOuterErrors.svelte'
import FormGroupSubmitMeta from './form-group/formGroupSubmitMeta.svelte'

const user = userEvent.setup()

describe('form.FormGroup', () => {
  let element: HTMLDivElement
  let instance: any

  function render(component: any, props: Record<string, any> = {}) {
    element = document.createElement('div')
    document.body.appendChild(element)
    instance = mount(component, {
      target: element,
      props,
    })
  }

  afterEach(() => {
    unmount(instance)
    element.remove()
  })

  it('should call onGroupSubmit but not the form onSubmit when submitting the group', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()

    render(FormGroupSubmit, { onSubmit, onGroupSubmit })

    await user.click(
      element.querySelector<HTMLButtonElement>(
        '[data-testid="submit-group"]',
      )!,
    )

    await vi.waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should expose group state value reactively', async () => {
    render(FormGroupReactive)

    const groupValue = () =>
      element.querySelector('[data-testid="group-value"]')!.textContent
    expect(groupValue()).toBe('{"name":"initial"}')

    const input = element.querySelector<HTMLInputElement>(
      '[data-testid="step1-name"]',
    )!
    await user.clear(input)
    await user.type(input, 'updated')

    await vi.waitFor(() => expect(groupValue()).toBe('{"name":"updated"}'))
  })

  it('should call onGroupSubmitInvalid when group-level validation fails', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    render(FormGroupInvalid, { onSubmit, onGroupSubmit, onGroupSubmitInvalid })

    await user.click(
      element.querySelector<HTMLButtonElement>(
        '[data-testid="submit-group"]',
      )!,
    )

    await vi.waitFor(() => expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1))
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    await vi.waitFor(() =>
      expect(
        element.querySelector('[data-testid="group-error"]')!.textContent,
      ).toBe('Name is required'),
    )
  })

  it('should ignore form-level field errors outside the group when submitting the group', async () => {
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    render(FormGroupOuterErrors, { onGroupSubmit, onGroupSubmitInvalid })

    await user.click(
      element.querySelector<HTMLButtonElement>(
        '[data-testid="submit-group"]',
      )!,
    )

    await vi.waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onGroupSubmitInvalid).not.toHaveBeenCalled()
  })

  it('should pass submit meta through handleSubmit', async () => {
    const onGroupSubmit = vi.fn()

    render(FormGroupSubmitMeta, { onGroupSubmit })

    await user.click(
      element.querySelector<HTMLButtonElement>(
        '[data-testid="submit-group"]',
      )!,
    )

    await vi.waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onGroupSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { name: 'test' },
        meta: { source: 'button' },
      }),
    )
  })
})
