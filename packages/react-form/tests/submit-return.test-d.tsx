import React from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { createFormHook, formOptions, useForm } from '../src'
import type {
  ReactFormType,
  StandardSchemaV1Issue,
  ValidationIssue,
} from '../src'

const emailSchema = z.object({ email: z.string() })

describe('submit return', () => {
  it('infers schema outputs and submit errors without a cycle', () => {
    function Component() {
      const form = useForm({
        defaultValues: { email: '' },
        validators: [
          {
            run: emailSchema,
            triggers: [],
          },
          {
            run: ({ value, createOutput }) =>
              createOutput({ normalizedEmail: value.email.trim() }),
            triggers: [],
          },
        ],
        onSubmit: ({ validatorOutputs, createValidationError }) => {
          expectTypeOf(validatorOutputs).toEqualTypeOf<
            [{ email: string }, { normalizedEmail: string }]
          >()

          return createValidationError({
            form: { message: '', fromSubmitForm: true as const },
            fields: {
              email: { message: '', fromSubmitField: true as const },
            },
          })
        },
      })

      expectTypeOf(form.state.errors).toEqualTypeOf<
        Array<StandardSchemaV1Issue | { message: string; fromSubmitForm: true }>
      >()
      expectTypeOf(form.defaultValues).toEqualTypeOf<{ email: string }>()

      return (
        <form.Field name="email">
          {(field) => {
            expectTypeOf(field.errors).toEqualTypeOf<
              Array<
                | StandardSchemaV1Issue
                | { message: string; fromSubmitField: true }
              >
            >()
            return null
          }}
        </form.Field>
      )
    }

    void Component
  })

  describe('formOptions', () => {
    it('attaches precise submit handlers to shared options with callbacks', () => {
      const sharedOptions = formOptions({
        defaultValues: { email: '' },
        validators: [],
        listeners: [
          {
            triggers: ['submit'],
            run: ({ value, formApi }) => {
              expectTypeOf(value).toEqualTypeOf<{ email: string }>()
              expectTypeOf(formApi.state.errors).toEqualTypeOf<
                Array<ValidationIssue>
              >()
              // @ts-expect-error The submit fallback does not erase value types.
              formApi.setFieldValue('email', 42)
            },
          },
        ],
        onSubmitInvalid: ({ formApi }) => {
          expectTypeOf(formApi.state.values).toEqualTypeOf<{ email: string }>()
          expectTypeOf(formApi.state.errors).toEqualTypeOf<
            Array<ValidationIssue>
          >()
          // @ts-expect-error The submit fallback does not erase field paths.
          formApi.setFieldValue('missing', '')
        },
      })

      function Component() {
        const sync = useForm({
          ...sharedOptions,
          onSubmit: ({ createValidationError }) =>
            createValidationError({
              form: { message: '', code: 'sync' as const },
              fields: {},
            }),
        })
        const async = useForm({
          ...sharedOptions,
          onSubmit: async ({ createValidationError }) =>
            createValidationError({
              form: { message: '', code: 'async' as const },
              fields: { email: { message: '', code: 'email' as const } },
            }),
        })
        const direct = useForm({ defaultValues: { email: '' } })

        expectTypeOf(sync.state.errors).toEqualTypeOf<
          Array<{ message: string; code: 'sync' }>
        >()
        expectTypeOf(async.state.errors).toEqualTypeOf<
          Array<{ message: string; code: 'async' }>
        >()
        expectTypeOf(direct.state.errors).toEqualTypeOf<
          Array<ValidationIssue>
        >()

        return (
          <async.Field name="email">
            {(field) => {
              expectTypeOf(field.errors).toEqualTypeOf<
                Array<{ message: string; code: 'email' }>
              >()
              return null
            }}
          </async.Field>
        )
      }

      void Component
    })

    it('should allow shared options to omit onSubmit', () => {
      const sharedOptionsWithoutSubmit = formOptions({
        defaultValues: { email: '' },
        validators: [],
      })

      type SharedFormWithoutSubmit = ReactFormType<
        typeof sharedOptionsWithoutSubmit
      >

      function SharedFormChild(props: { form: SharedFormWithoutSubmit }) {
        const { form } = props

        return (
          <form.Field name="email">
            {(field) => {
              expectTypeOf(field.errors).toEqualTypeOf<Array<ValidationIssue>>()
              return null
            }}
          </form.Field>
        )
      }

      function ParentWithSubmitInComponent() {
        const formWithSyncError = useForm({
          ...sharedOptionsWithoutSubmit,
          onSubmit: ({ createValidationError }) => {
            if (Math.random() > 0.5) {
              return createValidationError({
                fields: {
                  email: { message: '', fromSubmit: true },
                },
              })
            }
            return null
          },
        })

        const formWithAsyncError = useForm({
          ...sharedOptionsWithoutSubmit,
          onSubmit: ({ createValidationError }) =>
            Promise.resolve(
              createValidationError({
                fields: {
                  email: { message: '', fromSubmit: true },
                },
              }),
            ),
        })

        const formWithoutError = useForm({
          ...sharedOptionsWithoutSubmit,
          onSubmit: () => Promise.resolve(null),
        })
        const formUnchanged = useForm(sharedOptionsWithoutSubmit)

        expectTypeOf(formWithSyncError).toExtend<SharedFormWithoutSubmit>()
        expectTypeOf(formWithAsyncError).toExtend<SharedFormWithoutSubmit>()
        expectTypeOf(formWithoutError).toExtend<SharedFormWithoutSubmit>()
        expectTypeOf(formUnchanged).toExtend<SharedFormWithoutSubmit>()

        return (
          <>
            <SharedFormChild form={formWithSyncError} />
            <SharedFormChild form={formWithAsyncError} />
            <SharedFormChild form={formWithoutError} />
            <SharedFormChild form={formUnchanged} />
          </>
        )
      }

      void ParentWithSubmitInComponent
    })

    describe('appFormOptions', () => {
      const { appFormOptions, useAppForm } = createFormHook({
        fieldComponents: {},
        formComponents: {},
      })

      it('preserves registered components through schema-first overloads', () => {
        const SubmitButton = () => null
        const schema = z.object({ email: z.string() })
        const { appFormOptions: componentFormOptions } = createFormHook({
          fieldComponents: {},
          formComponents: { SubmitButton },
        })
        const strictOptions = componentFormOptions.strictSchema(schema, {
          defaultValues: { email: '' },
        })
        const looseOptions = componentFormOptions.looseSchema(schema, {
          defaultValues: { email: null },
        })

        expectTypeOf<
          ReactFormType<typeof strictOptions>['SubmitButton']
        >().toEqualTypeOf<typeof SubmitButton>()
        expectTypeOf<
          ReactFormType<typeof looseOptions>['SubmitButton']
        >().toEqualTypeOf<typeof SubmitButton>()
      })

      it('should allow shared options to omit onSubmit', () => {
        const sharedOptionsWithoutSubmit = appFormOptions({
          defaultValues: { email: '' },
          validators: [],
        })

        type SharedFormWithoutSubmit = ReactFormType<
          typeof sharedOptionsWithoutSubmit
        >

        function SharedFormChild(props: { form: SharedFormWithoutSubmit }) {
          const { form } = props

          return (
            <form.Field name="email">
              {(field) => {
                expectTypeOf(field.errors).toEqualTypeOf<
                  Array<ValidationIssue>
                >()
                return null
              }}
            </form.Field>
          )
        }

        function ParentWithSubmitInComponent() {
          const formWithSyncError = useAppForm({
            ...sharedOptionsWithoutSubmit,
            onSubmit: ({ createValidationError }) => {
              if (Math.random() > 0.5) {
                return createValidationError({
                  fields: {
                    email: { message: '', fromSubmit: true },
                  },
                })
              }
              return null
            },
          })

          const formWithAsyncError = useAppForm({
            ...sharedOptionsWithoutSubmit,
            onSubmit: ({ createValidationError }) =>
              Promise.resolve(
                createValidationError({
                  fields: {
                    email: { message: '', fromSubmit: true },
                  },
                }),
              ),
          })

          const formWithoutError = useAppForm({
            ...sharedOptionsWithoutSubmit,
            onSubmit: () => Promise.resolve(null),
          })
          const formUnchanged = useAppForm(sharedOptionsWithoutSubmit)

          expectTypeOf(formWithSyncError).toExtend<SharedFormWithoutSubmit>()
          expectTypeOf(formWithAsyncError).toExtend<SharedFormWithoutSubmit>()
          expectTypeOf(formWithoutError).toExtend<SharedFormWithoutSubmit>()
          expectTypeOf(formUnchanged).toExtend<SharedFormWithoutSubmit>()

          return (
            <>
              <SharedFormChild form={formWithSyncError} />
              <SharedFormChild form={formWithAsyncError} />
              <SharedFormChild form={formWithoutError} />
              <SharedFormChild form={formUnchanged} />
            </>
          )
        }

        void ParentWithSubmitInComponent
      })
    })
  })
})
