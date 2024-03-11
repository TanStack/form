import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { cleanup, render, waitFor } from '@testing-library/vue'
import { userEvent } from '@testing-library/user-event'
import { provideFormContext, useForm } from '@tanstack/vue-form'

import { PersisterAPI, provideFormPersisterContext, useFormPersister } from '..'
import type { FieldApi } from '@tanstack/vue-form'
import type { SyncFormStorage } from '@tanstack/form-persist-core'

const user = userEvent.setup()

const storageMap = new Map<string, any>()
const storage: SyncFormStorage = {
  getItem(key) {
    return storageMap.get(key)
  },
  setItem(key, value) {
    return storageMap.set(key, value)
  },
  removeItem(key) {
    storageMap.delete(key)
  },
}

describe('useForm', () => {
  it('value should be persisted after re-mount', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const FieldComp = defineComponent(() => {
      const form = useForm<Person>({
        persister: useFormPersister({ formKey: 'Person' }),
      })

      provideFormContext({ formApi: form })

      return () => (
        <form.Field name="firstName" defaultValue={''}>
          {({
            field,
          }: {
            field: FieldApi<Person, 'firstName', never, never>
          }) => {
            return (
              <input
                data-testid="fieldinput"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange((e.target as HTMLInputElement).value)
                }
              />
            )
          }}
        </form.Field>
      )
    })

    const Comp = defineComponent(() => {
      provideFormPersisterContext(new PersisterAPI({ storage }))
      return () => <FieldComp />
    })

    const renderPage = () => render(Comp)

    const firstRender = renderPage()
    let input = firstRender.getByTestId('fieldinput')
    expect(firstRender.queryByText('FirstName')).not.toBeInTheDocument()
    await userEvent.type(input, 'FirstName')
    expect(input).toHaveValue('FirstName')
    cleanup() // additional cleanup since we are re-mounting
    firstRender.unmount()

    const secondRender = renderPage()
    input = secondRender.getByTestId('fieldinput')
    waitFor(() => expect(input).toHaveValue('FirstName'))
  })
})
