import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { formOptions, serverValidateHelper, validateServerValues } from '../src'
import type {
  FieldValidators,
  FormOptions,
  FormApi,
  FormGroupValidators,
  FormValidators,
  ServerFormState,
  ServerValidateFrameworkPlugin,
} from '../src'

describe('server validation types', () => {
  it('accepts server validators and preserves schema output inference', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: z
            .object({
              name: z.string(),
            })
            .transform(({ name }) => ({ nameLength: name.length })),
          triggers: ['server'],
        },
      ],
    })

    const result = await validateServerValues(options, { name: 'Tony' })

    if (!result.success) {
      throw new Error('Expected server validation to succeed')
    }

    expectTypeOf(result.values).toEqualTypeOf<{ name: string }>()
    expectTypeOf(result.schemaOutputs).toEqualTypeOf<
      readonly [{ nameLength: number }]
    >()
  })

  it('preserves validator generics on failed server validation results', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => ({
            fields: {
              name: 'Name is required',
            },
          }),
          triggers: ['server'],
        },
      ],
    })

    const result = await validateServerValues(options, { name: '' })

    if (result.success) {
      throw new Error('Expected server validation to fail')
    }

    type Values = { name: string }
    type Validators = NonNullable<typeof options.validators>

    expectTypeOf(result.serverState).toEqualTypeOf<
      ServerFormState<Values, Validators>
    >()
  })

  it('makes formApi optional for validators with server triggers', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: (ctx) => {
            expectTypeOf(ctx.event).toEqualTypeOf<
              'change' | 'blur' | 'submit' | 'server'
            >()
            expectTypeOf(ctx.value).toEqualTypeOf<{ name: string }>()
            expectTypeOf(ctx.formApi).toEqualTypeOf<
              FormApi<{ name: string }, any, any> | undefined
            >()
            // @ts-expect-error formApi can be undefined for server-triggered validators.
            void ctx.formApi.state.values
            return undefined
          },
          triggers: ['server'],
        },
        {
          run: ({ formApi }) => {
            expectTypeOf(formApi).toEqualTypeOf<
              FormApi<{ name: string }, any, any> | undefined
            >()
            return undefined
          },
          triggers: ['server', 'change'],
        },
        {
          run: ({ formApi }) => {
            expectTypeOf(formApi).toEqualTypeOf<
              FormApi<{ name: string }, any, any> | undefined
            >()
            return undefined
          },
          triggers: [],
        },
        {
          run: ({ formApi }) => {
            expectTypeOf(formApi).toEqualTypeOf<
              FormApi<{ name: string }, any, any> | undefined
            >()
            return undefined
          },
          runOnSubmit: ({ formApi }) => {
            expectTypeOf(formApi.state.values).toEqualTypeOf<{
              name: string
            }>()
            return true
          },
          triggerDebounceMs: ({ formApi }) => {
            expectTypeOf(formApi.state.values).toEqualTypeOf<{
              name: string
            }>()
            return 0
          },
          triggers: [],
        },
        {
          run: () => {
            return undefined
          },
          triggers: [],
        },
      ],
    })
  })

  it('rejects server trigger configs and non-form server validators', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => undefined,
          triggers: [
            {
              // @ts-expect-error Server triggers cannot be configured.
              trigger: 'server',
            },
          ],
        },
        {
          run: () => undefined,
          triggers: [],
          // @ts-expect-error Server validation is configured with triggers.
          runOnServer: true,
        },
      ],
    })

    const fieldValidators: FieldValidators<{ name: string }, 'name', string> = [
      {
        run: () => undefined,
        triggers: [
          // @ts-expect-error Field validators cannot use server triggers.
          'server',
        ],
      },
    ]
    const groupValidators: FormGroupValidators<{ name: string }> = [
      {
        run: () => undefined,
        triggers: [
          // @ts-expect-error Form group validators cannot use server triggers.
          'server',
        ],
      },
    ]

    void fieldValidators
    void groupValidators
  })

  it('preserves plugin-customized validator return signatures', () => {
    const plugin = {
      id: 'react-form-test',
      createServerValidate: <
        TFormData,
        const TFormValidators extends FormValidators<TFormData>,
        TSubmitReturn,
      >(
        _options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
      ) => {
        return (values: TFormData) => Promise.resolve(values)
      },
    } satisfies ServerValidateFrameworkPlugin

    const { createServerValidate } = serverValidateHelper({ framework: plugin })
    const validate = createServerValidate(
      formOptions({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => undefined,
            triggers: ['server'],
          },
        ],
      }),
    )

    expectTypeOf(validate).parameter(0).toEqualTypeOf<{ name: string }>()
  })

  it('preserves plugin-customized validator options and form-bound helpers', () => {
    const plugin = {
      id: 'react-form-test',
      createServerValidate: <
        TFormData,
        const TFormValidators extends FormValidators<TFormData>,
        TSubmitReturn,
      >(
        _options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
        _pluginOptions?: { field: keyof TFormData },
      ) => {
        return Object.assign((values: TFormData) => Promise.resolve(values), {
          getState: () =>
            Promise.resolve(
              null as never as ServerFormState<TFormData, TFormValidators>,
            ),
        })
      },
    } satisfies ServerValidateFrameworkPlugin

    const options = formOptions({
      defaultValues: { name: '', age: 0 },
      validators: [
        {
          run: () => undefined,
          triggers: ['server'],
        },
      ],
    })

    const { createServerValidate } = serverValidateHelper({ framework: plugin })
    const validate = createServerValidate(options, { field: 'age' })

    // @ts-expect-error Plugin options are typed against the form values.
    createServerValidate(options, { field: 'missing' })

    expectTypeOf(validate).parameter(0).toEqualTypeOf<{
      name: string
      age: number
    }>()
    expectTypeOf(validate.getState()).toEqualTypeOf<
      Promise<
        ServerFormState<
          { name: string; age: number },
          NonNullable<typeof options.validators>
        >
      >
    >()
  })
})
