import { describe, expectTypeOf, it } from 'vitest'
import { formOptions } from '@tanstack/form-core'
import { createFormHook, createFormHookContexts } from '../src'
import type { JSX } from 'solid-js/jsx-runtime'

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

function Test() {
  return null
}

const { useAppForm, withForm } = createFormHook({
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
          <div class="m-3">
            <form.AppField name={`editors.${initialValues}.key` as const}>
              {(field) => {
                expectTypeOf(field().state.value).toExtend<string>()
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
          children?: JSX.Element
        }>()
        return <form.Test />
      },
    })
  })

  it("component made from withForm should have it's props properly typed", () => {
    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      },
    })

    const appForm = useAppForm(() => formOpts)

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

    const incorrectAppForm = useAppForm(() => incorrectFormOpts)

    const IncorrectFormOptsComponent = (
      // @ts-expect-error Incorrect form opts
      <WithFormComponent form={incorrectAppForm} prop1="test" prop2={10} />
    )
  })
})
