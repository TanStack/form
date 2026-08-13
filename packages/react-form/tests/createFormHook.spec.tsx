import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createFormHook } from '../src'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'

describe('createFormHook defaults', () => {
  it('uses default form options and lets usage options override them', () => {
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: {},
      defaultFormOptions: {
        formId: 'default-form-id',
      },
    })

    function DefaultForm() {
      const form = useAppForm({ defaultValues: { name: '' } })
      return <span data-testid="default">{form.formId}</span>
    }

    function OverriddenForm() {
      const form = useAppForm({
        defaultValues: { name: '' },
        formId: 'overridden-form-id',
      })
      return <span data-testid="overridden">{form.formId}</span>
    }

    function UndefinedForm() {
      const form = useAppForm({
        defaultValues: { name: '' },
        formId: undefined,
      })
      return <span data-testid="undefined">{form.formId}</span>
    }

    const { getByTestId } = render(
      <>
        <DefaultForm />
        <OverriddenForm />
        <UndefinedForm />
      </>,
    )

    expect(getByTestId('default')).toHaveTextContent('default-form-id')
    expect(getByTestId('overridden')).toHaveTextContent('overridden-form-id')
    expect(getByTestId('undefined')).not.toHaveTextContent('default-form-id')
    expect(getByTestId('undefined')).not.toBeEmptyDOMElement()
  })

  it('applies field defaults only to direct fields and array fields', () => {
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: {},
      defaultFieldOptions: {
        errorBoundary: true,
      },
    })

    const getErrorBoundary = (field: unknown) =>
      String((field as AnyInternalFieldApi)._errorBoundary)

    function Component() {
      const form = useAppForm({
        defaultValues: {
          direct: '',
          directArray: [''],
          overridden: '',
          undefinedOverride: '',
          group: {
            field: '',
            array: [''],
          },
        },
      })

      return (
        <>
          <form.Field name="direct">
            {(field) => (
              <span data-testid="direct">{getErrorBoundary(field)}</span>
            )}
          </form.Field>
          <form.ArrayField name="directArray">
            {(field) => (
              <span data-testid="direct-array">{getErrorBoundary(field)}</span>
            )}
          </form.ArrayField>
          <form.Field name="overridden" errorBoundary={false}>
            {(field) => (
              <span data-testid="overridden">{getErrorBoundary(field)}</span>
            )}
          </form.Field>
          <form.Field name="undefinedOverride" errorBoundary={undefined}>
            {(field) => (
              <span data-testid="undefined">{getErrorBoundary(field)}</span>
            )}
          </form.Field>
          <form.FormGroup name="group">
            {(group) => (
              <>
                <group.Field name="field">
                  {(field) => (
                    <span data-testid="group-field">
                      {getErrorBoundary(field)}
                    </span>
                  )}
                </group.Field>
                <group.ArrayField name="array">
                  {(field) => (
                    <span data-testid="group-array">
                      {getErrorBoundary(field)}
                    </span>
                  )}
                </group.ArrayField>
              </>
            )}
          </form.FormGroup>
        </>
      )
    }

    const { getByTestId } = render(<Component />)

    expect(getByTestId('direct')).toHaveTextContent('true')
    expect(getByTestId('direct-array')).toHaveTextContent('true')
    expect(getByTestId('overridden')).toHaveTextContent('false')
    expect(getByTestId('undefined')).toHaveTextContent('false')
    expect(getByTestId('group-field')).toHaveTextContent('false')
    expect(getByTestId('group-array')).toHaveTextContent('false')
  })

  it('uses default form group options and permits all override forms', async () => {
    const defaultOnSubmitInvalid = vi.fn()
    const overriddenOnSubmitInvalid = vi.fn()
    const defaultValidator = vi.fn(() => 'invalid')
    const overriddenValidator = vi.fn(() => 'invalid')
    const undefinedValidator = vi.fn(() => 'invalid')
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: {},
      defaultFormGroupOptions: {
        onSubmitInvalid: defaultOnSubmitInvalid,
      },
    })

    function Component() {
      const form = useAppForm({
        defaultValues: {
          defaultGroup: { name: '' },
          overriddenGroup: { name: '' },
          undefinedGroup: { name: '' },
        },
      })

      return (
        <>
          <form.FormGroup
            name="defaultGroup"
            validators={[{ triggers: [], run: defaultValidator }]}
          >
            {(group) => (
              <button
                data-testid="default"
                onClick={() => void group.handleSubmit()}
              />
            )}
          </form.FormGroup>
          <form.FormGroup
            name="overriddenGroup"
            validators={[{ triggers: [], run: overriddenValidator }]}
            onSubmitInvalid={overriddenOnSubmitInvalid}
          >
            {(group) => (
              <button
                data-testid="overridden"
                onClick={() => void group.handleSubmit()}
              />
            )}
          </form.FormGroup>
          <form.FormGroup
            name="undefinedGroup"
            validators={[{ triggers: [], run: undefinedValidator }]}
            onSubmitInvalid={undefined}
          >
            {(group) => (
              <button
                data-testid="undefined"
                onClick={() => void group.handleSubmit()}
              />
            )}
          </form.FormGroup>
        </>
      )
    }

    const { getByTestId } = render(<Component />)

    fireEvent.click(getByTestId('default'))
    await waitFor(() => expect(defaultOnSubmitInvalid).toHaveBeenCalledOnce())

    fireEvent.click(getByTestId('overridden'))
    await waitFor(() =>
      expect(overriddenOnSubmitInvalid).toHaveBeenCalledOnce(),
    )
    expect(defaultOnSubmitInvalid).toHaveBeenCalledOnce()

    fireEvent.click(getByTestId('undefined'))
    await waitFor(() => {
      expect(undefinedValidator).toHaveBeenCalledOnce()
      expect(defaultOnSubmitInvalid).toHaveBeenCalledOnce()
      expect(overriddenOnSubmitInvalid).toHaveBeenCalledOnce()
    })
  })
})
