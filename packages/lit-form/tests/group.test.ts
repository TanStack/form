/// <reference lib="dom" />
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { LitElement, html } from 'lit'
import { TanStackFormController } from '../src/index.js'
import { defineOnce, mount } from './utils'

const user = userEvent.setup()

interface TestData {
  step1: { name: string }
  step2: { name: string }
}

describe('form.group directive', () => {
  it('should call onGroupSubmit but not the form onSubmit when submitting the group', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()

    class TestEl extends LitElement {
      form = new TanStackFormController(this, {
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        } as TestData,
        onSubmit,
      })

      render() {
        return html`${this.form.group(
          { name: 'step1', onGroupSubmit },
          (group) => html`
            <form
              @submit=${(e: Event) => {
                e.preventDefault()
                e.stopPropagation()
                group.handleSubmit()
              }}
            >
              ${this.form.field(
                { name: 'step1.name' },
                (field) => html`
                  <input
                    id="step1-name"
                    .value=${field.state.value}
                    @input=${(e: Event) =>
                      field.handleChange((e.target as HTMLInputElement).value)}
                  />
                `,
              )}
              <button type="submit" id="submit-group">Submit Group</button>
            </form>
          `,
        )}`
      }
    }

    defineOnce('group-test-1', TestEl)
    const el = await mount<TestEl>('group-test-1')

    const button =
      el.shadowRoot!.querySelector<HTMLButtonElement>('#submit-group')!
    await user.click(button)

    await vi.waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should expose group state value reactively', async () => {
    class TestEl extends LitElement {
      form = new TanStackFormController(this, {
        defaultValues: {
          step1: { name: 'initial' },
          step2: { name: 'other' },
        } as TestData,
      })

      render() {
        return html`${this.form.group(
          { name: 'step1' },
          (group) => html`
            ${this.form.field(
              { name: 'step1.name' },
              (field) => html`
                <input
                  id="step1-name"
                  .value=${field.state.value}
                  @input=${(e: Event) =>
                    field.handleChange((e.target as HTMLInputElement).value)}
                />
              `,
            )}
            <pre id="group-value">${JSON.stringify(group.state.value)}</pre>
          `,
        )}`
      }
    }

    defineOnce('group-test-2', TestEl)
    const el = await mount<TestEl>('group-test-2')

    const valueEl = () =>
      el.shadowRoot!.querySelector<HTMLPreElement>('#group-value')!
    expect(valueEl().textContent).toBe('{"name":"initial"}')

    const input = el.shadowRoot!.querySelector<HTMLInputElement>('#step1-name')!
    input.focus()
    input.value = 'updated'
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }))

    await vi.waitFor(() =>
      expect(valueEl().textContent).toBe('{"name":"updated"}'),
    )
  })

  it('should call onGroupSubmitInvalid when group-level validation fails', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    class TestEl extends LitElement {
      form = new TanStackFormController(this, {
        defaultValues: {
          step1: { name: '' },
          step2: { name: 'test2' },
        } as TestData,
        onSubmit,
      })

      render() {
        return html`${this.form.group(
          {
            name: 'step1',
            validators: {
              onSubmit: ({ value }) =>
                !value.name ? 'Name is required' : undefined,
            },
            onGroupSubmit,
            onGroupSubmitInvalid,
          },
          (group) => html`
            <form
              @submit=${(e: Event) => {
                e.preventDefault()
                e.stopPropagation()
                group.handleSubmit()
              }}
            >
              ${this.form.field(
                { name: 'step1.name' },
                (field) => html`
                  <input
                    id="step1-name"
                    .value=${field.state.value}
                    @input=${(e: Event) =>
                      field.handleChange((e.target as HTMLInputElement).value)}
                  />
                `,
              )}
              <button type="submit" id="submit-group">Submit Group</button>
              <pre id="group-error">
${String(group.state.meta.errorMap.onSubmit ?? '')}</pre
              >
            </form>
          `,
        )}`
      }
    }

    defineOnce('group-test-3', TestEl)
    const el = await mount<TestEl>('group-test-3')

    await user.click(
      el.shadowRoot!.querySelector<HTMLButtonElement>('#submit-group')!,
    )

    await vi.waitFor(() =>
      expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1),
    )
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    await vi.waitFor(() =>
      expect(
        el.shadowRoot!.querySelector('#group-error')!.textContent!.trim(),
      ).toBe('Name is required'),
    )
  })

  it('should ignore form-level field errors outside the group when submitting the group', async () => {
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    class TestEl extends LitElement {
      form = new TanStackFormController(this, {
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        } as TestData,
        validators: {
          onSubmit: () => ({
            fields: {
              'step2.name': 'Required',
            },
          }),
        },
      })

      render() {
        return html`${this.form.group(
          { name: 'step1', onGroupSubmit, onGroupSubmitInvalid },
          (group) => html`
            <form
              @submit=${(e: Event) => {
                e.preventDefault()
                e.stopPropagation()
                group.handleSubmit()
              }}
            >
              ${this.form.field(
                { name: 'step1.name' },
                (field) => html`
                  <input
                    id="step1-name"
                    .value=${field.state.value}
                    @input=${(e: Event) =>
                      field.handleChange((e.target as HTMLInputElement).value)}
                  />
                `,
              )}
              <button type="submit" id="submit-group">Submit Group</button>
            </form>
          `,
        )}`
      }
    }

    defineOnce('group-test-4', TestEl)
    const el = await mount<TestEl>('group-test-4')

    await user.click(
      el.shadowRoot!.querySelector<HTMLButtonElement>('#submit-group')!,
    )

    await vi.waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onGroupSubmitInvalid).not.toHaveBeenCalled()
  })

  it('should pass submit meta through handleSubmit', async () => {
    const onGroupSubmit = vi.fn()

    class TestEl extends LitElement {
      form = new TanStackFormController(this, {
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        } as TestData,
      })

      render() {
        return html`${this.form.group(
          {
            name: 'step1',
            onGroupSubmit,
            onSubmitMeta: {} as { source: string },
          },
          (group) => html`
            <button
              type="button"
              id="submit-group"
              @click=${() => group.handleSubmit({ source: 'button' })}
            >
              Submit Group
            </button>
          `,
        )}`
      }
    }

    defineOnce('group-test-5', TestEl)
    const el = await mount<TestEl>('group-test-5')

    await user.click(
      el.shadowRoot!.querySelector<HTMLButtonElement>('#submit-group')!,
    )

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

    class TestEl extends LitElement {
      form = new TanStackFormController(this, {
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        } as TestData,
      })

      render() {
        return html`${this.form.group(
          { name: 'step1', onGroupSubmit },
          (group) => html`
            <form
              @submit=${(e: Event) => {
                e.preventDefault()
                e.stopPropagation()
                void group.handleSubmit()
              }}
            >
              <button
                type="submit"
                id="submit-group"
                ?disabled=${group.state.meta.isSubmitting}
              >
                ${group.state.meta.isSubmitting ? 'Saving...' : 'Continue'}
              </button>
            </form>
          `,
        )}`
      }
    }

    defineOnce('group-test-6', TestEl)
    const el = await mount<TestEl>('group-test-6')

    const button = () =>
      el.shadowRoot!.querySelector<HTMLButtonElement>('#submit-group')!

    expect(button().textContent!.trim()).toBe('Continue')
    expect(button().disabled).toBe(false)

    await user.click(button())

    await vi.waitFor(() =>
      expect(button().textContent!.trim()).toBe('Saving...'),
    )
    expect(button().disabled).toBe(true)

    resolveSubmit()

    await vi.waitFor(() =>
      expect(button().textContent!.trim()).toBe('Continue'),
    )
    expect(button().disabled).toBe(false)
    expect(onGroupSubmit).toHaveBeenCalledTimes(1)
  })
})
