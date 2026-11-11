import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { formOptions } from '../src'
import { InternalValidatorInstance } from '../src/ValidatorInstance.lib'
import { parseStandardSchema, validateServerValues } from '../src/internals'
import type {
  FieldValidatorContext,
  FieldValidators,
  FormGroupValidators,
  FormOptionsValidators,
  FormValidator,
  GetFormErrorTypes,
  GetValidatorOutputs,
  ToFormGroupErrorTypes,
  ToFormGroupOutputs,
  ValidationErrorMap,
  ValidationIssue,
  ValidationOutput,
} from '../src'

type Data = { name: string }

function defineValidators<
  const TConfig extends unknown[],
  const TValidators extends ReadonlyArray<unknown>,
>(validators: TValidators & FormOptionsValidators<Data, TConfig>): TValidators {
  return formOptions({ defaultValues: { name: '' }, validators }).validators!
}

function defineGroupValidators<const T extends FormGroupValidators<Data>>(
  validators: T,
): T {
  return validators
}

describe('validator output types', () => {
  it('retains the schema output type in parsed output wrappers', () => {
    const result = parseStandardSchema(
      z.object({ name: z.string() }),
      { name: 'Tony' },
      new InternalValidatorInstance({
        definition: { run: z.object({ name: z.string() }) },
        owner: undefined,
        scope: 'form',
      }),
    )

    expectTypeOf<
      Extract<Awaited<typeof result>, ValidationOutput<unknown>>
    >().toEqualTypeOf<ValidationOutput<{ name: string }>>()
  })

  it('infers mixed schema and sync/async function outputs without raw error returns', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        { run: z.object({ name: z.string() }), triggers: [] },
        {
          run: ({ value, createOutput }) => createOutput(value.name.length),
          triggers: [],
        },
        { run: () => undefined, triggers: [] },
        {
          run: async ({ value, createOutput }) => {
            if (!value.name) return 'Required'
            return createOutput({ name: value.name })
          },
          triggers: [],
        },
      ],
      onSubmit: ({ validatorOutputs }) => {
        expectTypeOf(validatorOutputs).toEqualTypeOf<
          [{ name: string }, number, undefined, { name: string } | undefined]
        >()
      },
    })
  })

  it('excludes branded payloads from form and routed field error inference', () => {
    const validators = defineValidators([
      {
        run: ({ value, createOutput }) => {
          if (!value.name)
            return { fields: { name: { message: 'Required', code: 400 } } }
          return createOutput({
            message: 'Data',
            fields: { name: { message: 'Data', payloadOnly: true } },
          })
        },
        triggers: [],
      },
    ])

    expectTypeOf<GetFormErrorTypes<typeof validators, never>>().toEqualTypeOf<{
      readonly selfError: never
      readonly subfieldError: { message: string; code: number }
    }>()
    expectTypeOf<GetValidatorOutputs<typeof validators>>().toEqualTypeOf<
      [
        | {
            message: string
            fields: { name: { message: string; payloadOnly: boolean } }
          }
        | undefined,
      ]
    >()

    const outputOnly = defineValidators([
      { run: ({ createOutput }) => createOutput('data'), triggers: [] },
    ])
    expectTypeOf<GetFormErrorTypes<typeof outputOnly, never>>().toEqualTypeOf<{
      readonly selfError: never
      readonly subfieldError: never
    }>()
  })

  it('includes undefined for successful scalar returns without an output', () => {
    const validators = defineValidators([
      {
        run: ({ value, createOutput }) =>
          value.name ? createOutput(1) : undefined,
        triggers: [],
      },
      {
        run: ({ value, createOutput }) => (value.name ? createOutput(1) : null),
        triggers: [],
      },
      {
        run: ({ value, createOutput }) =>
          value.name ? createOutput(1) : false,
        triggers: [],
      },
      { run: ({ createOutput }) => createOutput(undefined), triggers: [] },
    ])

    expectTypeOf<GetValidatorOutputs<typeof validators>>().toEqualTypeOf<
      [number | undefined, number | undefined, number | undefined, undefined]
    >()
  })

  it('accounts for empty collections without discarding their possible errors', () => {
    const validators = defineValidators([
      {
        run: ({ createOutput }): ValidationOutput<number> | ValidationIssue[] =>
          createOutput(1),
        triggers: [],
      },
      {
        run: ({
          createOutput,
        }):
          | ValidationOutput<number>
          | ValidationErrorMap<Data, ValidationIssue, ValidationIssue> =>
          createOutput(1),
        triggers: [],
      },
      {
        run: ({ createOutput }): ValidationOutput<number> | [ValidationIssue] =>
          createOutput(1),
        triggers: [],
      },
      {
        run: ({
          createOutput,
        }): ValidationOutput<number> | { fields: { name: string } } =>
          createOutput(1),
        triggers: [],
      },
      {
        run: ({
          createOutput,
        }): ValidationOutput<number> | { fields: { name?: string } } =>
          createOutput(1),
        triggers: [],
      },
      {
        run: ({
          createOutput,
        }): ValidationOutput<number> | { form: string; fields: {} } =>
          createOutput(1),
        triggers: [],
      },
      {
        run: ({
          createOutput,
        }):
          | ValidationOutput<number>
          | { form: []; fields: { name: undefined } } => createOutput(1),
        triggers: [],
      },
      {
        run: ({
          createOutput,
        }): ValidationOutput<number> | { message: string; fields: {} } =>
          createOutput(1),
        triggers: [],
      },
    ])

    expectTypeOf<GetValidatorOutputs<typeof validators>>().toEqualTypeOf<
      [
        number | undefined,
        number | undefined,
        number | undefined,
        number | undefined,
        number | undefined,
        number | undefined,
        number | undefined,
        number | undefined,
      ]
    >()
    type Errors = GetFormErrorTypes<typeof validators, never>
    expectTypeOf<ValidationIssue>().toExtend<Errors['selfError']>()
    expectTypeOf<ValidationIssue>().toExtend<Errors['subfieldError']>()
    expectTypeOf<Errors['subfieldError']>().toExtend<ValidationIssue>()
  })

  it('preserves submit eligibility and broad validator output positions', () => {
    const validators = defineValidators([
      {
        run: ({ createOutput }) => createOutput(1),
        triggers: [],
        skipOnSubmit: true,
      },
      {
        run: ({ createOutput }) => createOutput(1),
        triggers: [],
        skipOnSubmit: false as boolean,
      },
      {
        run: ({ createOutput }) => createOutput(1),
        triggers: [],
        skipOnSubmit: () => false,
      },
      {
        run: ({ createOutput }) => createOutput(1),
        triggers: [],
        skipOnSubmit: false,
      },
    ])

    expectTypeOf<GetValidatorOutputs<typeof validators>>().toEqualTypeOf<
      [undefined, number | undefined, number | undefined, number]
    >()
    expectTypeOf<
      GetValidatorOutputs<
        ReadonlyArray<
          FormValidator<Data, boolean | 'change' | 'blur' | 'server' | 'mount'>
        >
      >
    >().toEqualTypeOf<ReadonlyArray<any>>()
  })

  it('infers group outputs and excludes them from group errors', () => {
    const validators = defineGroupValidators([
      {
        run: async ({ value, createOutput }) => {
          if (!value.name) return 'Required'
          return createOutput(value.name.length)
        },
        triggers: [],
      },
    ])

    expectTypeOf<ToFormGroupOutputs<typeof validators>>().toEqualTypeOf<
      readonly [number]
    >()
    expectTypeOf<ToFormGroupErrorTypes<typeof validators>>().toEqualTypeOf<{
      readonly selfError: ValidationIssue
      readonly subfieldError: ValidationIssue
    }>()
  })

  it('infers server outputs independently of client submit eligibility', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: ({ createOutput }) => createOutput('client'),
          triggers: ['change'],
        },
        {
          run: async ({ value, createOutput }) =>
            createOutput(value.name.length),
          triggers: ['server'],
          skipOnSubmit: true,
        },
      ],
    })
    const result = await validateServerValues(options, { name: 'Tony' })
    if (!result.success) throw new Error('Expected success')

    expectTypeOf(result.validatorOutputs).toEqualTypeOf<[undefined, number]>()
  })

  it('does not expose or accept branded outputs in field validators', () => {
    expectTypeOf<'createOutput'>().not.toExtend<
      keyof FieldValidatorContext<'name', string, Data>
    >()
    type OutputValidator = {
      run: () => ValidationOutput<string>
      triggers: []
    }
    expectTypeOf<[OutputValidator]>().not.toExtend<
      FieldValidators<Data, 'name', string>
    >()
  })
})
