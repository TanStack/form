import React from 'react'
import { expectTypeOf } from 'vitest'
import { useForm } from '../src'
import type { DeepKeys, ValidationIssue } from '../src'

function FormGroupTypes() {
  const form = useForm({
    defaultValues: {
      guestDetails: {
        name: '',
        emails: [''],
      },
      budget: 0,
    },
    validators: [
      {
        triggers: [],
        run: () => ({
          form: { message: '', fromForm: true as const },
          fields: {},
        }),
      },
    ],
    onSubmit: () => 'submitted' as const,
  })

  return (
    <form.FormGroup
      name="guestDetails"
      validators={[
        {
          triggers: [],
          run: ({ value }) => {
            value.name
            value.emails
            // @ts-expect-error group validators receive the group value, not the root form value
            value.budget
            const invalidFields = {
              // @ts-expect-error group validator field paths are relative to the group value
              budget: { message: '' },
            } satisfies Partial<
              Record<DeepKeys<typeof value>, { message: string }>
            >
            void invalidFields
            return {
              fields: {
                name: { message: '', fromGroup: true as const },
              },
            }
          },
        },
      ]}
    >
      {(group) => {
        group.state.values.name
        expectTypeOf(group.form.state.values.budget).toEqualTypeOf<number>()
        const validatorResult = group.form.options.validators?.[0]?.run()
        if (validatorResult && !(validatorResult instanceof Promise)) {
          expectTypeOf(validatorResult.form.fromForm).toEqualTypeOf<true>()
        }
        expectTypeOf<
          ReturnType<NonNullable<typeof group.form.options.onSubmit>>
        >().toEqualTypeOf<'submitted'>()
        // @ts-expect-error group state values are scoped to guestDetails
        group.state.values.budget
        // @ts-expect-error lifecycle cleanup is internal-only
        group.destroy
        // @ts-expect-error name prefixing is internal-only
        group.getFieldName
        // @ts-expect-error name prefixing is internal-only
        group.getArrayFieldName

        return (
          <>
            <group.Field name="name">
              {(field) => {
                expectTypeOf(field.form.state.values.budget).toEqualTypeOf<
                  number
                >()
                const validatorResult = field.form.options.validators?.[0]?.run()
                if (validatorResult && !(validatorResult instanceof Promise)) {
                  expectTypeOf(validatorResult.form.fromForm).toEqualTypeOf<
                    true
                  >()
                }
                expectTypeOf(field.errors).toEqualTypeOf<
                  Array<ValidationIssue | { message: string; fromGroup: true }>
                >()
                return null
              }}
            </group.Field>
            <group.Field
              name="name"
              listeners={[
                {
                  triggers: [],
                  run: ({ fieldApi }) => {
                    expectTypeOf(fieldApi.errors).toEqualTypeOf<
                      Array<
                        ValidationIssue | { message: string; fromGroup: true }
                      >
                    >()
                  },
                },
              ]}
            >
              {() => null}
            </group.Field>
            <group.ArrayField name="emails">{() => null}</group.ArrayField>

            {/* @ts-expect-error field names are scoped to the group value */}
            <group.Field name="budget">{() => null}</group.Field>

            {/* @ts-expect-error ArrayField only accepts array-valued group paths */}
            <group.ArrayField name="name">{() => null}</group.ArrayField>
          </>
        )
      }}
    </form.FormGroup>
  )
}

function RootFieldTypes() {
  const form = useForm({
    defaultValues: {
      guestDetails: {
        name: '',
      },
    },
  })

  return (
    <form.Field
      name="guestDetails.name"
      listeners={[
        {
          triggers: [],
          run: ({ fieldApi }) => {
            expectTypeOf(fieldApi.errors).toEqualTypeOf<
              Array<ValidationIssue>
            >()
          },
        },
      ]}
    >
      {(field) => {
        expectTypeOf(field.errors).toEqualTypeOf<Array<ValidationIssue>>()
        return null
      }}
    </form.Field>
  )
}

void FormGroupTypes
void RootFieldTypes
