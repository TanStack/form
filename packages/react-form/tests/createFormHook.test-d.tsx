import { describe, expectTypeOf, it } from 'vitest'
import { render } from '@testing-library/react'
import { formOptions } from '@tanstack/form-core'
import { createFormHook, createFormHookContexts } from '../src'

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

function Test() {
  return null
}

const { useAppForm, withForm, createFormGroup, withFormLens } = createFormHook({
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

    const ExampleUsage2 = createFormGroup({
      props: {
        initialValues: '' as keyof EditorFormValues['editors'],
      },
      defaultValues: {} as EditorFormValues,
      render: ({ form, initialValues }) => {
        const test = form.state.values.editors.something?.key
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

  it('should infer subset values and props when calling createFormGroup', () => {
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

    const FormGroupComponent = createFormGroup({
      defaultValues,
      render: function Render({ form, children, ...props }) {
        // Existing types may be inferred
        expectTypeOf(form.state.values.firstName).toEqualTypeOf<string>()
        expectTypeOf(form.state.values.lastName).toEqualTypeOf<string>()
        /**
         * form.state.values can be anything that satisfies Person, not exactly Person.
         * However, it must satisfy Person, so this is okay.
         */
        expectTypeOf(form.state.values).toEqualTypeOf<Person>()
        expectTypeOf(children).toEqualTypeOf<React.ReactNode>()
        expectTypeOf(props).toEqualTypeOf<{}>()
        return <form.Test />
      },
    })

    const FormGroupComponentWithProps = createFormGroup({
      ...defaultValues,
      props: {} as ComponentProps,
      render: ({ form, children, ...props }) => {
        expectTypeOf(props).toEqualTypeOf<{
          prop1: string
          prop2: number
        }>()
        return <form.Test />
      },
    })
  })

  it('should allow spreading formOptions when calling createFormGroup', () => {
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
    const FormGroupComponent = createFormGroup({
      ...formOpts,
      render: function Render({ form }) {
        // Existing types may be inferred
        expectTypeOf(form.state.values.firstName).toEqualTypeOf<string>()
        expectTypeOf(form.state.values.lastName).toEqualTypeOf<string>()
        return <form.Test />
      },
    })

    const noDefaultValuesFormOpts = formOptions({
      onSubmitMeta: { foo: '' },
    })

    const UnknownFormGroupComponent = createFormGroup({
      ...noDefaultValuesFormOpts,
      render: function Render({ form }) {
        // form.state.values can be anything.
        // note that T extends unknown !== unknown extends T.
        expectTypeOf<unknown>().toExtend<typeof form.state.values>()

        // either no submit meta or of the type in formOptions
        expectTypeOf(form.handleSubmit).parameters.toEqualTypeOf<
          [] | [{ foo: string }]
        >()
        return <form.Test />
      },
    })
  })

  it('should allow passing compatible forms to createFormGroup', () => {
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

    const FormGroup = createFormGroup({
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
    // Assert that an equal form is compatible and that props is required
    const CorrectComponent1 = (
      <FormGroup form={equalAppForm} prop1="Test" prop2={10} />
    )
    const MissingProps = (
      // @ts-expect-error because prop1 and prop2 are not added
      <FormGroup form={equalAppForm} />
    )

    // -----------------
    // Assert that a form extending the values is compatible
    const extendedAppForm = useAppForm({
      defaultValues: { ...defaultValues, address: '' },
    })
    // While it has other properties, it satisfies defaultValues
    const CorrectComponent2 = (
      <FormGroup form={extendedAppForm} prop1="Test" prop2={10} />
    )

    // -----------------
    // Assert that a form not satisfying Person errors
    const incompatibleAppForm = useAppForm({
      defaultValues: { ...defaultValues, lastName: 0 },
    })
    const IncompatibleComponent = (
      // @ts-expect-error because the required subset of properties is not compatible.
      <FormGroup form={incompatibleAppForm} prop1="test" prop2={10} />
    )
  })

  it('should require strict equal submitMeta if it is set in createFormGroup', () => {
    type Person = {
      firstName: string
      lastName: string
    }
    type SubmitMeta = {
      correct: string
    }

    const defaultValues: Person = {
      firstName: 'FirstName',
      lastName: 'LastName',
    }
    const onSubmitMeta: SubmitMeta = {
      correct: 'Prop',
    }

    const FormGroupNoMeta = createFormGroup({
      defaultValues,
      render: function Render({ form }) {
        // Since handleSubmit always allows to submit without meta, this is okay
        form.handleSubmit()

        // To match withForm's behaviour, handleSubmit's meta should be unknown if not set.
        expectTypeOf(form.handleSubmit).parameters.toEqualTypeOf<
          [] | [unknown]
        >()

        return <form.Test />
      },
    })

    const FormGroupWithMeta = createFormGroup({
      defaultValues,
      onSubmitMeta,
      render: function Render({ form }) {
        // Since handleSubmit always allows to submit without meta, this is okay
        form.handleSubmit()

        // This matches the value
        form.handleSubmit({ correct: '' })

        // This does not.
        // @ts-expect-error
        form.handleSubmit({ wrong: 'Meta' })

        return <form.Test />
      },
    })

    const noMetaForm = useAppForm({
      defaultValues,
    })

    const CorrectComponent1 = <FormGroupNoMeta form={noMetaForm} />

    const WrongComponent1 = (
      // @ts-expect-error because the meta is not existent
      <FormGroupWithMeta form={noMetaForm} />
    )

    const metaForm = useAppForm({
      defaultValues,
      onSubmitMeta,
    })

    const CorrectComponent2 = <FormGroupNoMeta form={metaForm} />
    const CorrectComponent3 = <FormGroupWithMeta form={metaForm} />

    const diffMetaForm = useAppForm({
      defaultValues,
      onSubmitMeta: { ...onSubmitMeta, something: 'else' },
    })

    const CorrectComponent4 = <FormGroupNoMeta form={diffMetaForm} />
    const WrongComponent2 = (
      // @ts-expect-error because the metas do not align.
      <FormGroupWithMeta form={diffMetaForm} />
    )
  })

  it('should accept any validators for createFormGroup', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const defaultValues: Person = {
      firstName: 'FirstName',
      lastName: 'LastName',
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

    const FormGroup = createFormGroup({
      defaultValues,
      render: function Render({ form }) {
        return <form.Test />
      },
    })

    const CorrectComponent1 = <FormGroup form={formA} />
    const CorrectComponent2 = <FormGroup form={formB} />
  })

  it('should infer subset values and props when calling withFormLens', () => {
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

    const FormGroupComponent = withFormLens({
      defaultValues,
      render: function Render({ lens, children, ...props }) {
        // Existing types may be inferred
        expectTypeOf(lens.state.values.firstName).toEqualTypeOf<string>()
        expectTypeOf(lens.state.values.lastName).toEqualTypeOf<string>()

        expectTypeOf(lens.state.values).toEqualTypeOf<Person>()
        expectTypeOf(children).toEqualTypeOf<React.ReactNode>()
        expectTypeOf(props).toEqualTypeOf<{}>()
        return <lens.Test />
      },
    })

    const FormGroupComponentWithProps = createFormGroup({
      ...defaultValues,
      props: {} as ComponentProps,
      render: ({ form, children, ...props }) => {
        expectTypeOf(props).toEqualTypeOf<{
          prop1: string
          prop2: number
        }>()
        return <form.Test />
      },
    })
  })

  it('should allow spreading formOptions when calling withFormLens', () => {
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
    const FormGroupComponent = withFormLens({
      ...formOpts,
      render: function Render({ lens }) {
        // Existing types may be inferred
        expectTypeOf(lens.state.values.firstName).toEqualTypeOf<string>()
        expectTypeOf(lens.state.values.lastName).toEqualTypeOf<string>()
        return <lens.Test />
      },
    })

    const noDefaultValuesFormOpts = formOptions({
      onSubmitMeta: { foo: '' },
    })

    const UnknownFormGroupComponent = withFormLens({
      ...noDefaultValuesFormOpts,
      render: function Render({ lens }) {
        // lens.state.values can be anything.
        // note that T extends unknown !== unknown extends T.
        expectTypeOf<unknown>().toExtend<typeof lens.state.values>()

        // either no submit meta or of the type in formOptions
        expectTypeOf(lens.handleSubmit).parameters.toEqualTypeOf<
          [] | [{ foo: string }]
        >()
        return <lens.Test />
      },
    })
  })

  it('should allow passing compatible forms to withFormLens', () => {
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

    const FormGroup = withFormLens({
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
      // @ts-expect-error
      <FormGroup form={equalAppForm} name="" prop1="Test" prop2={10} />
    )

    // -----------------
    // Assert that a form extending Person in a property is allowed

    const extendedAppForm = useAppForm({
      defaultValues: { person: { ...defaultValues, address: '' }, address: '' },
    })
    // While it has other properties, it satisfies defaultValues
    const CorrectComponent1 = (
      <FormGroup form={extendedAppForm} name="person" prop1="Test" prop2={10} />
    )

    const MissingProps = (
      // @ts-expect-error because prop1 and prop2 are not added
      <FormGroup form={extendedAppForm} name="person" />
    )

    // -----------------
    // Assert that a form not satisfying Person errors
    const incompatibleAppForm = useAppForm({
      defaultValues: { person: { ...defaultValues, lastName: 0 } },
    })
    const IncompatibleComponent = (
      // @ts-expect-error because the required subset of properties is not compatible.
      <FormGroup form={incompatibleAppForm} name="" prop1="test" prop2={10} />
    )
  })

  it('should require strict equal submitMeta if it is set in withFormLens', () => {
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

    const FormLensNoMeta = withFormLens({
      defaultValues: {} as Person,
      render: function Render({ lens }) {
        // Since handleSubmit always allows to submit without meta, this is okay
        lens.handleSubmit()

        // To match withForm's behaviour, handleSubmit's meta should be unknown if not set.
        expectTypeOf(lens.handleSubmit).parameters.toEqualTypeOf<
          [] | [unknown]
        >()

        return <lens.Test />
      },
    })

    const FormGroupWithMeta = withFormLens({
      defaultValues: {} as Person,
      onSubmitMeta,
      render: function Render({ lens }) {
        // Since handleSubmit always allows to submit without meta, this is okay
        lens.handleSubmit()

        // This matches the value
        lens.handleSubmit({ correct: '' })

        // This does not.
        // @ts-expect-error
        lens.handleSubmit({ wrong: 'Meta' })

        return <lens.Test />
      },
    })

    const noMetaForm = useAppForm({
      defaultValues,
    })

    const CorrectComponent1 = <FormLensNoMeta form={noMetaForm} name="person" />

    const WrongComponent1 = (
      // @ts-expect-error because the meta is not existent
      <FormGroupWithMeta form={noMetaForm} name="person" />
    )

    const metaForm = useAppForm({
      defaultValues,
      onSubmitMeta,
    })

    const CorrectComponent2 = <FormLensNoMeta form={metaForm} name="person" />
    const CorrectComponent3 = (
      <FormGroupWithMeta form={metaForm} name="person" />
    )

    const diffMetaForm = useAppForm({
      defaultValues,
      onSubmitMeta: { ...onSubmitMeta, something: 'else' },
    })

    const CorrectComponent4 = (
      <FormLensNoMeta form={diffMetaForm} name="person" />
    )
    const WrongComponent2 = (
      // @ts-expect-error because the metas do not align.
      <FormGroupWithMeta form={diffMetaForm} name="person" />
    )
  })

  it('should accept any validators for withFormLens', () => {
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

    const FormGroup = withFormLens({
      defaultValues: defaultValues.person,
      render: function Render({ lens }) {
        return <lens.Test />
      },
    })

    const CorrectComponent1 = <FormGroup form={formA} name="person" />
    const CorrectComponent2 = <FormGroup form={formB} name="person" />
  })
})
