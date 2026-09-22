import React from 'react'
import { render } from 'vitest-browser-react'
import { describe, expect, it, vi } from 'vitest'
import { createFormHook, getFormHookHelpers } from '../src'
import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
} from '@tanstack/form-core/internals'
import type { FieldWithValue } from '../src'

describe('createFormHook', () => {
  it('provides registered components to fields created during mount validation', async () => {
    const SharedComponent = () => <span>Shared field component</span>
    const { useAppForm } = createFormHook({
      fieldComponents: { SharedComponent },
      formComponents: {},
    })

    function Component() {
      const form = useAppForm({
        defaultValues: { name: '' },
        validators: [
          {
            runOnMount: true,
            triggers: [],
            run: () => ({ fields: { name: 'Name is required' } }),
          },
        ],
      })

      return (
        <form.Field name="name">
          {(field) => {
            const { SharedComponent: DestructuredComponent } = field
            return <DestructuredComponent />
          }}
        </form.Field>
      )
    }

    const { getByText } = await render(<Component />)

    expect(getByText('Shared field component')).toBeInTheDocument()
  })

  it('supports nested field and form component trees', async () => {
    function FieldValue({ field }: { field: FieldWithValue<string> }) {
      return <span>Field value: {field.value}</span>
    }

    function FormHeading() {
      return <h1>Nested form component</h1>
    }

    const { fieldComponent } = getFormHookHelpers()
    const FieldValueWithContext = fieldComponent.strict(FieldValue, 'field')
    const { useAppForm } = createFormHook({
      fieldComponents: {
        display: {
          values: {
            FieldValue: FieldValueWithContext,
          },
        },
      },
      formComponents: {
        layout: {
          headings: {
            FormHeading,
          },
        },
      },
    })

    function Component() {
      const form = useAppForm({ defaultValues: { name: 'Tony' } })

      return (
        <form.AppForm>
          <form.layout.headings.FormHeading />
          <form.Field name="name">
            {(field) => <field.display.values.FieldValue />}
          </form.Field>
        </form.AppForm>
      )
    }

    const { getByText } = await render(<Component />)

    expect(getByText('Nested form component')).toBeInTheDocument()
    expect(getByText('Field value: Tony')).toBeInTheDocument()
  })

  it('supports destructuring registered form components', async () => {
    const SharedComponent = () => <span>Shared component</span>
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: { SharedComponent },
    })

    /* eslint-disable @eslint-react/static-components -- False positive, component's created once */
    function Component() {
      const form = useAppForm({ defaultValues: { name: '' } })
      const { SharedComponent: DestructuredComponent } = form

      return <DestructuredComponent />
    }
    /* eslint-enable @eslint-react/static-components */

    const { getByText } = await render(<Component />)

    expect(getByText('Shared component')).toBeInTheDocument()
  })

  it('renders inherited form components with per-instance AppForm context', async () => {
    function CurrentName() {
      const form = useFormContext()
      return <span data-testid="current-name">{form.state.values.name}</span>
    }

    const { useAppForm, useFormContext } = createFormHook({
      fieldComponents: {},
      formComponents: { CurrentName },
    })

    function Component() {
      const form = useAppForm({ defaultValues: { name: 'Tony' } })

      return (
        <form.AppForm>
          <form.CurrentName />
        </form.AppForm>
      )
    }

    const { getByTestId } = await render(<Component />)

    expect(getByTestId('current-name')).toHaveTextContent('Tony')
  })

  it('uses default form options and lets usage options override them', async () => {
    const defaultErrorVisibility = () => true
    const overriddenErrorVisibility = () => false
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: {},
      defaultFormOptions: {
        errorVisibility: defaultErrorVisibility,
      },
    })

    const getErrorVisibility = (form: unknown) =>
      (form as AnyInternalFormApi)._options.errorVisibility

    function DefaultForm() {
      const form = useAppForm({ defaultValues: { name: '' } })
      return (
        <span data-testid="default">
          {String(getErrorVisibility(form) === defaultErrorVisibility)}
        </span>
      )
    }

    function OverriddenForm() {
      const form = useAppForm({
        defaultValues: { name: '' },
        errorVisibility: overriddenErrorVisibility,
      })
      return (
        <span data-testid="overridden">
          {String(getErrorVisibility(form) === overriddenErrorVisibility)}
        </span>
      )
    }

    function UndefinedForm() {
      const form = useAppForm({
        defaultValues: { name: '' },
        errorVisibility: undefined,
      })
      return (
        <span data-testid="undefined">
          {String(getErrorVisibility(form) === undefined)}
        </span>
      )
    }

    const { getByTestId } = await render(
      <>
        <DefaultForm />
        <OverriddenForm />
        <UndefinedForm />
      </>,
    )

    expect(getByTestId('default')).toHaveTextContent('true')
    expect(getByTestId('overridden')).toHaveTextContent('true')
    expect(getByTestId('undefined')).toHaveTextContent('true')
  })

  it('resolves form and field listener merge modes in core', async () => {
    const formCalls: Array<string> = []
    const fieldCalls: Array<string> = []
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: {},
      defaultFormOptions: {
        listenersMerge: 'append',
        listeners: [
          {
            triggers: ['change'],
            run: () => formCalls.push('default'),
          },
        ],
      },
      defaultFieldOptions: {
        listenersMerge: 'prepend',
        listeners: [
          {
            triggers: ['change'],
            run: () => fieldCalls.push('default'),
          },
        ],
      },
    })

    function Component() {
      const form = useAppForm({
        defaultValues: { name: '' },
        listeners: [
          {
            triggers: ['change'],
            run: () => formCalls.push('local'),
          },
        ],
      })

      return (
        <form.Field
          name="name"
          listeners={[
            {
              triggers: ['change'],
              run: () => fieldCalls.push('local'),
            },
          ]}
        >
          {(field) => (
            <input
              aria-label="Name"
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )}
        </form.Field>
      )
    }

    const { getByRole } = await render(<Component />)
    await getByRole('textbox', { name: 'Name' }).fill('updated')

    expect(formCalls).toEqual(['default', 'local'])
    expect(fieldCalls).toEqual(['local', 'default'])
  })

  it('applies field defaults to direct and grouped fields', async () => {
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

    const { getByTestId } = await render(<Component />)

    expect(getByTestId('direct')).toHaveTextContent('true')
    expect(getByTestId('direct-array')).toHaveTextContent('true')
    expect(getByTestId('overridden')).toHaveTextContent('false')
    expect(getByTestId('undefined')).toHaveTextContent('false')
    expect(getByTestId('group-field')).toHaveTextContent('true')
    expect(getByTestId('group-array')).toHaveTextContent('true')
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
              <button onClick={() => void group.handleSubmit()}>
                Submit default group
              </button>
            )}
          </form.FormGroup>
          <form.FormGroup
            name="overriddenGroup"
            validators={[{ triggers: [], run: overriddenValidator }]}
            onSubmitInvalid={overriddenOnSubmitInvalid}
          >
            {(group) => (
              <button onClick={() => void group.handleSubmit()}>
                Submit overridden group
              </button>
            )}
          </form.FormGroup>
          <form.FormGroup
            name="undefinedGroup"
            validators={[{ triggers: [], run: undefinedValidator }]}
            onSubmitInvalid={undefined}
          >
            {(group) => (
              <button onClick={() => void group.handleSubmit()}>
                Submit undefined group
              </button>
            )}
          </form.FormGroup>
        </>
      )
    }

    const { getByRole } = await render(<Component />)

    await getByRole('button', { name: 'Submit default group' }).click()
    await vi.waitFor(() =>
      expect(defaultOnSubmitInvalid).toHaveBeenCalledOnce(),
    )

    await getByRole('button', { name: 'Submit overridden group' }).click()
    await vi.waitFor(() =>
      expect(overriddenOnSubmitInvalid).toHaveBeenCalledOnce(),
    )
    expect(defaultOnSubmitInvalid).toHaveBeenCalledOnce()

    await getByRole('button', { name: 'Submit undefined group' }).click()
    await vi.waitFor(() => {
      expect(undefinedValidator).toHaveBeenCalledOnce()
      expect(defaultOnSubmitInvalid).toHaveBeenCalledOnce()
      expect(overriddenOnSubmitInvalid).toHaveBeenCalledOnce()
    })
  })
})
