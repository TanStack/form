import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { formOptions } from '../../src/FormApi/formOptions.public'
import type { AnyFieldApi } from '../../src/FieldApi/FieldApi.public'
import type { FormApi, OnSubmitError } from '../../src/FormApi/FormApi.public'
import type {
  FormOptions,
  FormOptionsApi,
} from '../../src/FormApi/formOptions.public'
import type { ServerFormState } from '../../src/FormApi/formServerState.public'
import type { StandardSchemaV1Issue } from '../../src/standardSchema.public'
// TODO finalize migration
import type { FormErrorTypes } from '../../src/validation.public'
import type {
  CreateErrorMapFn,
  ParseIssuesFn,
  ParsedStandardSchemaIssues,
  ValidationFailureItem,
} from '../../src/validation/state.public'

describe('formOptions.strictSchema', () => {
  it('uses the complete schema input without registering a validator', () => {
    const schema = z.object({
      status: z.enum(['draft', 'published']),
      age: z.coerce.number<string>().optional(),
    })
    type SchemaInput = z.input<typeof schema>

    const options = formOptions.strictSchema(schema, {
      defaultValues: { status: 'draft' },
      onSubmit: ({ value, formApi, validatorOutputs }) => {
        expectTypeOf(value).toEqualTypeOf<SchemaInput>()
        expectTypeOf(formApi.state.values).toEqualTypeOf<SchemaInput>()
        expectTypeOf(validatorOutputs).toEqualTypeOf<[]>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<SchemaInput>()
  })

  it('rejects incomplete defaults, invalid input, and parsed output', () => {
    const schema = z.object({
      name: z.string(),
      age: z.coerce.number<string>(),
    })

    formOptions.strictSchema(schema, {
      // @ts-expect-error Strict defaults must include required schema fields.
      defaultValues: { age: '' },
    })
    formOptions.strictSchema(schema, {
      defaultValues: {
        // @ts-expect-error A non-nullable schema input cannot start as null.
        name: null,
        age: '',
      },
    })
    formOptions.strictSchema(schema, {
      defaultValues: {
        // @ts-expect-error A required schema input cannot start as undefined.
        name: undefined,
        age: '',
      },
    })
    formOptions.strictSchema(schema, {
      defaultValues: {
        name: '',
        // @ts-expect-error Defaults use schema input, not transformed output.
        age: 0,
      },
    })
    formOptions.strictSchema(schema, {
      defaultValues: {
        name: '',
        age: '',
        // @ts-expect-error Strict defaults cannot add fields absent from the schema.
        extra: true,
      },
    })
    formOptions.strictSchema(schema, {
      defaultValues: {
        name: '',
        age: '',
      },
    })
  })

  it('types callback-only validators and predicates from the schema input', () => {
    const schema = z.object({
      status: z.enum(['draft', 'published']),
      note: z.string().optional(),
    })
    type SchemaInput = z.input<typeof schema>

    formOptions.strictSchema(schema, {
      defaultValues: { status: 'draft' },
      validators: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ value, formApi }) => {
                expectTypeOf(value).toEqualTypeOf<SchemaInput>()
                expectTypeOf(formApi.state.values).toEqualTypeOf<SchemaInput>()
                return value.status === 'published'
              },
            },
          ],
          skipOnSubmit: ({ value, formApi }) => {
            expectTypeOf(value).toEqualTypeOf<SchemaInput>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<SchemaInput>()
            return value.status === 'draft'
          },
          run: ({ value, formApi, event, createErrorMap, parseIssues }) => {
            expectTypeOf(value).toEqualTypeOf<SchemaInput>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<SchemaInput>()
            expectTypeOf(event).toEqualTypeOf<'change' | 'submit'>()
            expectTypeOf(createErrorMap).toEqualTypeOf<
              CreateErrorMapFn<SchemaInput>
            >()
            expectTypeOf(parseIssues).toEqualTypeOf<
              ParseIssuesFn<SchemaInput>
            >()
          },
        },
        {
          triggers: ['mount', 'server'],
          skipOnSubmit: true,
          run: ({ value, event }) => {
            expectTypeOf(value).toEqualTypeOf<SchemaInput>()
            expectTypeOf(event).toEqualTypeOf<'mount' | 'server'>()
          },
        },
      ],
    })
  })

  it('keeps schema input separate from mixed validator outputs', () => {
    const schema = z.object({
      age: z.coerce.number<string>(),
      name: z.string().optional(),
    })
    type SchemaInput = z.input<typeof schema>
    type SchemaOutput = z.output<typeof schema>

    formOptions.strictSchema(schema, {
      defaultValues: { age: '' },
      validators: [
        {
          run: async ({ value, createOutput }) => {
            expectTypeOf(value).toEqualTypeOf<SchemaInput>()
            return createOutput(value.age.length)
          },
        },
        { run: schema },
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<SchemaInput>()
            return { message: 'Check age', code: 'age' as const }
          },
        },
      ],
      onSubmit: ({ value, formApi, validatorOutputs }) => {
        expectTypeOf(value).toEqualTypeOf<SchemaInput>()
        expectTypeOf(formApi.state.values).toEqualTypeOf<SchemaInput>()
        expectTypeOf(formApi.state.errors).toEqualTypeOf<
          Array<StandardSchemaV1Issue | { message: string; code: 'age' }>
        >()
        expectTypeOf(validatorOutputs).toEqualTypeOf<
          [number, SchemaOutput, undefined]
        >()
      },
    })
  })

  it('types listeners and error visibility from schema input without validators', () => {
    const schema = z.object({
      status: z.enum(['draft', 'published']),
      note: z.string().optional(),
    })
    type SchemaInput = z.input<typeof schema>

    formOptions.strictSchema(schema, {
      defaultValues: { status: 'draft' },
      errorVisibility: ({ state }) => {
        expectTypeOf(state.values).toEqualTypeOf<SchemaInput>()
        return state.values.status === 'published'
      },
      listeners: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ value, formApi }) => {
                expectTypeOf(value).toEqualTypeOf<SchemaInput>()
                expectTypeOf(formApi.state.values).toEqualTypeOf<SchemaInput>()
                return value.note !== undefined
              },
            },
          ],
          triggerDebounceMs: ({ value, formApi }) => {
            expectTypeOf(value).toEqualTypeOf<SchemaInput>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<SchemaInput>()
            return value.status === 'draft' ? 0 : 200
          },
          run: ({ value, formApi }) => {
            expectTypeOf(value).toEqualTypeOf<SchemaInput>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<SchemaInput>()
          },
        },
      ],
    })
  })

  it('types server state from schema input rather than defaults or parsed output', () => {
    const schema = z.object({
      status: z.enum(['draft', 'published']),
      age: z.coerce.number<string>(),
      note: z.string().optional(),
    })
    type SchemaInput = z.input<typeof schema>

    const options = formOptions.strictSchema(schema, {
      defaultValues: { status: 'draft', age: '' },
      serverState: {
        values: { status: 'published', age: '42', note: 'Submitted' },
        validationResults: [],
        submissionAttempts: 1,
      },
    })

    expectTypeOf(options.serverState).toEqualTypeOf<
      ServerFormState<SchemaInput, unknown> | null | undefined
    >()

    formOptions.strictSchema(schema, {
      ...options,
      serverState: {
        values: {
          status: 'published',
          // @ts-expect-error Server values must retain the untransformed input type.
          age: 42,
        },
        validationResults: [],
        submissionAttempts: 1,
      },
    })
    formOptions.strictSchema(schema, {
      ...options,
      serverState: {
        // @ts-expect-error Required schema inputs must also be present in server values.
        values: { status: 'published' },
        validationResults: [],
        submissionAttempts: 1,
      },
    })
  })

  it('preserves every discriminated union branch when defaults select one', () => {
    const schema = z.discriminatedUnion('kind', [
      z.object({ kind: z.literal('person'), name: z.string() }),
      z.object({ kind: z.literal('company'), companyName: z.string() }),
    ])
    type SchemaInput = z.input<typeof schema>

    const options = formOptions.strictSchema(schema, {
      defaultValues: { kind: 'person', name: '' },
      validators: [
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<SchemaInput>()
            if (value.kind === 'person') {
              expectTypeOf(value.name).toEqualTypeOf<string>()
              // @ts-expect-error Company fields require the company branch.
              void value.companyName
            } else {
              expectTypeOf(value.companyName).toEqualTypeOf<string>()
              // @ts-expect-error Person fields require the person branch.
              void value.name
            }
          },
        },
      ],
      onSubmit: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<SchemaInput>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<SchemaInput>()

    const invalidDefaults = { kind: 'company' as const, name: '' }
    formOptions.strictSchema(schema, {
      // @ts-expect-error Defaults must match a member of the union.
      defaultValues: invalidDefaults,
    })
  })
})

describe('formOptions.looseSchema', () => {
  it('merges omitted and nested defaults with the schema input', () => {
    type Value = {
      name: string | undefined
      address: {
        city: string | null
        postcode: number | undefined
      }
    }
    const schema = z.object({
      name: z.string(),
      address: z.object({ city: z.string(), postcode: z.number() }),
    })

    const options = formOptions.looseSchema(schema, {
      defaultValues: { address: { city: null } },
      onSubmit: ({ value, formApi, validatorOutputs }) => {
        expectTypeOf(value).toEqualTypeOf<Value>()
        expectTypeOf(formApi.state.values).toEqualTypeOf<Value>()
        expectTypeOf(validatorOutputs).toEqualTypeOf<[]>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<Value>()
  })

  it('adds only the null and undefined states present in defaults', () => {
    type Value = {
      name: string | null
      age: number | undefined
      active: boolean
    }
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
    })

    const options = formOptions.looseSchema(schema, {
      defaultValues: { name: null, age: undefined, active: false },
      onSubmit: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<Value>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<Value>()
  })

  it('rejects incompatible values within the editable schema input', () => {
    const schema = z.object({
      age: z.coerce.number<string>(),
      users: z.array(z.object({ name: z.string() })),
    })

    formOptions.looseSchema(schema, {
      defaultValues: {
        // @ts-expect-error Loose defaults still require a compatible input type.
        age: false,
      },
    })
    formOptions.looseSchema(schema, {
      defaultValues: {
        // @ts-expect-error Parsed output is not an editable schema input.
        age: 0,
      },
    })
    formOptions.looseSchema(schema, {
      defaultValues: {
        // @ts-expect-error An array field cannot start as a string.
        users: '',
      },
    })
    formOptions.looseSchema(schema, {
      defaultValues: {
        // @ts-expect-error Nested array items must also match the editable input.
        users: [{ name: false }],
      },
    })
  })

  it('types callback-only validators and predicates from merged form values', () => {
    type Value = {
      name: string | undefined
      age: string | null
      address: {
        city: string | null
        postcode: number | undefined
      }
    }
    const schema = z.object({
      name: z.string(),
      age: z.coerce.number<string>(),
      address: z.object({ city: z.string(), postcode: z.number() }),
    })

    const options = formOptions.looseSchema(schema, {
      defaultValues: { age: null, address: { city: null } },
      validators: [
        {
          triggers: [
            {
              trigger: 'blur',
              when: ({ value, formApi }) => {
                expectTypeOf(value).toEqualTypeOf<Value>()
                expectTypeOf(formApi.state.values).toEqualTypeOf<Value>()
                return value.age !== null
              },
            },
          ],
          skipOnSubmit: ({ value, formApi }) => {
            expectTypeOf(value).toEqualTypeOf<Value>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<Value>()
            return value.name === undefined
          },
          run: ({ value, formApi, event, createErrorMap, parseIssues }) => {
            expectTypeOf(value).toEqualTypeOf<Value>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<Value>()
            expectTypeOf(event).toEqualTypeOf<'blur' | 'submit'>()
            expectTypeOf(createErrorMap).toEqualTypeOf<
              CreateErrorMapFn<Value>
            >()
            expectTypeOf(parseIssues).toEqualTypeOf<ParseIssuesFn<Value>>()
            return createErrorMap({
              fields: { name: 'Required', 'address.postcode': 'Required' },
            })
          },
        },
      ],
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<[undefined]>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<Value>()
  })

  it('keeps editable form values separate from transformed and skipped outputs', () => {
    type Value = { age: string | null; name: string | undefined }
    const schema = z.object({
      age: z.coerce.number<string>(),
      name: z.string(),
    })

    type SchemaOutput = z.output<typeof schema>

    formOptions.looseSchema(schema, {
      defaultValues: { age: null },
      validators: [
        {
          run: async ({ value, createOutput }) => {
            expectTypeOf(value).toEqualTypeOf<Value>()
            return createOutput(value.name ?? '')
          },
        },
        { run: schema },
        {
          skipOnSubmit: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<Value>()
            return value.age === null
          },
          run: schema,
        },
        { skipOnSubmit: true, run: schema },
      ],
      onSubmit: ({ value, formApi, validatorOutputs }) => {
        expectTypeOf(value).toEqualTypeOf<Value>()
        expectTypeOf(formApi.state.values).toEqualTypeOf<Value>()
        expectTypeOf(formApi.state.errors).toEqualTypeOf<
          Array<StandardSchemaV1Issue>
        >()
        expectTypeOf(validatorOutputs).toEqualTypeOf<
          [string, SchemaOutput, SchemaOutput | undefined, undefined]
        >()
      },
    })
  })

  it('types listeners and error visibility from merged values without validators', () => {
    type UnionValue = { name: string | undefined; age: number | null }
    const schema = z.object({ name: z.string(), age: z.number() })

    formOptions.looseSchema(schema, {
      defaultValues: { age: null },
      errorVisibility: ({ state }) => {
        expectTypeOf(state.values).toEqualTypeOf<UnionValue>()
        return state.values.age !== null
      },
      listeners: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ value, formApi }) => {
                expectTypeOf(value).toEqualTypeOf<UnionValue>()
                expectTypeOf(formApi.state.values).toEqualTypeOf<UnionValue>()
                return value.name !== undefined
              },
            },
          ],
          triggerDebounceMs: ({ value, formApi }) => {
            expectTypeOf(value).toEqualTypeOf<UnionValue>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<UnionValue>()
            return value.age === null ? 0 : 200
          },
          run: ({ value, formApi }) => {
            expectTypeOf(value).toEqualTypeOf<UnionValue>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<UnionValue>()
          },
        },
      ],
    })
  })

  it('types server state from merged values without widening the form type', () => {
    type UnionValue = {
      status: 'draft' | 'published'
      age: string | null
      name: string | undefined
    }
    const schema = z.object({
      status: z.enum(['draft', 'published']),
      age: z.coerce.number<string>(),
      name: z.string(),
    })

    const options = formOptions.looseSchema(schema, {
      defaultValues: { status: 'draft', age: null },
      serverState: {
        values: { status: 'published', age: '42', name: 'Submitted' },
        validationResults: [],
        submissionAttempts: 1,
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<UnionValue>()
    expectTypeOf(options.serverState).toEqualTypeOf<
      ServerFormState<UnionValue, unknown> | null | undefined
    >()

    formOptions.looseSchema(schema, {
      defaultValues: { status: 'draft', age: null },
      serverState: {
        values: { status: 'draft', age: null, name: undefined },
        validationResults: [],
        submissionAttempts: 1,
      },
    })
    formOptions.looseSchema(schema, {
      defaultValues: { status: 'draft', age: null },
      serverState: {
        values: {
          status: 'published',
          // @ts-expect-error Server values use editable input, not parsed output.
          age: 42,
          name: 'Submitted',
        },
        validationResults: [],
        submissionAttempts: 1,
      },
    })
    formOptions.looseSchema(schema, {
      defaultValues: { status: 'draft', age: null },
      serverState: {
        values: {
          status: 'published',
          age: '42',
          // @ts-expect-error Server values cannot introduce a new null state.
          name: null,
        },
        validationResults: [],
        submissionAttempts: 1,
      },
    })
  })

  it('merges partial nested array items into mutable schema arrays', () => {
    type Value = {
      users: Array<{
        name: string | null
        tags: Array<{ label: string | null; count: number | undefined }>
      }>
    }
    const schema = z.object({
      users: z.array(
        z.object({
          name: z.string(),
          tags: z.array(z.object({ label: z.string(), count: z.number() })),
        }),
      ),
    })

    const options = formOptions.looseSchema(schema, {
      defaultValues: { users: [{ name: null, tags: [{ label: null }] }] },
      validators: [
        {
          run: ({ value, createErrorMap }) => {
            expectTypeOf(value).toEqualTypeOf<Value>()
            return createErrorMap({
              fields: { 'users[0].tags[0].count': 'Required' },
            })
          },
        },
      ],
      onSubmit: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<Value>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<Value>()
  })

  it('infers schema array items from empty defaults', () => {
    type Value = { users: Array<{ name: string; age: number }> }
    const schema = z.object({
      users: z.array(z.object({ name: z.string(), age: z.number() })),
    })

    const options = formOptions.looseSchema(schema, {
      defaultValues: { users: [] },
      onSubmit: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<Value>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<Value>()
  })

  it('merges top-level null, undefined, and empty defaults with schema input', () => {
    const schema = z.object({ name: z.string(), age: z.number() })
    type SchemaInput = z.input<typeof schema>

    const nullOptions = formOptions.looseSchema(schema, {
      defaultValues: null,
      validators: [
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<SchemaInput | null>()
          },
        },
      ],
      onSubmit: ({ value, formApi }) => {
        expectTypeOf(value).toEqualTypeOf<SchemaInput | null>()
        expectTypeOf(formApi.state.values).toEqualTypeOf<SchemaInput | null>()
      },
    })
    expectTypeOf(nullOptions.defaultValues).toEqualTypeOf<SchemaInput | null>()

    const undefinedOptions = formOptions.looseSchema(schema, {
      defaultValues: undefined,
      onSubmit: ({ value, formApi }) => {
        expectTypeOf(value).toEqualTypeOf<SchemaInput | undefined>()
        expectTypeOf(formApi.state.values).toEqualTypeOf<
          SchemaInput | undefined
        >()
      },
    })
    expectTypeOf(undefinedOptions.defaultValues).toEqualTypeOf<
      SchemaInput | undefined
    >()

    type EmptyValue = { name: string | undefined; age: number | undefined }
    const emptyOptions = formOptions.looseSchema(schema, {
      defaultValues: {},
      onSubmit: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<EmptyValue>()
      },
    })
    expectTypeOf(emptyOptions.defaultValues).toEqualTypeOf<EmptyValue>()
  })

  it('preserves built-in values and nullable objects without making them partial', () => {
    type Value = {
      startDate: Date | null
      pattern: RegExp
      profile: { name: string } | null
    }
    const schema = z.object({
      startDate: z.date(),
      pattern: z.instanceof(RegExp),
      profile: z.object({ name: z.string() }),
    })

    const options = formOptions.looseSchema(schema, {
      defaultValues: { startDate: null, pattern: /name/, profile: null },
      onSubmit: ({ value, formApi }) => {
        expectTypeOf(value).toEqualTypeOf<Value>()
        expectTypeOf(formApi.state.values).toEqualTypeOf<Value>()
      },
    })
    expectTypeOf(options.defaultValues).toEqualTypeOf<Value>()

    formOptions.looseSchema(schema, {
      defaultValues: {
        // @ts-expect-error Dates must be complete Date values or editable placeholders.
        startDate: {},
      },
    })
    formOptions.looseSchema(schema, {
      defaultValues: {
        // @ts-expect-error Regular expressions cannot be partial plain objects.
        pattern: { source: 'name' },
      },
    })
  })
})

describe('formOptions schema helpers', () => {
  it('preserves configured component types through both schema helpers', () => {
    type Components = { TextField: (props: { label: string }) => string }
    type ComponentsOf<TOptions> =
      TOptions extends FormOptions<any, any, any, infer TComponents>
        ? TComponents
        : never
    const configuredFormOptions = formOptions as FormOptionsApi<Components>
    const schema = z.object({ name: z.string() })

    const strictOptions = configuredFormOptions.strictSchema(schema, {
      defaultValues: { name: '' },
    })
    expectTypeOf<
      ComponentsOf<typeof strictOptions>
    >().toEqualTypeOf<Components>()

    const looseOptions = configuredFormOptions.looseSchema(schema, {
      defaultValues: { name: null },
    })
    expectTypeOf<
      ComponentsOf<typeof looseOptions>
    >().toEqualTypeOf<Components>()
  })
})

describe('formOptions server state', () => {
  it('accepts omitted, null, and initial server state without validators', () => {
    const options = formOptions({ defaultValues: { name: '' } })
    expectTypeOf(options.serverState).toEqualTypeOf<
      ServerFormState<{ name: string }, unknown> | null | undefined
    >()

    formOptions({ defaultValues: { name: '' }, serverState: null })
    formOptions({
      defaultValues: { name: '' },
      serverState: {
        values: undefined,
        validationResults: [],
        submissionAttempts: 0,
      },
    })
  })

  it('preserves server error types and validator output inference', () => {
    const serverState = {
      values: { name: 'Submitted' },
      validationResults: [
        {
          validatorIndex: 0,
          result: { message: 'Invalid', code: 'server' as const },
          output: null,
        },
      ],
      submissionAttempts: 1,
    }

    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['server'],
          run: () => ({ message: 'Invalid', code: 'server' as const }),
        },
        {
          triggers: [{ trigger: 'server', when: true }],
          run: ({ createOutput, value }) => createOutput(value.name.length),
        },
        {
          triggers: ['change'],
          run: () => ({ message: 'Invalid', code: 'client' as const }),
        },
      ],
      serverState,
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<
          [undefined, number, undefined]
        >()
      },
    })

    formOptions({
      ...options,
      serverState: {
        values: { name: '' },
        validationResults: [
          {
            validatorIndex: 2,
            // @ts-expect-error Client-only issues cannot occur in server state.
            result: { message: 'Invalid', code: 'client' },
            output: null,
          },
        ],
        submissionAttempts: 1,
      },
    })

    formOptions({
      ...options,
      serverState: {
        // @ts-expect-error Server state must match the defaultValues shape.
        values: { name: 123 },
        validationResults: [],
        submissionAttempts: 1,
      },
    })
  })
})

describe('formOptions listener inference', () => {
  it('types listener callbacks from defaultValues without validators', () => {
    formOptions({
      defaultValues: { name: '', age: 0 },
      listeners: [
        {
          triggers: [
            'change',
            'blur',
            'submit',
            'mount',
            'reset',
            { trigger: 'change' },
            { trigger: 'blur', when: false },
            {
              trigger: 'change',
              when: ({ value, formApi, triggerFieldApi }) => {
                expectTypeOf(value).toEqualTypeOf<{
                  name: string
                  age: number
                }>()
                expectTypeOf(formApi.state.values).toEqualTypeOf<typeof value>()
                expectTypeOf(triggerFieldApi).toEqualTypeOf<
                  AnyFieldApi | undefined
                >()
                return value.age > 0
              },
            },
          ],
          triggerDebounceMs: ({ value, formApi, triggerFieldApi }) => {
            expectTypeOf(value).toEqualTypeOf<{ name: string; age: number }>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<typeof value>()
            expectTypeOf(triggerFieldApi).toEqualTypeOf<
              AnyFieldApi | undefined
            >()
            return value.age > 0 ? 200 : 0
          },
          run: async ({ value, formApi, triggerFieldApi }) => {
            expectTypeOf(value).toEqualTypeOf<{ name: string; age: number }>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<typeof value>()
            expectTypeOf(triggerFieldApi).toEqualTypeOf<
              AnyFieldApi | undefined
            >()
          },
        },
        { triggers: [], triggerDebounceMs: 200, run: () => undefined },
      ],
    })
  })

  it('preserves validator errors and submission outputs with listeners', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['change'],
          run: () => ({
            form: { message: 'Invalid form', code: 'form' as const },
            fields: {
              name: { message: 'Invalid name', code: 'field' as const },
            },
          }),
        },
        {
          run: ({ value, createOutput }) => createOutput(value.name.length),
        },
      ],
      listeners: [
        {
          triggers: ['change'],
          run: ({ value, formApi }) => {
            expectTypeOf(value).toEqualTypeOf<{ name: string }>()
            expectTypeOf(formApi.state.errors).toEqualTypeOf<
              Array<{ message: string; code: 'form' }>
            >()
            expectTypeOf(formApi).toEqualTypeOf<
              FormApi<
                typeof value,
                FormErrorTypes<
                  { message: string; code: 'form' },
                  { message: string; code: 'field' }
                >
              >
            >()
          },
        },
      ],
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<[undefined, number]>()
      },
    })
  })
})

describe('formOptions validator inference', () => {
  it('exposes separate error helpers across client, mount, and server contexts', () => {
    formOptions({
      defaultValues: { users: [{ name: '' }] },
      validators: [
        {
          triggers: ['change', 'blur', 'mount', 'server'],
          run: ({ createErrorMap, parseIssues }) => {
            type Data = { users: Array<{ name: string }> }
            expectTypeOf(createErrorMap).toEqualTypeOf<CreateErrorMapFn<Data>>()
            expectTypeOf(parseIssues).toEqualTypeOf<ParseIssuesFn<Data>>()

            const errors = createErrorMap({ form: ['Please check the form'] })
            errors.fields['users[0].name'] = 'Required'
            expectTypeOf(errors.form).toEqualTypeOf<Array<string>>()
            // @ts-expect-error Error maps retain the inferred error item type.
            errors.form.push({ message: 'Invalid' })
            // @ts-expect-error Error map fields must belong to the form values.
            errors.fields.missing = 'Invalid'

            const issues: ReadonlyArray<StandardSchemaV1Issue> = [
              { message: 'Required', path: ['users', 0, 'name'] },
            ]
            const parsed = parseIssues(issues)
            expectTypeOf(parsed).toEqualTypeOf<
              ParsedStandardSchemaIssues<Data>
            >()
            parsed.form.push({ message: 'Invalid form' })
            // @ts-expect-error Parsed error maps retain the form's field paths.
            parsed.fields.missing = { message: 'Invalid' }
            // @ts-expect-error Standard Schema issues belong to parseIssues.
            createErrorMap(issues)

            return parsed
          },
        },
      ],
    })
  })

  it('infers submit-only callbacks when triggers are omitted or empty', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: ({ event, value, formApi }) => {
            expectTypeOf(event).toEqualTypeOf<'submit'>()
            expectTypeOf(value).toEqualTypeOf<{ name: string }>()
            expectTypeOf(formApi.state.values.name).toEqualTypeOf<string>()
          },
        },
        {
          triggers: [],
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'submit'>()
          },
        },
      ],
    })
  })

  it('keeps trigger and submit settings local to each validator', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'submit'>()
          },
        },
        {
          triggers: ['server', 'change'],
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'server' | 'change' | 'submit'>()
          },
        },
        {
          triggers: ['blur'],
          skipOnSubmit: true,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'blur'>()
          },
        },
      ],
    })
  })

  it('infers form values and event-specific capabilities in mixed validators', () => {
    formOptions({
      defaultValues: { name: '', age: 0 },
      validators: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ value, formApi }) => {
                expectTypeOf(value).toEqualTypeOf<{
                  name: string
                  age: number
                }>()
                expectTypeOf(formApi.state.values).toEqualTypeOf<{
                  name: string
                  age: number
                }>()
                return value.age > 0
              },
            },
            'server',
          ],
          skipOnSubmit: false,
          run: (ctx) => {
            expectTypeOf(ctx.event).toEqualTypeOf<
              'change' | 'server' | 'submit'
            >()
            expectTypeOf(ctx.value).toEqualTypeOf<{
              name: string
              age: number
            }>()
            // @ts-expect-error Client-only properties require narrowing the event.
            void ctx.formApi
            if (ctx.event === 'server') {
              // @ts-expect-error Server validators have no client form API.
              void ctx.formApi
              // @ts-expect-error Server validators have no client abort signal.
              void ctx.signal
            } else {
              expectTypeOf(
                ctx.formApi.state.values.name,
              ).toEqualTypeOf<string>()
              expectTypeOf(ctx.signal).toEqualTypeOf<AbortSignal>()
            }
          },
        },
        {
          triggers: ['mount'],
          skipOnSubmit: true,
          run: (ctx) => {
            expectTypeOf(ctx.event).toEqualTypeOf<'mount'>()
            expectTypeOf(ctx.value.age).toEqualTypeOf<number>()
          },
        },
      ],
    })
  })

  it('keeps submit possible when skipOnSubmit is a boolean', () => {
    const settings: { skipOnSubmit: boolean } = { skipOnSubmit: false }

    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['server', 'change'],
          skipOnSubmit: settings.skipOnSubmit,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'server' | 'change' | 'submit'>()
          },
        },
        {
          skipOnSubmit: settings.skipOnSubmit,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'submit'>()
          },
        },
        {
          triggers: [],
          skipOnSubmit: settings.skipOnSubmit,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'submit'>()
          },
        },
      ],
    })
  })

  it('infers skip predicates from form values and keeps submit in callback contexts', () => {
    // This is likely overkill, but just in case someone tries this weird combo.
    // If it causes problems in future changes, feel free to remove.
    const settings: { skipOnSubmit: true | (() => boolean) } = {
      skipOnSubmit: true,
    }

    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['change', 'server'],
          skipOnSubmit: ({ value, formApi }) => {
            expectTypeOf(value).toEqualTypeOf<{ name: string }>()
            expectTypeOf(formApi.state.values).toEqualTypeOf<{ name: string }>()
            return value.name === ''
          },
          run: (ctx) => {
            expectTypeOf(ctx.event).toEqualTypeOf<
              'change' | 'server' | 'submit'
            >()
            if (ctx.event !== 'server') {
              expectTypeOf(
                ctx.formApi.state.values.name,
              ).toEqualTypeOf<string>()
            } else {
              // @ts-expect-error Server validators have no client form API.
              void ctx.formApi
            }
          },
        },
        {
          triggers: ['blur'],
          skipOnSubmit: settings.skipOnSubmit,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'blur' | 'submit'>()
          },
        },
      ],
    })
  })

  it('rejects asynchronous and non-boolean skip predicates', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          // @ts-expect-error Predicates must return a boolean.
          skipOnSubmit: () => 'yes',
          run: () => undefined,
        },
        {
          // @ts-expect-error Predicates cannot return a promise.
          skipOnSubmit: async () => true,
          run: () => undefined,
        },
      ],
    })
  })

  it('accepts schema validators with conditional, omitted, or empty triggers', () => {
    const schema = z.object({ name: z.string() })
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ value }) => {
                expectTypeOf(value).toEqualTypeOf<{ name: string }>()
                return value.name !== ''
              },
            },
          ],
          run: schema,
        },
        { run: schema },
        { triggers: [], run: schema },
      ],
    })
  })

  it('infers all configured events from string trigger entries', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['change', 'blur', 'mount', 'server'],
          skipOnSubmit: true,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<
              'change' | 'blur' | 'mount' | 'server'
            >()
          },
        },
      ],
    })
  })

  it('infers each event from a single object trigger entry', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: [
            {
              trigger: 'change',
              when: ({ value, formApi }) => {
                expectTypeOf(value).toEqualTypeOf<{ name: string }>()
                expectTypeOf(formApi.state.values).toEqualTypeOf<{
                  name: string
                }>()
                return value.name !== ''
              },
            },
          ],
          skipOnSubmit: true,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'change'>()
          },
        },
        {
          triggers: [{ trigger: 'blur', when: true }],
          skipOnSubmit: true,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'blur'>()
          },
        },
        {
          triggers: [{ trigger: 'server', when: true }],
          skipOnSubmit: true,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'server'>()
          },
        },
        {
          triggers: [{ trigger: 'mount', when: false }],
          skipOnSubmit: true,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<'mount'>()
          },
        },
      ],
    })
  })

  it('rejects when callbacks for server and mount triggers', () => {
    formOptions({
      defaultValues: { name: '' },
      // Perhaps sometimes in the future, we can make it so that the `when` simply has
      // different context based on the other trigger? But that seems like a lot of pain
      // for a minor case.

      // Point is, these tests are important for the present, but feel free to adjust in the future.
      validators: [
        {
          // @ts-expect-error Server conditions must be booleans.
          triggers: [{ trigger: 'server', when: () => true }],
          run: () => undefined,
        },
        {
          // @ts-expect-error Mount conditions must be booleans.
          triggers: [{ trigger: 'mount', when: () => false }],
          skipOnSubmit: true,
          run: () => undefined,
        },
        {
          // @ts-expect-error A client trigger does not allow server predicates.
          triggers: ['change', { trigger: 'server', when: () => true }],
          skipOnSubmit: true,
          run: () => undefined,
        },
        {
          // @ts-expect-error A client trigger does not allow mount predicates.
          triggers: ['blur', { trigger: 'mount', when: () => false }],
          run: () => undefined,
        },
      ],
    })
  })

  it('infers events and predicate values from mixed string and object entries', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: [
            'server',
            { trigger: 'mount', when: true },
            'change',
            {
              trigger: 'blur',
              when: ({ value, formApi }) => {
                expectTypeOf(value).toEqualTypeOf<{ name: string }>()
                expectTypeOf(formApi.state.values).toEqualTypeOf<{
                  name: string
                }>()
                return value.name !== ''
              },
            },
          ],
          skipOnSubmit: true,
          run: ({ event }) => {
            expectTypeOf(event).toEqualTypeOf<
              'change' | 'blur' | 'mount' | 'server'
            >()
          },
        },
      ],
    })
  })

  it('rejects unsupported trigger names and invalid conditions', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          // @ts-expect-error Submit is controlled by skipOnSubmit.
          triggers: ['submit'],
          run: () => undefined,
        },
        {
          // @ts-expect-error Object triggers cannot explicitly select submit.
          triggers: [{ trigger: 'submit', when: () => true }],
          run: () => undefined,
        },
        {
          // @ts-expect-error Unknown trigger names are invalid.
          triggers: ['unknown'],
          run: () => undefined,
        },
        {
          // @ts-expect-error Valid triggers do not make an invalid trigger acceptable.
          triggers: ['change', { trigger: 'submit', when: () => true }],
          run: () => undefined,
        },
        {
          // @ts-expect-error Predicates must return a boolean.
          triggers: [{ trigger: 'change', when: () => 'yes' }],
          run: () => undefined,
        },
        {
          // @ts-expect-error Object triggers require a when condition.
          triggers: [{ trigger: 'change' }],
          run: () => undefined,
        },
      ],
    })
  })
})

describe('formOptions validator returns', () => {
  it('accepts direct errors and field error maps, including asynchronous results', () => {
    const issue = { message: 'Required', code: 'required' as const }
    const errors = ['Invalid', issue] as const

    formOptions({
      defaultValues: { users: [{ name: '' }] },
      validators: [
        { run: () => 'Required' },
        { run: () => issue },
        { run: () => errors },
        {
          run: () => ({
            form: errors,
            fields: { 'users[0].name': issue },
          }),
        },
        { run: async () => errors },
        {
          run: async () => ({
            form: issue,
            fields: { 'users[0].name': errors },
          }),
        },
        {
          run: async ({ createErrorMap }) =>
            createErrorMap({ fields: { 'users[0].name': 'Required' } }),
        },
      ],
    })
  })

  it('accepts successful results without output, including asynchronous results', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        { run: () => {} },
        { run: () => undefined },
        { run: () => null },
        // explicit false allows for checks like `condition && 'error'`
        { run: () => false },
        { run: async () => {} },
        { run: async () => undefined },
        { run: async () => null },
        { run: async () => false as const },
      ],
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<
          [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
          ]
        >()
      },
    })
  })

  it('rejects invalid errors in synchronous and asynchronous results', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          // @ts-expect-error Numbers are not validation errors or successful results.
          run: () => 42,
        },
        {
          // @ts-expect-error Only false is a successful boolean result.
          run: () => true,
        },
        {
          // @ts-expect-error Issue objects require a message.
          run: () => ({ code: 'invalid' }),
        },
        {
          // @ts-expect-error Every item must be a valid error.
          run: () => ['Invalid', 42],
        },
        {
          // @ts-expect-error Form error maps must contain valid errors.
          run: () => ({ form: 42, fields: {} }),
        },
        {
          // @ts-expect-error Field error maps must contain valid errors.
          run: () => ({ fields: { name: 42 } }),
        },
        {
          // @ts-expect-error Field issue objects also require a message.
          run: () => ({ fields: { name: { code: 'invalid' } } }),
        },
        {
          // @ts-expect-error Promises must also resolve to valid results.
          run: async () => 42,
        },
        {
          // @ts-expect-error Asynchronous issue objects also require a message.
          run: async () => ({ code: 'invalid' }),
        },
        {
          // @ts-expect-error Asynchronous field maps must contain valid errors.
          run: async () => ({ fields: { name: true } }),
        },
      ],
    })
  })
})

describe('formOptions onSubmit inference', () => {
  it('exposes separate submission helpers and accepts returned schema issues', () => {
    formOptions({
      defaultValues: { name: '' },
      onSubmit: ({ createErrorMap, parseIssues }) => {
        const errors = createErrorMap({ fields: { name: 'Required' } })
        expectTypeOf(errors.form).toEqualTypeOf<Array<ValidationFailureItem>>()
        errors.form.push('Please check the form')
        // @ts-expect-error Submission errors retain the form's field paths.
        errors.fields.missing = 'Invalid'

        const issues: ReadonlyArray<StandardSchemaV1Issue> = [
          { message: 'Required', path: ['name'] },
        ]
        const parsed = parseIssues(issues)
        expectTypeOf(parsed.form).toEqualTypeOf<Array<StandardSchemaV1Issue>>()
        expectTypeOf(parsed).toExtend<
          OnSubmitError<ParsedStandardSchemaIssues<{ name: string }>>
        >()
        // @ts-expect-error Parsed submission errors retain the form's field paths.
        parsed.fields.missing = { message: 'Invalid' }
        // @ts-expect-error Standard Schema issues belong to parseIssues.
        createErrorMap(issues)
        // @ts-expect-error Partial error maps belong to createErrorMap.
        parseIssues({ form: 'Invalid' })

        return parsed
      },
    })
  })

  it('accepts error maps returned from asynchronous submission handlers', () => {
    formOptions({
      defaultValues: { name: '' },
      onSubmit: async ({ createErrorMap }) => {
        return createErrorMap({ fields: { name: 'Required' } })
      },
    })
  })

  it('infers submitted values and the form API from defaultValues', () => {
    formOptions({
      defaultValues: { name: '', age: 0 },
      validators: [{ run: () => undefined }],
      onSubmit: ({ value, formApi }) => {
        expectTypeOf(value).toEqualTypeOf<{ name: string; age: number }>()
        expectTypeOf(formApi.state.values).toEqualTypeOf<{
          name: string
          age: number
        }>()
      },
    })
  })

  it('infers empty submission outputs when validators are omitted or empty', () => {
    formOptions({
      defaultValues: { name: '' },
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<[]>()
      },
    })

    formOptions({
      defaultValues: { name: '' },
      validators: [],
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<[]>()
      },
    })
  })

  it('infers submission outputs from asynchronous validator callbacks', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: async ({ value, createOutput }) => createOutput(value.name),
        },
      ],
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<[string]>()
      },
    })
  })

  it('infers the same transformed submission output from schema callbacks and schemas', () => {
    const schema = z
      .object({ name: z.string() })
      .transform(({ name }) => name.length)

    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['change'],
          run: ({ createOutput, parseIssues, value }) => {
            const result = schema.safeParse(value)
            if (!result.success) {
              return parseIssues(result.error.issues)
            }
            return createOutput(result.data)
          },
        },
        { triggers: ['change'], run: schema },
      ],
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<[number, number]>()
      },
    })
  })

  it('makes predicate-controlled submission outputs optional', () => {
    const settings: { skipOnSubmit: true | (() => boolean) } = {
      skipOnSubmit: true,
    }
    const schema = z
      .object({ name: z.string() })
      .transform(({ name }) => name.length)

    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          skipOnSubmit: ({ value }) => value.name === '',
          run: ({ createOutput, value }) => createOutput(value.name),
        },
        { skipOnSubmit: ({ value }) => value.name === '', run: schema },
        { skipOnSubmit: settings.skipOnSubmit, run: schema },
      ],
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<
          [string | undefined, number | undefined, number | undefined]
        >()
      },
    })
  })

  it('infers submission outputs from boolean and literal skip settings', () => {
    const settings: { skipOnSubmit: boolean } = { skipOnSubmit: false }
    const schema = z
      .object({ name: z.string() })
      .transform(({ name }) => name.length)

    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          skipOnSubmit: settings.skipOnSubmit,
          run: ({ createOutput, value }) => createOutput(value.name),
        },
        { skipOnSubmit: settings.skipOnSubmit, run: schema },
        {
          skipOnSubmit: true,
          triggers: ['change'],
          run: ({ createOutput, value }) => createOutput(value.name),
        },
        { skipOnSubmit: true, run: schema },
        {
          skipOnSubmit: false,
          run: ({ createOutput, value }) => createOutput(value.name),
        },
        { skipOnSubmit: false, run: schema },
        { run: ({ createOutput, value }) => createOutput(value.name) },
        { run: schema },
      ],
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<
          [
            string | undefined,
            number | undefined,
            undefined,
            undefined,
            string,
            number,
            string,
            number,
          ]
        >()
      },
    })
  })
})
