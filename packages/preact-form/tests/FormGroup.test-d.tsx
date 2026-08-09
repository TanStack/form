import Preact from 'preact/compat'
import { expectTypeOf } from 'vitest'
import { z } from 'zod'
import { useForm } from '../src'
import type {
  DeepKeys,
  FieldApi,
  FormErrorTypes,
  FormGroupApi,
  StandardSchemaV1Issue,
  ValidationIssue,
} from '../src'

type FieldErrorOf<TField> =
  TField extends FieldApi<any, any, infer TFieldError, any, any>
    ? TFieldError
    : never

type FormGroupErrorTypesOf<TGroup> =
  TGroup extends FormGroupApi<any, any, any, infer TGroupErrorTypes, any>
    ? TGroupErrorTypes
    : never

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
        expectTypeOf(group.atom.get().values.name).toEqualTypeOf<string>()
        group.state.values.name
        expectTypeOf(group.state.isTouched).toEqualTypeOf<boolean>()
        expectTypeOf(group.state.isDirty).toEqualTypeOf<boolean>()
        expectTypeOf(group.state.isPristine).toEqualTypeOf<boolean>()
        expectTypeOf(group.form.state.values.budget).toEqualTypeOf<number>()
        expectTypeOf<FormGroupErrorTypesOf<typeof group>>().toEqualTypeOf<
          FormErrorTypes<never, { message: string; fromGroup: true }>
        >()
        // @ts-expect-error group state values are scoped to guestDetails
        group.state.values.budget
        // @ts-expect-error isDefaultValue is exposed on form state and field meta, not group state
        group.state.isDefaultValue

        return (
          <>
            <group.Field name="name">
              {(field) => {
                expectTypeOf(field.atom.get().value).toEqualTypeOf<string>()
                expectTypeOf(
                  field.form.state.values.budget,
                ).toEqualTypeOf<number>()
                expectTypeOf(field.errors).toEqualTypeOf<
                  Array<GroupValidationError>
                >()
                expectTypeOf<
                  FieldErrorOf<typeof field>
                >().toEqualTypeOf<GroupValidationError>()
                // @ts-expect-error public field APIs expose atom, not store
                field.store
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
                      Array<GroupValidationError>
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

type GuestDetails = {
  name: string
  emails: Array<string>
}

type GroupValidationError = {
  message: string
  fromGroup: true
}

const guestDetailsSchema = z
  .object({
    name: z.string(),
    emails: z.array(z.string()),
  })
  .transform(({ name }) => ({ nameLength: name.length }))

function FormGroupSubmitTypes() {
  const form = useForm({
    defaultValues: {
      guestDetails: {
        name: '',
        emails: [''],
      },
    },
  })

  return (
    <form.FormGroup
      name="guestDetails"
      validators={[
        { run: guestDetailsSchema, triggers: [] },
        {
          run: guestDetailsSchema,
          runOnSubmit: false,
          triggers: [],
        },
      ]}
      onSubmit={({ schemaOutputs, groupApi }) => {
        expectTypeOf(schemaOutputs['length']).toEqualTypeOf<2>()
        expectTypeOf(schemaOutputs[0]).toEqualTypeOf<{
          nameLength: number
        }>()
        expectTypeOf(schemaOutputs[1]).toEqualTypeOf<undefined>()
        expectTypeOf<FormGroupErrorTypesOf<typeof groupApi>>().toEqualTypeOf<
          FormErrorTypes<StandardSchemaV1Issue, StandardSchemaV1Issue>
        >()
      }}
      onSubmitInvalid={(context) => {
        expectTypeOf<keyof typeof context>().toEqualTypeOf<
          'value' | 'formApi' | 'groupApi'
        >()
        expectTypeOf(context.value).toEqualTypeOf<GuestDetails>()
        expectTypeOf<
          FormGroupErrorTypesOf<typeof context.groupApi>
        >().toEqualTypeOf<
          FormErrorTypes<StandardSchemaV1Issue, StandardSchemaV1Issue>
        >()
      }}
    >
      {(group) => {
        void group.validate('submit')
        return null
      }}
    </form.FormGroup>
  )
}

function FormGroupSubscribeTypes() {
  const form = useForm({
    defaultValues: {
      guestDetails: {
        name: '',
        emails: [''],
      },
      budget: 0,
    },
  })

  return (
    <form.FormGroup
      name="guestDetails"
      validators={[
        {
          triggers: [],
          run: () => ({
            form: {
              message: '',
              fromGroup: true as const,
            },
            fields: {},
          }),
        },
      ]}
    >
      {(group) => (
        <>
          <group.Subscribe
            selector={(state) => {
              expectTypeOf(state.values).toEqualTypeOf<GuestDetails>()
              // @ts-expect-error selector values are scoped to guestDetails
              state.values.budget
              return state.values
            }}
          >
            {(values) => {
              expectTypeOf(values).toEqualTypeOf<GuestDetails>()
              return null
            }}
          </group.Subscribe>

          <group.Subscribe
            selector={(state) => {
              expectTypeOf(state.errors).not.toBeNever()
              expectTypeOf(state.errors).toEqualTypeOf<
                Array<GroupValidationError>
              >()
              return state.errors
            }}
            when={(errors) => {
              expectTypeOf(errors).toEqualTypeOf<Array<GroupValidationError>>()
              return errors.length > 0
            }}
          >
            {(errors) => {
              expectTypeOf(errors).toEqualTypeOf<Array<GroupValidationError>>()
              return null
            }}
          </group.Subscribe>

          <group.Subscribe selector={(state) => state.meta}>
            {(meta) => {
              expectTypeOf(meta).toBeUnknown()
              return null
            }}
          </group.Subscribe>

          <group.Subscribe
            selector={(state) => {
              expectTypeOf(state.isTouched).toEqualTypeOf<boolean>()
              expectTypeOf(state.isDirty).toEqualTypeOf<boolean>()
              expectTypeOf(state.isPristine).toEqualTypeOf<boolean>()
              expectTypeOf(state.isValid).toEqualTypeOf<boolean>()
              expectTypeOf(state.isInvalid).toEqualTypeOf<boolean>()
              expectTypeOf(state.canSubmit).toEqualTypeOf<boolean>()
              expectTypeOf(state.isSubmitting).toEqualTypeOf<boolean>()
              expectTypeOf(state.isSubmitSuccessful).toEqualTypeOf<boolean>()
              expectTypeOf(state.isValidating).toEqualTypeOf<boolean>()
              expectTypeOf(state.submissionAttempts).toEqualTypeOf<number>()

              return {
                isSubmitting: state.isSubmitting,
                submissionAttempts: state.submissionAttempts,
              }
            }}
          >
            {(status) => {
              expectTypeOf(status.isSubmitting).toEqualTypeOf<boolean>()
              expectTypeOf(status.submissionAttempts).toEqualTypeOf<number>()
              return null
            }}
          </group.Subscribe>
        </>
      )}
    </form.FormGroup>
  )
}

function FormGroupSubscribeWithoutGroupErrorsTypes() {
  const form = useForm({
    defaultValues: {
      guestDetails: {
        name: '',
      },
    },
  })

  return (
    <form.FormGroup
      name="guestDetails"
      validators={[
        {
          triggers: [],
          run: () => ({
            fields: {
              name: { message: '' },
            },
          }),
        },
      ]}
    >
      {(group) => (
        <group.Subscribe
          selector={(state) => {
            expectTypeOf(state.errors).not.toBeNever()
            expectTypeOf(state.errors).toEqualTypeOf<Array<never>>()
            return state.errors
          }}
        >
          {(errors) => {
            expectTypeOf(errors).toEqualTypeOf<Array<never>>()
            return null
          }}
        </group.Subscribe>
      )}
    </form.FormGroup>
  )
}

function FormGroupWithoutValidatorsTypes() {
  const form = useForm({
    defaultValues: {
      guestDetails: {
        name: '',
      },
    },
    validators: [],
  })

  return (
    <form.FormGroup name="guestDetails">
      {(group) => {
        expectTypeOf<FormGroupErrorTypesOf<typeof group>>().toEqualTypeOf<
          FormErrorTypes<never, never>
        >()
        expectTypeOf(group.state.errors).toEqualTypeOf<Array<never>>()
        return null
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

  expectTypeOf(form.atom.get().values.guestDetails.name).toEqualTypeOf<string>()
  // @ts-expect-error public form APIs expose atom, not store
  form.store

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
void FormGroupSubmitTypes
void FormGroupSubscribeTypes
void FormGroupSubscribeWithoutGroupErrorsTypes
void FormGroupWithoutValidatorsTypes
void RootFieldTypes
