import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import {
  Fragment,
  createSSRApp,
  defineComponent,
  h,
  nextTick,
  reactive,
  ref,
} from 'vue'
import { renderToString } from 'vue/server-renderer'
import {
  createFormHook,
  defineFieldGroup,
  getFormHookHelpers,
  useForm,
} from '../src'
import type { AnyFieldApi, FieldWithValue } from '../src'

describe('Vue adapter parity', () => {
  it('creates a mounted form with a stable generated form id', async () => {
    let formId = ''

    const Component = defineComponent(() => {
      const form = useForm({ defaultValues: { name: 'Tony' } })
      formId = form.formId
      return () => <output data-testid="name">{form.state.values.name}</output>
    })

    const view = render(Component)
    expect(formId).toBeTypeOf('string')
    expect(formId.length).toBeGreaterThan(0)
    expect(view.getByTestId('name')).toHaveTextContent('Tony')
    const initialFormId = formId
    await view.rerender({})
    expect(formId).toBe(initialFormId)
  })

  it('generates an SSR-safe default form id', async () => {
    const Component = defineComponent(() => {
      const form = useForm({ defaultValues: { name: '' } })
      return () => <form id={form.formId} />
    })
    const container = document.createElement('div')
    container.innerHTML = await renderToString(createSSRApp(Component))
    const serverId = container.querySelector('form')?.id
    const errors: Array<string> = []
    const spy = vi
      .spyOn(console, 'error')
      .mockImplementation((...args) => void errors.push(args.join(' ')))

    const app = createSSRApp(Component)
    app.mount(container)
    await nextTick()
    spy.mockRestore()

    expect(serverId).toBeTruthy()
    expect(container.querySelector('form')?.id).toBe(serverId)
    expect(errors.filter((error) => /hydration/i.test(error))).toEqual([])
    app.unmount()
  })

  it('updates reactive form options without replacing touched values', async () => {
    const options = reactive({
      defaultValues: { name: 'Tony', age: 1 },
    })
    let form!: any

    const Component = defineComponent(() => {
      form = useForm(options)
      return () => (
        <form.Subscribe
          selector={(state: { values: { name: string; age: number } }) =>
            state.values
          }
        >
          {(values: { name: string; age: number }) => (
            <output>
              {values.name}:{values.age}
            </output>
          )}
        </form.Subscribe>
      )
    })

    const view = render(Component)
    form.setFieldValue('name', 'Rodney')
    options.defaultValues = { name: 'Bob', age: 2 }

    await waitFor(() => expect(view.getByText('Rodney:2')).toBeInTheDocument())
  })

  it('renders fields reactively with the v2 field shape', async () => {
    const Component = defineComponent(() => {
      const form = useForm({ defaultValues: { name: 'Tony' } })
      return () => (
        <form.Field name="name">
          {({ field }: { field: AnyFieldApi }) => (
            <label>
              Name
              <input
                aria-label="Name"
                value={field.value}
                onInput={(event) =>
                  field.handleChange((event.target as HTMLInputElement).value)
                }
              />
              <output data-testid="value">{field.value}</output>
            </label>
          )}
        </form.Field>
      )
    })

    const view = render(Component)
    await fireEvent.update(view.getByLabelText('Name'), 'Rodney')
    expect(view.getByTestId('value')).toHaveTextContent('Rodney')
  })

  it('uses validator arrays and rerenders selected form state', async () => {
    const Component = defineComponent(() => {
      const form = useForm({
        defaultValues: { name: '' },
        validators: [
          {
            runOnMount: true,
            triggers: [],
            run: () => 'Name is required',
          },
        ],
      })

      return () => (
        <form.Subscribe
          selector={(state) => ({
            errors: state.errors,
            canSubmit: state.canSubmit,
          })}
        >
          {(state: {
            errors: Array<{ message: string }>
            canSubmit: boolean
          }) => (
            <output role="alert">
              {state.errors.map((error) => error.message).join(',')}|
              {String(state.canSubmit)}
            </output>
          )}
        </form.Subscribe>
      )
    })

    const view = render(Component)
    expect(view.getByRole('alert')).toHaveTextContent('Name is required|false')
  })

  it('only rerenders ArrayField slots for structural array changes', async () => {
    let rename!: () => void
    let push!: () => void
    let renders = 0
    const Component = defineComponent(() => {
      const form = useForm({
        defaultValues: { people: [{ name: 'Tony' }] },
      })
      rename = () => form.setFieldValue('people[0].name', 'Rodney')
      push = () => form.pushFieldValue('people', { name: 'Bob' })
      return () => (
        <form.ArrayField name="people">
          {({ field }: { field: AnyFieldApi }) => {
            renders++
            return <output data-testid="length">{field.value.length}</output>
          }}
        </form.ArrayField>
      )
    })

    const view = render(Component)
    const initialRenders = renders
    rename()
    await Promise.resolve()
    expect(renders).toBe(initialRenders)

    push()
    await waitFor(() =>
      expect(view.getByTestId('length')).toHaveTextContent('2'),
    )
    expect(renders).toBeGreaterThan(initialRenders)
  })

  it('prefixes FormGroup fields and keeps group state reactive', async () => {
    const Component = defineComponent(() => {
      const form = useForm({
        defaultValues: { guest: { name: 'Tony' } },
      })
      return () => (
        <form.FormGroup name="guest">
          {({ group }: { group: any }) => (
            <>
              <group.Field name="name">
                {({ field }: { field: AnyFieldApi }) => (
                  <input
                    aria-label="Guest name"
                    value={field.value}
                    onInput={(event) =>
                      field.handleChange(
                        (event.target as HTMLInputElement).value,
                      )
                    }
                  />
                )}
              </group.Field>
              <output data-testid="group-name">
                {group.state.values.name}
              </output>
            </>
          )}
        </form.FormGroup>
      )
    })

    const view = render(Component)
    await fireEvent.update(view.getByLabelText('Guest name'), 'Rodney')
    expect(view.getByTestId('group-name')).toHaveTextContent('Rodney')
  })

  it('reactively updates FormGroup field names', async () => {
    let showLastName!: () => void

    const Component = defineComponent(() => {
      const fieldName = ref<'firstName' | 'lastName'>('firstName')
      showLastName = () => {
        fieldName.value = 'lastName'
      }
      const form = useForm({
        defaultValues: {
          guest: { firstName: 'Tony', lastName: 'Hawk' },
        },
      })

      return () => (
        <form.FormGroup name="guest">
          {({ group }: { group: any }) => (
            <group.Field name={fieldName.value}>
              {({ field }: { field: AnyFieldApi }) => (
                <output data-testid="group-field">
                  {field.name}:{field.value}
                </output>
              )}
            </group.Field>
          )}
        </form.FormGroup>
      )
    })

    const view = render(Component)
    expect(view.getByTestId('group-field')).toHaveTextContent(
      'guest.firstName:Tony',
    )

    showLastName()

    await waitFor(() =>
      expect(view.getByTestId('group-field')).toHaveTextContent(
        'guest.lastName:Hawk',
      ),
    )
  })

  it('reactively updates FormGroup field listeners', async () => {
    const firstListener = vi.fn()
    const secondListener = vi.fn()
    let useSecondListener!: () => void
    let change!: (value: string) => void

    const Component = defineComponent(() => {
      const usesSecondListener = ref(false)
      useSecondListener = () => {
        usesSecondListener.value = true
      }
      const form = useForm({
        defaultValues: { guest: { name: '' } },
      })

      return () => (
        <form.FormGroup name="guest">
          {({ group }: { group: any }) => (
            <group.Field
              name="name"
              listeners={[
                {
                  triggers: ['change'],
                  run: usesSecondListener.value
                    ? secondListener
                    : firstListener,
                },
              ]}
            >
              {({ field }: { field: AnyFieldApi }) => {
                change = field.handleChange
                return null
              }}
            </group.Field>
          )}
        </form.FormGroup>
      )
    })

    render(Component)
    change('First')
    expect(firstListener).toHaveBeenCalledOnce()

    useSecondListener()
    await nextTick()
    change('Second')

    expect(firstListener).toHaveBeenCalledOnce()
    expect(secondListener).toHaveBeenCalledOnce()
  })

  it('composes typed field components through Vue injection', () => {
    const TextField = defineComponent<{
      field: FieldWithValue<string>
      label: string
    }>(
      (props) => () => (
        <output data-testid="app-field">
          {props.label}:{props.field.name}:{props.field.value}
        </output>
      ),
      { props: ['field', 'label'] },
    )

    const { fieldComponent } = getFormHookHelpers()
    const AppTextField = fieldComponent.strict(TextField, 'field')
    const { useAppForm } = createFormHook({
      fieldComponents: { AppTextField },
      formComponents: {},
    })

    const Component = defineComponent(() => {
      const form = useAppForm({ defaultValues: { name: 'Tony' } })
      return () => (
        <form.AppForm>
          {{
            default: () => (
              <form.Field name="name">
                {({
                  field,
                }: {
                  field: AnyFieldApi & { AppTextField: any }
                }) => <field.AppTextField label="Name" />}
              </form.Field>
            ),
          }}
        </form.AppForm>
      )
    })

    const view = render(Component)
    expect(view.getByTestId('app-field')).toHaveTextContent('Name:name:Tony')
  })

  it('binds reusable field groups to concrete form paths', async () => {
    const profileFieldGroup = defineFieldGroup(({ strict }) => ({
      name: strict<string>(),
    }))
    const ProfileFields = defineComponent<{
      fields: typeof profileFieldGroup.fields
    }>(
      (props) => () => (
        <props.fields.Field name="name">
          {({ field }: { field: AnyFieldApi }) => (
            <input
              aria-label="Profile name"
              value={field.value}
              onInput={(event) =>
                field.handleChange((event.target as HTMLInputElement).value)
              }
            />
          )}
        </props.fields.Field>
      ),
      { props: ['fields'] },
    )
    const Profile = profileFieldGroup.bindComponent(ProfileFields, 'fields')
    let getName!: () => string

    const Component = defineComponent(() => {
      const form = useForm({ defaultValues: { user: { name: 'Tony' } } })
      getName = () => form.state.values.user.name
      return () => <Profile form={form} fields={{ name: 'user.name' }} />
    })

    const view = render(Component)
    await fireEvent.update(view.getByLabelText('Profile name'), 'Rodney')
    expect(getName()).toBe('Rodney')
  })

  it('reactively updates reusable field group bindings', async () => {
    const nameFieldGroup = defineFieldGroup(({ strict }) => ({
      name: strict<string>(),
    }))
    const NameFields = nameFieldGroup.bindComponent(
      defineComponent<{ fields: typeof nameFieldGroup.fields }>(
        (props) => () => (
          <props.fields.Field name="name">
            {({ field }: { field: AnyFieldApi }) => (
              <output data-testid="logical-field">
                {field.name}:{field.value}
              </output>
            )}
          </props.fields.Field>
        ),
        { props: ['fields'] },
      ),
      'fields',
    )
    let showSecond!: () => void

    const Component = defineComponent(() => {
      const binding = ref<'first' | 'second'>('first')
      showSecond = () => {
        binding.value = 'second'
      }
      const form = useForm({
        defaultValues: { first: 'One', second: 'Two' },
      })

      return () => <NameFields form={form} fields={{ name: binding.value }} />
    })

    const view = render(Component)
    expect(view.getByTestId('logical-field')).toHaveTextContent('first:One')

    showSecond()

    await waitFor(() =>
      expect(view.getByTestId('logical-field')).toHaveTextContent('second:Two'),
    )
  })

  it('provides composed form components with form context', () => {
    function useComposedFormContext() {
      return composition.useFormContext()
    }
    const Summary = defineComponent(() => {
      const form = useComposedFormContext()
      return () => (
        <form.Subscribe
          selector={(state: { values: { name: string } }) => state.values.name}
        >
          {(name: string) => <output data-testid="summary">{name}</output>}
        </form.Subscribe>
      )
    })
    const composition = createFormHook({
      fieldComponents: {},
      formComponents: { Summary },
    })

    const Component = defineComponent(() => {
      const form = composition.useAppForm({
        defaultValues: { name: 'Tony' },
      })
      return () => (
        <form.AppForm>{{ default: () => <form.Summary /> }}</form.AppForm>
      )
    })

    const view = render(Component)
    expect(view.getByTestId('summary')).toHaveTextContent('Tony')
  })

  it('applies Subscribe when predicates reactively', async () => {
    let show!: () => void
    const Component = defineComponent(() => {
      const form = useForm({ defaultValues: { visible: false } })
      show = () => form.setFieldValue('visible', true)
      return () => (
        <form.Subscribe
          selector={(state) => state.values.visible}
          when={(visible) => visible}
        >
          {() => <output data-testid="visible">Visible</output>}
        </form.Subscribe>
      )
    })

    const view = render(Component)
    expect(view.queryByTestId('visible')).not.toBeInTheDocument()
    show()
    await waitFor(() => expect(view.getByTestId('visible')).toBeInTheDocument())
  })

  it('cleans up field registrations on unmount', () => {
    const onMount = vi.fn()
    const onUnmount = vi.fn()
    const Component = defineComponent(() => {
      const form = useForm({ defaultValues: { name: 'Tony' } })
      return () => (
        <form.Field
          name="name"
          listeners={[
            { triggers: ['mount'], run: onMount },
            { triggers: ['unmount'], run: onUnmount },
          ]}
        >
          {() => null}
        </form.Field>
      )
    })

    const view = render(Component)
    expect(onMount).toHaveBeenCalledOnce()
    view.unmount()
    expect(onUnmount).toHaveBeenCalledOnce()
  })
})
