import { createRenderEffect, createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { describe, expect, it, vi } from 'vitest'
import {
  createForm,
  createFormHook,
  defineFieldGroup,
  getFormHookHelpers,
  useSelector,
} from '../src'
import type { Accessor, JSX } from 'solid-js'
import type { FieldWithValue } from '../src'

function mount(Component: () => JSX.Element) {
  const container = document.createElement('div')
  document.body.append(container)
  const disposeRoot = render(Component, container)
  return {
    container,
    dispose: () => {
      disposeRoot()
      container.remove()
    },
  }
}

describe('Solid adapter parity', () => {
  it('prefixes form group fields and keeps group state reactive', () => {
    let change!: (value: string) => void

    function Component() {
      const form = createForm(() => ({
        defaultValues: { guest: { name: 'Tony' } },
      }))

      return (
        <form.FormGroup name="guest">
          {(group) => (
            <>
              <group.Field name="name">
                {(field) => {
                  change = field().handleChange
                  return (
                    <span data-testid="field">
                      {field().name}:{field().value}
                    </span>
                  )
                }}
              </group.Field>
              <span data-testid="group-value">{group().state.values.name}</span>
            </>
          )}
        </form.FormGroup>
      )
    }

    const { container, dispose } = mount(() => <Component />)
    expect(container.querySelector('[data-testid="field"]')?.textContent).toBe(
      'guest.name:Tony',
    )

    change('Rodney')

    expect(
      container.querySelector('[data-testid="group-value"]')?.textContent,
    ).toBe('Rodney')
    dispose()
  })

  it('prefixes watched field names in form group listeners', () => {
    const listener = vi.fn()
    let change!: (value: string) => void

    function Component() {
      const form = createForm(() => ({
        defaultValues: { guest: { name: '', confirmation: '' } },
      }))

      return (
        <form.FormGroup name="guest">
          {(group) => (
            <>
              <group.Field name="name">
                {(field) => {
                  change = field().handleChange
                  return null
                }}
              </group.Field>
              <group.Field
                name="confirmation"
                listeners={[
                  {
                    triggers: ['change'],
                    watchFields: ['name'],
                    run: listener,
                  },
                ]}
              >
                {() => null}
              </group.Field>
            </>
          )}
        </form.FormGroup>
      )
    }

    const { dispose } = mount(() => <Component />)
    change('A')
    expect(listener).toHaveBeenCalledOnce()
    dispose()
  })

  it('reactively updates form group field names', () => {
    let showLastName!: () => void

    function Component() {
      const [fieldName, setFieldName] = createSignal<'firstName' | 'lastName'>(
        'firstName',
      )
      showLastName = () => setFieldName('lastName')
      const form = createForm(() => ({
        defaultValues: {
          guest: { firstName: 'Tony', lastName: 'Hawk' },
        },
      }))

      return (
        <form.FormGroup name="guest">
          {(group) => (
            <group.Field name={fieldName()}>
              {(field) => (
                <span data-testid="group-field">
                  {field().name}:{field().value}
                </span>
              )}
            </group.Field>
          )}
        </form.FormGroup>
      )
    }

    const { container, dispose } = mount(() => <Component />)
    expect(
      container.querySelector('[data-testid="group-field"]')?.textContent,
    ).toBe('guest.firstName:Tony')

    showLastName()

    expect(
      container.querySelector('[data-testid="group-field"]')?.textContent,
    ).toBe('guest.lastName:Hawk')
    dispose()
  })

  it('reactively updates form group field listeners', () => {
    const firstListener = vi.fn()
    const secondListener = vi.fn()
    let useSecondListener!: () => void
    let change!: (value: string) => void

    function Component() {
      const [usesSecondListener, setUsesSecondListener] = createSignal(false)
      useSecondListener = () => setUsesSecondListener(true)
      const form = createForm(() => ({
        defaultValues: { guest: { name: '' } },
      }))

      return (
        <form.FormGroup name="guest">
          {(group) => (
            <group.Field
              name="name"
              listeners={[
                {
                  triggers: ['change'],
                  run: usesSecondListener() ? secondListener : firstListener,
                },
              ]}
            >
              {(field) => {
                change = field().handleChange
                return null
              }}
            </group.Field>
          )}
        </form.FormGroup>
      )
    }

    const { dispose } = mount(() => <Component />)
    change('First')
    expect(firstListener).toHaveBeenCalledOnce()

    useSecondListener()
    change('Second')

    expect(firstListener).toHaveBeenCalledOnce()
    expect(secondListener).toHaveBeenCalledOnce()
    dispose()
  })

  it('supports app field components through Solid context', () => {
    function TextField(props: {
      field: Accessor<FieldWithValue<string>>
      label: string
    }) {
      return (
        <span data-testid="app-field">
          {props.label}:{props.field().name}:{props.field().value}
        </span>
      )
    }

    const { fieldComponent } = getFormHookHelpers()
    const AppTextField = fieldComponent.strict(TextField, 'field')
    const { useAppForm } = createFormHook({
      fieldComponents: { AppTextField },
      formComponents: {},
    })

    function Component() {
      const form = useAppForm(() => ({
        defaultValues: { guest: { name: 'Tony' } },
      }))
      return (
        <form.AppForm>
          <form.FormGroup name="guest">
            {(group) => (
              <group.Field name="name">
                {(field) => <field.AppTextField label="Name" />}
              </group.Field>
            )}
          </form.FormGroup>
        </form.AppForm>
      )
    }

    const { container, dispose } = mount(() => <Component />)
    expect(
      container.querySelector('[data-testid="app-field"]')?.textContent,
    ).toBe('Name:guest.name:Tony')
    dispose()
  })

  it('provides app form components with their form context', () => {
    function Summary() {
      const form = useFormContext()
      return (
        <form.Subscribe selector={(state) => state.values.name}>
          {(name) => <span data-testid="summary">{name()}</span>}
        </form.Subscribe>
      )
    }

    const { useAppForm, useFormContext } = createFormHook({
      fieldComponents: {},
      formComponents: { Summary },
    })

    function Component() {
      const form = useAppForm(() => ({ defaultValues: { name: 'Tony' } }))
      return (
        <form.AppForm>
          <form.Summary />
        </form.AppForm>
      )
    }

    const { container, dispose } = mount(() => <Component />)
    expect(
      container.querySelector('[data-testid="summary"]')?.textContent,
    ).toBe('Tony')
    dispose()
  })

  it('reactively applies Subscribe when predicates', () => {
    let setVisible!: (value: boolean) => void

    function Component() {
      const form = createForm(() => ({
        defaultValues: { visible: false },
      }))
      setVisible = (value) => form.setFieldValue('visible', value)

      return (
        <form.Subscribe
          selector={(state) => state.values.visible}
          when={(visible) => visible}
        >
          {() => <span data-testid="visible">Visible</span>}
        </form.Subscribe>
      )
    }

    const { container, dispose } = mount(() => <Component />)
    expect(container.querySelector('[data-testid="visible"]')).toBeNull()
    setVisible(true)
    expect(container.querySelector('[data-testid="visible"]')).not.toBeNull()
    dispose()
  })

  it('updates options without replacing or re-registering a field', () => {
    const onMount = vi.fn()
    const onUnmount = vi.fn()
    let update!: () => void

    function Component() {
      const [count, setCount] = createSignal(0)
      update = () => setCount((value) => value + 1)
      const form = createForm(() => ({ defaultValues: { name: 'Tony' } }))

      return (
        <>
          <span>{count()}</span>
          <form.Field
            name="name"
            listeners={[
              { triggers: ['mount'], run: onMount },
              { triggers: ['unmount'], run: onUnmount },
            ]}
          >
            {(field) => <span>{field().value}</span>}
          </form.Field>
        </>
      )
    }

    const { dispose } = mount(() => <Component />)
    const initialMounts = onMount.mock.calls.length
    const initialUnmounts = onUnmount.mock.calls.length
    update()
    expect(onMount).toHaveBeenCalledTimes(initialMounts)
    expect(onUnmount).toHaveBeenCalledTimes(initialUnmounts)
    dispose()
    expect(onMount.mock.calls.length - onUnmount.mock.calls.length).toBe(0)
  })

  it('only invalidates ArrayField accessors for structural array changes', () => {
    let changeChild!: (value: string) => void
    let pushItem!: () => void
    let arrayAccessorRuns = 0

    function Component() {
      const form = createForm(() => ({
        defaultValues: { people: [{ name: 'Tony' }] },
      }))
      pushItem = () => form.pushFieldValue('people', { name: 'Rodney' })

      return (
        <>
          <form.ArrayField name="people">
            {(field) => {
              createRenderEffect(() => {
                field()
                arrayAccessorRuns++
              })
              return <span>{field().value.length}</span>
            }}
          </form.ArrayField>
          <form.Field name="people[0].name">
            {(field) => {
              changeChild = field().handleChange
              return null
            }}
          </form.Field>
        </>
      )
    }

    const { dispose } = mount(() => <Component />)
    const initialRuns = arrayAccessorRuns
    changeChild('Updated')
    expect(arrayAccessorRuns).toBe(initialRuns)
    pushItem()
    expect(arrayAccessorRuns).toBe(initialRuns + 1)
    dispose()
  })

  it('rebinds mounted fields after a form reset', () => {
    let reset!: () => void

    function Component() {
      const form = createForm(() => ({ defaultValues: { name: 'Tony' } }))
      reset = () => form.reset({ name: 'Rodney' })
      return (
        <form.Field name="name">
          {(field) => <span data-testid="reset-value">{field().value}</span>}
        </form.Field>
      )
    }

    const { container, dispose } = mount(() => <Component />)
    reset()
    expect(
      container.querySelector('[data-testid="reset-value"]')?.textContent,
    ).toBe('Rodney')
    dispose()
  })
})

const nameFieldGroup = defineFieldGroup(({ strict }) => ({
  name: strict<string>(),
}))

function NameFieldsImpl(props: { fields: typeof nameFieldGroup.fields }) {
  const values = useSelector(props.fields.atom)
  return (
    <>
      <props.fields.Field name="name">
        {(field) => (
          <span data-testid="logical-field">
            {field().name}:{field().value}
          </span>
        )}
      </props.fields.Field>
      <span data-testid="logical-value">{values().name}</span>
      <button
        type="button"
        onClick={() => props.fields.setFieldValue('name', 'Updated')}
      >
        Update
      </button>
    </>
  )
}

const NameFields = nameFieldGroup.bindComponent(NameFieldsImpl, 'fields')

describe('Solid reusable field groups', () => {
  it('defaults omitted bindings to same-named form fields', () => {
    function Component() {
      const form = createForm(() => ({
        defaultValues: { name: 'Initial' },
      }))
      return <NameFields form={form} />
    }

    const { container, dispose } = mount(() => <Component />)
    expect(
      container.querySelector('[data-testid="logical-field"]')?.textContent,
    ).toBe('name:Initial')

    container.querySelector('button')?.click()

    expect(
      container.querySelector('[data-testid="logical-value"]')?.textContent,
    ).toBe('Updated')
    dispose()
  })

  it('maps logical names and forwards methods and atoms', () => {
    function Component() {
      const form = createForm(() => ({
        defaultValues: { profile: { name: 'Initial' } },
      }))
      return <NameFields form={form} fields={{ name: 'profile.name' }} />
    }

    const { container, dispose } = mount(() => <Component />)
    expect(
      container.querySelector('[data-testid="logical-field"]')?.textContent,
    ).toBe('profile.name:Initial')

    container.querySelector('button')?.click()

    expect(
      container.querySelector('[data-testid="logical-value"]')?.textContent,
    ).toBe('Updated')
    dispose()
  })

  it('reactively updates logical field bindings', () => {
    let showSecond!: () => void

    function Component() {
      const [binding, setBinding] = createSignal<'first' | 'second'>('first')
      showSecond = () => setBinding('second')
      const form = createForm(() => ({
        defaultValues: { first: 'One', second: 'Two' },
      }))
      return <NameFields form={form} fields={{ name: binding() }} />
    }

    const { container, dispose } = mount(() => <Component />)
    showSecond()
    expect(
      container.querySelector('[data-testid="logical-field"]')?.textContent,
    ).toBe('second:Two')
    dispose()
  })
})
