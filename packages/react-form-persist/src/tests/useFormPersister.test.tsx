/// <reference lib="dom" />
import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { useForm } from '@tanstack/react-form'

import { FormPersisterProvider, PersisterAPI, useFormPersister } from '../index'
import type { SyncFormStorage } from '@tanstack/form-persist-core'

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

    function Comp() {
      const form = useForm<Person>({
        persister: useFormPersister({ formKey: 'Person' }),
      })
      form.options.persister!
      return (
        <form.Field
          name="firstName"
          defaultValue={''}
          children={(field) => {
            return (
              <input
                data-testid="fieldinput"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )
          }}
        />
      )
    }

    const renderPage = () =>
      render(
        <FormPersisterProvider value={new PersisterAPI({ storage })}>
          <Comp />
        </FormPersisterProvider>,
      )

    const firstRender = renderPage()
    let input = firstRender.getByTestId('fieldinput')
    expect(firstRender.queryByText('FirstName')).not.toBeInTheDocument()
    await userEvent.type(input, 'FirstName')
    expect(input).toHaveValue('FirstName')
    firstRender.unmount()

    const secondRender = renderPage()
    input = secondRender.getByTestId('fieldinput')
    waitFor(() => expect(input).toHaveValue('FirstName'))
  })
})
