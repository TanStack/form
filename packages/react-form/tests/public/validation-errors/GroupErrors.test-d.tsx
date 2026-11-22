import React from 'react'
import { expectTypeOf } from 'vitest'
import { useForm } from '../../../src'

export function GroupValidatorErrors() {
  const form = useForm({
    defaultValues: { details: { name: '' } },
    onSubmit: () => {},
  })

  return (
    <form.FormGroup
      name="details"
      validators={[
        {
          triggers: [],
          run: () => ({ message: 'Group error', groupOnly: true as const }),
        },
        {
          triggers: [],
          run: () => ({
            fields: {
              name: { message: 'Routed error', fromGroup: true as const },
            },
          }),
        },
      ]}
    >
      {(group) => {
        expectTypeOf(group.state.errors).toEqualTypeOf<
          Array<{ message: string; groupOnly: true }>
        >()

        return (
          <group.Field
            name="name"
            validators={[
              {
                triggers: [],
                run: () => ({
                  message: 'Field error',
                  fromField: true as const,
                }),
              },
            ]}
          >
            {(field) => {
              expectTypeOf(field.errors).toEqualTypeOf<
                Array<
                  | { message: string; fromField: true }
                  | { message: string; fromGroup: true }
                >
              >()
              return null
            }}
          </group.Field>
        )
      }}
    </form.FormGroup>
  )
}

export function GroupSubmitErrors() {
  const form = useForm({
    defaultValues: { details: { name: '' } },
    onSubmit: () => {},
  })

  return (
    <form.FormGroup
      name="details"
      onSubmit={async ({ value, createValidationError }) => {
        if (!value.name) {
          return createValidationError({
            message: 'Group submission error',
            groupOnly: true as const,
          })
        }
        return createValidationError({
          fields: {
            name: { message: 'Routed error', fromSubmit: true as const },
          },
        })
      }}
    >
      {(group) => {
        expectTypeOf(group.state.errors).toEqualTypeOf<
          Array<{ message: string; groupOnly: true }>
        >()

        return (
          <group.Field
            name="name"
            validators={[
              {
                triggers: [],
                run: () => ({
                  message: 'Field error',
                  fromField: true as const,
                }),
              },
            ]}
          >
            {(field) => {
              expectTypeOf(field.errors).toEqualTypeOf<
                Array<
                  | { message: string; fromField: true }
                  | { message: string; fromSubmit: true }
                >
              >()
              return null
            }}
          </group.Field>
        )
      }}
    </form.FormGroup>
  )
}
