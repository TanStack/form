import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { formOptions } from '../src'
import { validateServerValues } from '../src/internals'
import type {
  FieldValidatorContext,
  FieldValidators,
  FormGroupValidators,
  FormValidators,
  ToFormErrorTypes,
  ToFormGroupErrorTypes,
  ToFormGroupOutputs,
  ToFormOutputs,
  ValidationErrorMap,
  ValidationIssue,
  ValidationOutput,
} from '../src'

type Data = { name: string }

function defineValidators<const T extends FormValidators<Data>>(
  validators: T,
): T {
  return validators
}

function defineGroupValidators<const T extends FormGroupValidators<Data>>(
  validators: T,
): T {
  return validators
}

describe('validator output types', () => {
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
          readonly [{ name: string }, number, undefined, { name: string }]
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

    expectTypeOf<ToFormErrorTypes<typeof validators, never>>().toEqualTypeOf<{
      readonly formError: never
      readonly fieldError: { message: string; code: number }
    }>()
    expectTypeOf<ToFormOutputs<typeof validators>>().toEqualTypeOf<
      readonly [
        {
          message: string
          fields: { name: { message: string; payloadOnly: boolean } }
        },
      ]
    >()

    const outputOnly = defineValidators([
      { run: ({ createOutput }) => createOutput('data'), triggers: [] },
    ])
    expectTypeOf<ToFormErrorTypes<typeof outputOnly, never>>().toEqualTypeOf<{
      readonly formError: never
      readonly fieldError: never
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

    expectTypeOf<ToFormOutputs<typeof validators>>().toEqualTypeOf<
      readonly [
        number | undefined,
        number | undefined,
        number | undefined,
        undefined,
      ]
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
        }): ValidationOutput<number> | ValidationErrorMap<Data> =>
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

    expectTypeOf<ToFormOutputs<typeof validators>>().toEqualTypeOf<
      readonly [
        number | undefined,
        number | undefined,
        number,
        number,
        number | undefined,
        number,
        number | undefined,
        number,
      ]
    >()
    type Errors = ToFormErrorTypes<typeof validators, never>
    expectTypeOf<ValidationIssue>().toExtend<Errors['formError']>()
    expectTypeOf<ValidationIssue>().toExtend<Errors['fieldError']>()
    expectTypeOf<Errors['fieldError']>().toExtend<ValidationIssue>()
  })

  it('preserves submit eligibility and conservative broad validator outputs', () => {
    const validators = defineValidators([
      {
        run: ({ createOutput }) => createOutput(1),
        triggers: [],
        runOnSubmit: false,
      },
      {
        run: ({ createOutput }) => createOutput(1),
        triggers: [],
        runOnSubmit: true as boolean,
      },
      {
        run: ({ createOutput }) => createOutput(1),
        triggers: [],
        runOnSubmit: () => true,
      },
      {
        run: ({ createOutput }) => createOutput(1),
        triggers: [],
        runOnSubmit: true,
      },
    ])

    expectTypeOf<ToFormOutputs<typeof validators>>().toEqualTypeOf<
      readonly [undefined, number | undefined, number | undefined, number]
    >()
    expectTypeOf<ToFormOutputs<FormValidators<Data>>>().toEqualTypeOf<
      unknown[]
    >()
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
      readonly formError: ValidationIssue
      readonly fieldError: ValidationIssue
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
          runOnSubmit: false,
        },
      ],
    })
    const result = await validateServerValues(options, { name: 'Tony' })
    if (!result.success) throw new Error('Expected success')

    expectTypeOf(result.validatorOutputs).toEqualTypeOf<
      readonly [undefined, number]
    >()
  })

  it('does not expose or accept branded outputs in field validators', () => {
    expectTypeOf<'createOutput'>().not.toExtend<
      keyof FieldValidatorContext<'name', string, Data>
    >()
    type OutputValidator = {
      run: () => ValidationOutput<string>
      triggers: []
    }
    expectTypeOf<readonly [OutputValidator]>().not.toExtend<
      FieldValidators<Data, 'name', string>
    >()
  })
})
