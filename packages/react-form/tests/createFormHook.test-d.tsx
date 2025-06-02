import { describe, expectTypeOf, it } from 'vitest'
import { formOptions } from '@tanstack/form-core'
import { createFormHook, createFormHookContexts } from '../src'

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

function Test() {
  return null
}

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    Test,
  },
  formComponents: {
    Test,
  },
  fieldContext,
  formContext,
})

describe('createFormHook', () => {
  it('should not break with an infinite type on large schemas', () => {
    const ActivityKind0_Names = ['Work', 'Rest', 'OnCall'] as const
    type ActivityKind0 = (typeof ActivityKind0_Names)[number]

    enum DayOfWeek {
      Monday = 1,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday,
    }

    interface Branding<Brand> {
      __type?: Brand
    }
    type Branded<T, Brand> = T & Branding<Brand>
    type ActivityId = Branded<string, 'ActivityId'>
    interface ActivitySelectorFormData {
      includeAll: boolean
      includeActivityIds: ActivityId[]
      includeActivityKinds: Set<ActivityKind0>
      excludeActivityIds: ActivityId[]
    }

    const GeneratedTypes0Visibility_Names = [
      'Normal',
      'Advanced',
      'Hidden',
    ] as const
    type GeneratedTypes0Visibility =
      (typeof GeneratedTypes0Visibility_Names)[number]
    interface FormValuesBase {
      key: string
      visibility: GeneratedTypes0Visibility
    }

    interface ActivityCountFormValues extends FormValuesBase {
      _type: 'ActivityCount'
      activitySelector: ActivitySelectorFormData
      daysOfWeek: DayOfWeek[]
      label: string
    }

    interface PlanningTimesFormValues extends FormValuesBase {
      _type: 'PlanningTimes'
      showTarget: boolean
      showPlanned: boolean
      showDiff: boolean
    }

    type EditorValues = ActivityCountFormValues | PlanningTimesFormValues
    interface EditorFormValues<EditorType extends EditorValues = EditorValues> {
      editors: Record<string, EditorType>
      ordering: string[]
    }

    const ExampleUsage = withForm({
      props: {
        initialValues: '' as keyof EditorFormValues['editors'],
      },
      defaultValues: {} as EditorFormValues,
      render: ({ form, initialValues }) => {
        return (
          <div className="m-3">
            <form.AppField name={`editors.${initialValues}.key` as const}>
              {(field) => {
                expectTypeOf(field.state.value).toExtend<string>()
                return null
              }}
            </form.AppField>
            <form.AppForm>
              <form.Test />
            </form.AppForm>
          </div>
        )
      },
    })

    const ExampleUsage2 = withFieldGroup({
      defaultValues: {} as EditorValues,
      render: ({ group }) => {
        const test = group.state.values.key
        return (
          <div className="m-3">
            <group.AppField name="key">
              {(field) => {
                expectTypeOf(field.state.value).toExtend<string>()
                return null
              }}
            </group.AppField>
            <group.AppForm>
              <group.Test />
            </group.AppForm>
          </div>
        )
      },
    })
  })

  it('types should be properly inferred when using formOptions', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      } as Person,
    })

    const WithFormComponent = withForm({
      ...formOpts,
      render: ({ form }) => {
        expectTypeOf(form.state.values).toEqualTypeOf<Person>()
        return <form.Test />
      },
    })
  })

  it('types should be properly inferred when passing args alongside formOptions', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      } as Person,
    })

    const WithFormComponent = withForm({
      ...formOpts,
      onSubmitMeta: {
        test: 'test',
      },
      render: ({ form }) => {
        expectTypeOf(form.handleSubmit).toEqualTypeOf<{
          (): Promise<void>
          (submitMeta: { test: string }): Promise<void>
        }>
        return <form.Test />
      },
    })
  })

  it('types should be properly inferred when formOptions are being overridden', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    type PersonWithAge = Person & {
      age: number
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      } as Person,
    })

    const WithFormComponent = withForm({
      ...formOpts,
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
        age: 10,
      },
      render: ({ form }) => {
        expectTypeOf(form.state.values).toExtend<PersonWithAge>()
        return <form.Test />
      },
    })
  })

  it('withForm props should be properly inferred', () => {
    const WithFormComponent = withForm({
      props: {
        prop1: 'test',
        prop2: 10,
      },
      render: ({ form, ...props }) => {
        expectTypeOf(props).toEqualTypeOf<{
          prop1: string
          prop2: number
          children?: React.ReactNode
        }>()

        return <form.Test />
      },
    })
  })

  it('component made from withForm should have its props properly typed', () => {
    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      },
    })

    const appForm = useAppForm(formOpts)

    const WithFormComponent = withForm({
      ...formOpts,
      props: {
        prop1: 'test',
        prop2: 10,
      },
      render: ({ form, children, ...props }) => {
        expectTypeOf(props).toEqualTypeOf<{
          prop1: string
          prop2: number
        }>()
        return <form.Test />
      },
    })

    const CorrectComponent = (
      <WithFormComponent form={appForm} prop1="test" prop2={10} />
    )

    // @ts-expect-error Missing required props prop1 and prop2
    const MissingPropsComponent = <WithFormComponent form={appForm} />

    const incorrectFormOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
        firstNameWrong: 'FirstName',
        lastNameWrong: 'LastName',
      },
    })

    const incorrectAppForm = useAppForm(incorrectFormOpts)

    const IncorrectFormOptsComponent = (
      // @ts-expect-error Incorrect form opts
      <WithFormComponent form={incorrectAppForm} prop1="test" prop2={10} />
    )
  })

  it('should infer subset values and props when calling withFieldGroup', () => {
    type Person = {
      firstName: string
      lastName: string
    }
    type ComponentProps = {
      prop1: string
      prop2: number
    }

    const defaultValues: Person = {
      firstName: 'FirstName',
      lastName: 'LastName',
    }

    const FormGroupComponent = withFieldGroup({
      defaultValues,
      render: function Render({ group, children, ...props }) {
        // Existing types may be inferred
        expectTypeOf(group.state.values.firstName).toEqualTypeOf<string>()
        expectTypeOf(group.state.values.lastName).toEqualTypeOf<string>()

        expectTypeOf(group.state.values).toEqualTypeOf<Person>()
        expectTypeOf(children).toEqualTypeOf<React.ReactNode>()
        expectTypeOf(props).toEqualTypeOf<{}>()
        return <group.Test />
      },
    })

    const FormGroupComponentWithProps = withFieldGroup({
      ...defaultValues,
      props: {} as ComponentProps,
      render: ({ group, children, ...props }) => {
        expectTypeOf(props).toEqualTypeOf<{
          prop1: string
          prop2: number
        }>()
        return <group.Test />
      },
    })
  })

  it('should allow spreading formOptions when calling withFieldGroup', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const defaultValues: Person = {
      firstName: '',
      lastName: '',
    }
    const formOpts = formOptions({
      defaultValues,
      validators: {
        onChange: () => 'Error',
      },
      listeners: {
        onBlur: () => 'Something',
      },
      asyncAlways: true,
      asyncDebounceMs: 500,
    })

    // validators and listeners are ignored, only defaultValues is acknowledged
    const FormGroupComponent = withFieldGroup({
      ...formOpts,
      render: function Render({ group }) {
        // Existing types may be inferred
        expectTypeOf(group.state.values.firstName).toEqualTypeOf<string>()
        expectTypeOf(group.state.values.lastName).toEqualTypeOf<string>()
        return <group.Test />
      },
    })

    const noDefaultValuesFormOpts = formOptions({
      onSubmitMeta: { foo: '' },
    })

    const UnknownFormGroupComponent = withFieldGroup({
      ...noDefaultValuesFormOpts,
      render: function Render({ group }) {
        // group.state.values can be anything.
        // note that T extends unknown !== unknown extends T.
        expectTypeOf<unknown>().toExtend<typeof group.state.values>()

        // either no submit meta or of the type in formOptions
        expectTypeOf(group.handleSubmit).parameters.toEqualTypeOf<
          [] | [{ foo: string }]
        >()
        return <group.Test />
      },
    })
  })

  it('should allow passing compatible forms to withFieldGroup', () => {
    type Person = {
      firstName: string
      lastName: string
    }
    type ComponentProps = {
      prop1: string
      prop2: number
    }

    const defaultValues: Person = {
      firstName: 'FirstName',
      lastName: 'LastName',
    }

    const FormGroup = withFieldGroup({
      defaultValues,
      props: {} as ComponentProps,
      render: () => {
        return <></>
      },
    })

    const equalAppForm = useAppForm({
      defaultValues,
    })

    // -----------------
    // Assert that an equal form is not compatible as you have no name to pass
    const NoSubfield = (
      <FormGroup
        form={equalAppForm}
        // @ts-expect-error
        fields=""
        prop1="Test"
        prop2={10}
      />
    )

    // -----------------
    // Assert that a form extending Person in a property is allowed

    const extendedAppForm = useAppForm({
      defaultValues: { person: { ...defaultValues, address: '' }, address: '' },
    })
    // While it has other properties, it satisfies defaultValues
    const CorrectComponent1 = (
      <FormGroup
        form={extendedAppForm}
        fields="person"
        prop1="Test"
        prop2={10}
      />
    )

    const MissingProps = (
      // @ts-expect-error because prop1 and prop2 are not added
      <FormGroup form={extendedAppForm} fields="person" />
    )

    // -----------------
    // Assert that a form not satisfying Person errors
    const incompatibleAppForm = useAppForm({
      defaultValues: { person: { ...defaultValues, lastName: 0 } },
    })
    const IncompatibleComponent = (
      <FormGroup
        // @ts-expect-error because the required subset of properties is not compatible.
        form={incompatibleAppForm}
        name=""
        prop1="test"
        prop2={10}
      />
    )
  })

  it('should require strict equal submitMeta if it is set in withFieldGroup', () => {
    type Person = {
      firstName: string
      lastName: string
    }
    type SubmitMeta = {
      correct: string
    }

    const defaultValues = {
      person: { firstName: 'FirstName', lastName: 'LastName' } as Person,
    }
    const onSubmitMeta: SubmitMeta = {
      correct: 'Prop',
    }

    const FormLensNoMeta = withFieldGroup({
      defaultValues: {} as Person,
      render: function Render({ group }) {
        // Since handleSubmit always allows to submit without meta, this is okay
        group.handleSubmit()

        // To prevent unwanted meta behaviour, handleSubmit's meta should be never if not set.
        expectTypeOf(group.handleSubmit).parameters.toEqualTypeOf<
          [] | [submitMeta: never]
        >()

        return <group.Test />
      },
    })

    const FormGroupWithMeta = withFieldGroup({
      defaultValues: {} as Person,
      onSubmitMeta,
      render: function Render({ group }) {
        // Since handleSubmit always allows to submit without meta, this is okay
        group.handleSubmit()

        // This matches the value
        group.handleSubmit({ correct: '' })

        // This does not.
        // @ts-expect-error
        group.handleSubmit({ wrong: 'Meta' })

        return <group.Test />
      },
    })

    const noMetaForm = useAppForm({
      defaultValues,
    })

    const CorrectComponent1 = (
      <FormLensNoMeta form={noMetaForm} fields="person" />
    )

    const WrongComponent1 = (
      <FormGroupWithMeta
        // @ts-expect-error because the meta is not existent
        form={noMetaForm}
        fields="person"
      />
    )

    const metaForm = useAppForm({
      defaultValues,
      onSubmitMeta,
    })

    const CorrectComponent2 = <FormLensNoMeta form={metaForm} fields="person" />
    const CorrectComponent3 = (
      <FormGroupWithMeta form={metaForm} fields="person" />
    )

    const diffMetaForm = useAppForm({
      defaultValues,
      onSubmitMeta: { ...onSubmitMeta, something: 'else' },
    })

    const CorrectComponent4 = (
      <FormLensNoMeta form={diffMetaForm} fields="person" />
    )
    const WrongComponent2 = (
      <FormGroupWithMeta
        // @ts-expect-error because the metas do not align.
        form={diffMetaForm}
        fields="person"
      />
    )
  })

  it('should accept any validators for withFieldGroup', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const defaultValues = {
      person: { firstName: 'FirstName', lastName: 'LastName' } satisfies Person,
    }

    const formA = useAppForm({
      defaultValues,
      validators: {
        onChange: () => 'A',
      },
      listeners: {
        onChange: () => 'A',
      },
    })
    const formB = useAppForm({
      defaultValues,
      validators: {
        onChange: () => 'B',
      },
      listeners: {
        onChange: () => 'B',
      },
    })

    const FormGroup = withFieldGroup({
      defaultValues: defaultValues.person,
      render: function Render({ group }) {
        return <group.Test />
      },
    })

    const CorrectComponent1 = <FormGroup form={formA} fields="person" />
    const CorrectComponent2 = <FormGroup form={formB} fields="person" />
  })

  it('should allow nesting withFieldGroup in other withFieldGroups', () => {
    type Nested = {
      firstName: string
    }
    type Wrapper = {
      field: Nested
    }
    type FormValues = {
      form: Wrapper
      unrelated: { something: { lastName: string } }
    }

    const defaultValues: FormValues = {
      form: {
        field: {
          firstName: 'Test',
        },
      },
      unrelated: {
        something: {
          lastName: '',
        },
      },
    }

    const form = useAppForm({
      defaultValues,
    })
    const LensNested = withFieldGroup({
      defaultValues: defaultValues.form.field,
      render: function Render() {
        return <></>
      },
    })
    const LensWrapper = withFieldGroup({
      defaultValues: defaultValues.form,
      render: function Render({ group }) {
        return (
          <div>
            <LensNested form={group} fields="field" />
          </div>
        )
      },
    })

    const Component = <LensWrapper form={form} fields="form" />
  })

  it('should not allow withFieldGroups with different metas to be nested', () => {
    type Nested = {
      firstName: string
    }
    type Wrapper = {
      field: Nested
    }
    type FormValues = {
      form: Wrapper
      unrelated: { something: { lastName: string } }
    }

    const defaultValues: FormValues = {
      form: {
        field: {
          firstName: 'Test',
        },
      },
      unrelated: {
        something: {
          lastName: '',
        },
      },
    }

    const LensNestedNoMeta = withFieldGroup({
      defaultValues: defaultValues.form.field,
      render: function Render() {
        return <></>
      },
    })
    const LensNestedWithMeta = withFieldGroup({
      defaultValues: defaultValues.form.field,
      onSubmitMeta: { meta: '' },
      render: function Render() {
        return <></>
      },
    })
    const LensWrapper = withFieldGroup({
      defaultValues: defaultValues.form,
      render: function Render({ group }) {
        return (
          <div>
            <LensNestedNoMeta form={group} fields="field" />
            <LensNestedWithMeta
              // @ts-expect-error Wrong meta!
              form={group}
              fields="field"
            />
          </div>
        )
      },
    })

    it('should allow mapping withFieldGroup to different fields', () => {
      const defaultValues = {
        firstName: '',
        lastName: '',
        age: 0,
        relatives: [{ firstName: '', lastName: '', age: 0 }],
      }
      const defaultFields = {
        first: '',
        last: '',
      }

      const form = useAppForm({
        defaultValues,
      })

      const FieldGroup = withFieldGroup({
        defaultValues: defaultFields,
        render: function Render() {
          return <></>
        },
      })

      const Component1 = (
        <FieldGroup
          form={form}
          fields={{
            first: 'lastName',
            last: 'firstName',
          }}
        />
      )

      const Component2 = (
        <FieldGroup
          form={form}
          fields={{
            first: 'relatives[0].lastName',
            last: 'relatives[0].firstName',
          }}
        />
      )
    })

    it('should not allow fields mapping if the top level is an array', () => {
      const defaultValues = {
        firstName: '',
        lastName: '',
        age: 0,
        relatives: [{ firstName: '', lastName: '', age: 0 }],
        relativesRecord: {
          something: { firstName: '', lastName: '', age: 0 },
        } as Record<string, { firstName: string; lastName: string }>,
      }
      const defaultFields = {
        firstName: '',
        lastName: '',
      }

      const form = useAppForm({
        defaultValues,
      })

      const FieldGroupRecord = withFieldGroup({
        defaultValues: { anything: defaultFields } as Record<
          string,
          typeof defaultFields
        >,
        render: function Render() {
          return <></>
        },
      })
      const FieldGroupArray = withFieldGroup({
        defaultValues: [defaultFields],
        render: function Render() {
          return <></>
        },
      })

      const CorrectComponent1 = (
        <FieldGroupRecord form={form} fields="relativesRecord" />
      )
      const WrongComponent1 = (
        <FieldGroupRecord
          form={form}
          // @ts-expect-error because record is non-indexable
          fields={{
            'any field goes': 'relatives[0]',
          }}
        />
      )
      const CorrectComponent3 = (
        <FieldGroupArray form={form} fields="relatives" />
      )
      const WrongComponent2 = (
        <FieldGroupArray
          form={form}
          // @ts-expect-error because arrays are non-indexable
          fields={{}}
        />
      )
    })
  })
})
