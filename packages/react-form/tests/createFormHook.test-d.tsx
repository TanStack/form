import { assertType, describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { formOptions } from '@tanstack/form-core'
import { createFormHook, createFormHookContexts } from '../src'

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
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
            <form.AppField name={`editors.${initialValues}.key`}>
              {(field) => {
                assertType<string>(field.state.value)
                return null
              }}
            </form.AppField>
          </div>
        )
      },
    })
  })
})
