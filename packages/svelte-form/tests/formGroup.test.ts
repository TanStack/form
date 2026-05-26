import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import FormGroupSubmit from './form-group/formGroupSubmit.svelte'
import FormGroupReactive from './form-group/formGroupReactive.svelte'
import FormGroupInvalid from './form-group/formGroupInvalid.svelte'
import FormGroupOuterErrors from './form-group/formGroupOuterErrors.svelte'
import FormGroupSubmitMeta from './form-group/formGroupSubmitMeta.svelte'
import FormGroupSubmitting from './form-group/formGroupSubmitting.svelte'

const user = userEvent.setup()

describe('form.FormGroup', () => {
  it('should call onGroupSubmit but not the form onSubmit when submitting the group', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()

    const { getByTestId } = render(FormGroupSubmit, { onSubmit, onGroupSubmit })

    await user.click(getByTestId('submit-group'))

    await vi.waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should expose group state value reactively', async () => {
    const { getByTestId } = render(FormGroupReactive)

    expect(getByTestId('group-value')).toHaveTextContent('{"name":"initial"}')

    const input = getByTestId('step1-name')
    await user.clear(input)
    await user.type(input, 'updated')

    await vi.waitFor(() =>
      expect(getByTestId('group-value')).toHaveTextContent(
        '{"name":"updated"}',
      ),
    )
  })

  it('should call onGroupSubmitInvalid when group-level validation fails', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    const { getByTestId } = render(FormGroupInvalid, {
      onSubmit,
      onGroupSubmit,
      onGroupSubmitInvalid,
    })

    await user.click(getByTestId('submit-group'))

    await vi.waitFor(() =>
      expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1),
    )
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    await vi.waitFor(() =>
      expect(getByTestId('group-error')).toHaveTextContent('Name is required'),
    )
  })

  it('should ignore form-level field errors outside the group when submitting the group', async () => {
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    const { getByTestId } = render(FormGroupOuterErrors, {
      onGroupSubmit,
      onGroupSubmitInvalid,
    })

    await user.click(getByTestId('submit-group'))

    await vi.waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onGroupSubmitInvalid).not.toHaveBeenCalled()
  })

  it('should pass submit meta through handleSubmit', async () => {
    const onGroupSubmit = vi.fn()

    const { getByTestId } = render(FormGroupSubmitMeta, { onGroupSubmit })

    await user.click(getByTestId('submit-group'))

    await vi.waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onGroupSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { name: 'test' },
        meta: { source: 'button' },
      }),
    )
  })

  it('should rerender group.state.meta.isSubmitting during an async submit', async () => {
    let resolveSubmit!: () => void
    const onGroupSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve
        }),
    )

    const { getByTestId } = render(FormGroupSubmitting, { onGroupSubmit })
    const button = getByTestId('submit-group') as HTMLButtonElement
    expect(button.textContent.trim()).toBe('Continue')
    expect(button.disabled).toBe(false)

    await user.click(button)

    await vi.waitFor(() => expect(button.textContent.trim()).toBe('Saving...'))
    expect(button.disabled).toBe(true)

    resolveSubmit()

    await vi.waitFor(() => expect(button.textContent.trim()).toBe('Continue'))
    expect(button.disabled).toBe(false)
    expect(onGroupSubmit).toHaveBeenCalledTimes(1)
  })
})
