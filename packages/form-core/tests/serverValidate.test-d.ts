import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { validateServerValues } from '../src/internals'
import { formOptions } from '../src'
import type {
  FieldValidators,
  FormApi,
  FormGroupValidators,
  FormValidationResult,
  ParsedStandardSchemaIssues,
  ServerFormState,
} from '../src'

type Values = { name: string }

describe('server validation types', () => {
  it('preserves server schema values and output inference', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: z
            .object({ name: z.string() })
            .transform(({ name }) => ({ nameLength: name.length })),
          triggers: ['server'],
        },
      ],
    })
    const result = await validateServerValues(options, { name: 'Tony' })
    if (!result.success) throw new Error('Expected success')

    expectTypeOf(result.values).toEqualTypeOf<Values>()
    expectTypeOf(result.validatorOutputs).toEqualTypeOf<
      [{ nameLength: number }]
    >()
    expectTypeOf<null | ParsedStandardSchemaIssues<Values>>().toExtend<
      ServerFormState<Values>['validationResults'][number]['result']
    >()
  })

  it('preserves the form value shape in failed server results', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: ({ createErrorMap }) =>
            createErrorMap({ fields: { name: 'Name is required' } }),
          triggers: ['server'],
        },
      ],
    })
    const result = await validateServerValues(options, { name: '' })
    if (result.success) throw new Error('Expected failure')

    expectTypeOf(result.serverState).toEqualTypeOf<ServerFormState<Values>>()
    expectTypeOf<
      (typeof result.serverState.validationResults)[number]['result']
    >().toEqualTypeOf<FormValidationResult<Values>>()
  })

  it('accepts server errors independently of client validator error shapes', () => {
    const issue = { message: 'Invalid name', code: 400 }
    const serverState: ServerFormState<Values> = {
      values: { name: 'Tony' },
      validationResults: [{ validatorIndex: 0, result: issue, output: null }],
      submissionAttempts: 1,
    }

    formOptions({
      defaultValues: { name: '' },
      serverState,
      validators: [
        {
          run: () => ({ message: 'Different issue', reason: 'missing' }),
          triggers: ['server'],
        },
      ],
    })

    formOptions({
      defaultValues: { name: '' },
      serverState: {
        ...serverState,
        // @ts-expect-error Server values must match the form's value shape.
        values: { name: 123 },
      },
    })
  })

  it('excludes schema outputs and client-only errors from server state types', () => {
    const lengthOptions = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: z
            .object({ name: z.string() })
            .transform(({ name }) => name.length),
          triggers: ['server'],
        },
        {
          run: () => ({ message: 'Client A', clientA: true }),
          triggers: ['change'],
        },
      ],
    })
    const uppercaseOptions = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: z
            .object({ name: z.string() })
            .transform(({ name }) => name.toUpperCase()),
          triggers: ['server'],
        },
        {
          run: () => ({ message: 'Client B', clientB: true }),
          triggers: ['blur'],
        },
      ],
    })

    expectTypeOf(lengthOptions.serverState).toEqualTypeOf<
      typeof uppercaseOptions.serverState
    >()
  })

  it('exposes the client form only after narrowing the validation event', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['server', 'change'],
          run: (context) => {
            expectTypeOf(context.event).toEqualTypeOf<
              'server' | 'change' | 'submit'
            >()
            expectTypeOf(context.value).toEqualTypeOf<Values>()
            if (context.event === 'server') {
              // @ts-expect-error Server validators do not receive a client form.
              void context.formApi
            } else {
              expectTypeOf(context.formApi).toEqualTypeOf<
                FormApi<Values, any>
              >()
              expectTypeOf(context.signal).toEqualTypeOf<AbortSignal>()
            }
          },
        },
        {
          triggers: [],
          skipOnSubmit: ({ formApi }) => {
            expectTypeOf(formApi.state.values).toEqualTypeOf<Values>()
            return false
          },
          triggerDebounceMs: 100,
          run: ({ formApi }) => {
            expectTypeOf(formApi).toEqualTypeOf<FormApi<Values, any>>()
          },
        },
      ],
    })
  })

  it('accepts boolean conditions on server triggers and rejects callbacks', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        { run: () => undefined, triggers: [{ trigger: 'server', when: true }] },
        {
          run: () => undefined,
          triggers: [{ trigger: 'server', when: false }],
        },
        {
          run: () => undefined,
          // @ts-expect-error Server trigger conditions must be booleans.
          triggers: [{ trigger: 'server', when: () => true }],
        },
      ],
    })
  })

  it('rejects server triggers on field and group validators', () => {
    const fieldValidators: FieldValidators<Values, 'name', string> = [
      {
        run: () => undefined,
        triggers: [
          // @ts-expect-error Server triggers belong to form validators.
          'server',
        ],
      },
    ]
    const groupValidators: FormGroupValidators<Values> = [
      {
        run: () => undefined,
        triggers: [
          // @ts-expect-error Server triggers belong to form validators.
          'server',
        ],
      },
    ]

    void fieldValidators
    void groupValidators
  })
})
