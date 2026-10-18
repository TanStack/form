import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { formOptions } from '../../src/FormApi/formOptions.public'
import type { AnyFieldApi } from '../../src/FieldApi/FieldApi.public'
import type { FormApi, OnSubmitError } from '../../src/FormApi/FormApi.public'
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
            expectTypeOf(formApi.state.errors).toEqualTypeOf<never[]>()
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
