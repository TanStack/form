import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import {
  formOptions,
  serverValidateHelper,
  validateServerValues,
} from '../src'
import type {
  FieldValidators,
  FormOptions,
  FormApi,
  FormGroupValidators,
  FormValidators,
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

    expectTypeOf(result.values).toEqualTypeOf<{ name: string }>()
    expectTypeOf(result.schemaOutputs).toEqualTypeOf<
      readonly [{ nameLength: number }]
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
})
