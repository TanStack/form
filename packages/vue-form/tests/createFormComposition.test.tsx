import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { defineComponent, h } from 'vue'
import { createFormComposition, createFormCompositionContexts } from '../src'
import type { AnyFieldApi } from '@tanstack/form-core'

const { injectField, fieldProviderKey, formProviderKey, injectForm } =
  createFormCompositionContexts()

const TextField = defineComponent<{ label: string }>(
  ({ label }) => {
    const field = injectField<string>()
    return () => {
      return (
        <label>
          <div>{label}</div>
          <input
            value={field.state.value}
            onInput={(e) =>
              field.handleChange(
                (e as never as { target: HTMLInputElement }).target.value,
              )
            }
          />
        </label>
      )
    }
  },
  {
    props: ['label'],
  },
)

const SubscribeButton = defineComponent<{ label: string }>(({ label }) => {
  const form = injectForm()
  return () => {
    return (
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting: boolean) => (
          <button disabled={isSubmitting}>{label}</button>
        )}
      </form.Subscribe>
    )
  }
})

const { useAppForm } = createFormComposition({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldProviderKey,
  formProviderKey,
})

describe('createFormComposition', () => {
  it('should allow to set default value', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const Comp = defineComponent(() => {
      const form = useAppForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
      })

      return () => (
        <form.AppField name="firstName">
          {({ field }: { field: AnyFieldApi & Record<'TextField', any> }) => (
            <field.TextField label="Testing" />
          )}
        </form.AppField>
      )
    })

    const { getByLabelText } = render(<Comp />)
    const input = getByLabelText('Testing')
    expect(input).toHaveValue('FirstName')
  })
})
