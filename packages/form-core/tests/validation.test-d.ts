import { describe, expectTypeOf, it } from 'vitest'
import z from 'zod'
import { InternalFormApi } from '../src/FormApi/FormApi.lib'
import {
  createErrorVisibility,
  createValidator,
  createValidators,
  formOptions,
  createErrorMap as importCreateErrorMap,
} from '../src'
import type {
  AnyFieldApi,
  ErrorVisibilityFieldState,
  FieldApiOptions,
  FieldErrors,
  FieldValidators,
  FormApi,
  FormErrorTypes,
  FormErrors,
  FormGroupValidators,
  FormOptions,
  FormState,
  FormSubmitInvalidContext,
  FormValidators,
  OnSubmitError,
  ParseSubmitIssuesFn,
  ReusableErrorVisibilityState,
  StandardSchemaV1Issue,
  ToFieldError,
  ToFormErrorTypes,
  ToFormGroupErrorTypes,
  ToFormGroupSchemaOutputs,
  ToFormSchemaOutputs,
  ValidationErrorMap,
  ValidationIssue,
} from '../src'

type TestFormData = {
  name: string
}

// InternalFormApi does some `any` shenanigans. Usually okay, but for type tests it sucks.
// Hopefully this identity function approach isn't too much of a headache in the future.

function defineFormValidators<
  const TValidators extends FormValidators<TestFormData>,
>(validators: TValidators): TValidators {
  return validators
}

function defineFieldValidators<
  const TValidators extends FieldValidators<TestFormData, 'name', string>,
>(validators: TValidators): TValidators {
  return validators
}

function defineGroupValidators<
  const TValidators extends FormGroupValidators<TestFormData>,
>(validators: TValidators): TValidators {
  return validators
}

const emptyFormValidators = defineFormValidators([])
const emptyFieldValidators = defineFieldValidators([])

type TestFormErrors<
  TFormValidators extends FormValidators<any>,
  TSubmitReturn,
> = FormErrors<ToFormErrorTypes<TFormValidators, TSubmitReturn>>

type TestFieldErrors<
  TFieldValidators extends FieldValidators<any, any, any>,
  TGroupValidators extends FormGroupValidators<any>,
  TFormValidators extends FormValidators<any>,
  TSubmitReturn,
> = FieldErrors<
  ToFieldError<
    TFieldValidators,
    ToFormGroupErrorTypes<TGroupValidators>['fieldError'],
    ToFormErrorTypes<TFormValidators, TSubmitReturn>
  >
>

describe('formOptions', () => {
  it('infers form data from defaultValues', () => {
    const options = formOptions({
      defaultValues: {
        name: '',
        age: 0,
      },
      validators: [],
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<{
      name: string
      age: number
    }>()
  })

  it('infers form data from a strict schema', () => {
    const options = formOptions.strictSchema({
      defaultValues: { name: '' },
      validators: [
        {
          run: z.object({ name: z.string() }),
          triggers: ['change'],
        },
      ],
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<{ name: string }>()
  })

  it('infers schema input and output from schema-only validators', () => {
    const schema = z.object({ age: z.string().transform(Number) })
    const options = formOptions.strictSchema({
      defaultValues: { age: '' },
      validators: [{ run: schema, triggers: ['change'] }],
      onSubmit: ({ value, schemaOutputs }) => {
        expectTypeOf(value).toEqualTypeOf<{ age: string }>()
        expectTypeOf(schemaOutputs).toEqualTypeOf<readonly [{ age: number }]>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<{ age: string }>()
  })

  it('types callback values when mixed with a strict schema', () => {
    type StrictValue = {
      name: string
      age: string
    }
    const schema = z.object({
      name: z.string(),
      age: z.string().transform(Number),
    })

    const options = formOptions.strictSchema(schema, {
      defaultValues: { name: '', age: '' },
      validators: [
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<StrictValue>()
            return value.name.length === 0 ? 'Name is required' : undefined
          },
          triggers: ['change'],
        },
        {
          run: schema,
          triggers: ['change'],
        },
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<StrictValue>()
            return value.age.length === 0 ? 'Age is required' : undefined
          },
          triggers: ['blur'],
        },
      ],
      onSubmit: ({ value, schemaOutputs }) => {
        expectTypeOf(value).toEqualTypeOf<StrictValue>()
        expectTypeOf(schemaOutputs).toEqualTypeOf<
          readonly [undefined, { name: string; age: number }, undefined]
        >()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<StrictValue>()
  })

  it('types callback-only validators from a strict schema argument', () => {
    type StrictValue = { name: string }
    const schema = z.object({ name: z.string() })
    const options = formOptions.strictSchema(schema, {
      defaultValues: { name: '' },
      validators: [
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<StrictValue>()
            return value.name.length === 0 ? 'Name is required' : undefined
          },
          triggers: ['change'],
        },
      ],
      onSubmit: ({ schemaOutputs }) => {
        expectTypeOf(schemaOutputs).toEqualTypeOf<readonly [undefined]>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<StrictValue>()
  })

  it('types strict options without validators from a schema argument', () => {
    type StrictValue = { name: string }
    const schema = z.object({ name: z.string() })
    const options = formOptions.strictSchema(schema, {
      defaultValues: { name: '' },
      errorVisibility: ({ state }) => {
        expectTypeOf(state.values).toEqualTypeOf<StrictValue>()
        return state.values.name.length > 0
      },
      listeners: [
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<StrictValue>()
          },
          triggers: ['change'],
        },
      ],
      onSubmit: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<StrictValue>()
      },
      onSubmitInvalid: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<StrictValue>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<StrictValue>()
  })

  it('rejects parsed output as strict schema defaults', () => {
    const schema = z.object({ age: z.string().transform(Number) })

    formOptions.strictSchema(schema, {
      defaultValues: {
        // @ts-expect-error Strict defaults must match the schema input.
        age: 0,
      },
    })
  })

  it('allows loose schema defaults to omit properties', () => {
    const options = formOptions.looseSchema({
      defaultValues: {
        address: {
          city: null,
        },
      },
      validators: [
        {
          run: z.object({
            name: z.string(),
            address: z.object({
              city: z.string(),
              postcode: z.number(),
            }),
          }),
          triggers: ['change'],
        },
      ],
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<{
      name: string | undefined
      address: {
        city: string | null
        postcode: number | undefined
      }
    }>()
  })

  it('types callback values when mixed with a loose schema', () => {
    type LooseValue = {
      name: string
      age: string | null
    }
    const schema = z.object({
      name: z.string(),
      age: z.string().transform(Number),
    })

    const options = formOptions.looseSchema(schema, {
      defaultValues: { name: '', age: null },
      validators: [
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<LooseValue>()
            return value.name.length === 0 ? 'Name is required' : undefined
          },
          triggers: ['change'],
        },
        {
          run: schema,
          triggers: ['change'],
        },
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<LooseValue>()
            return value.age !== null && value.age.length === 0
              ? 'Age is required'
              : undefined
          },
          triggers: ['blur'],
        },
      ],
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<LooseValue>()
  })

  it('types callback-only validators with omitted loose defaults', () => {
    type LooseValue = {
      name: string | undefined
      address: {
        city: string | null
        postcode: number | undefined
      }
    }
    const schema = z.object({
      name: z.string(),
      address: z.object({
        city: z.string(),
        postcode: z.number(),
      }),
    })
    const options = formOptions.looseSchema(schema, {
      defaultValues: { address: { city: null } },
      validators: [
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<LooseValue>()
            return value.name === undefined ? 'Name is required' : undefined
          },
          triggers: ['change'],
        },
      ],
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<LooseValue>()
  })

  it('types loose options without validators from a schema argument', () => {
    type LooseValue = { name: string; age: string | null }
    const schema = z.object({ name: z.string(), age: z.string() })
    const options = formOptions.looseSchema(schema, {
      defaultValues: { name: '', age: null },
      errorVisibility: ({ state }) => {
        expectTypeOf(state.values).toEqualTypeOf<LooseValue>()
        return state.values.name.length > 0
      },
      listeners: [
        {
          run: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<LooseValue>()
          },
          triggers: ['change'],
        },
      ],
      onSubmit: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<LooseValue>()
      },
      onSubmitInvalid: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<LooseValue>()
      },
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<LooseValue>()
  })

  it('rejects values outside the editable loose schema shape', () => {
    const schema = z.object({ age: z.string() })

    formOptions.looseSchema(schema, {
      defaultValues: {
        // @ts-expect-error Loose defaults must remain editable schema values.
        age: false,
      },
    })
  })
})

describe('ErrorVisibility', () => {
  it('types callback scoped and pre-visibility field state', () => {
    const options: FormOptions<
      TestFormData,
      typeof emptyFormValidators,
      never,
      unknown
    > = {
      defaultValues: { name: '' },
      errorVisibility: ({ state, fieldState }) => {
        expectTypeOf(state).toEqualTypeOf<
          FormState<
            TestFormData,
            ToFormErrorTypes<typeof emptyFormValidators, unknown>
          >
        >()
        expectTypeOf(fieldState).toEqualTypeOf<ErrorVisibilityFieldState>()
        expectTypeOf(fieldState.value).toEqualTypeOf<any>()
        expectTypeOf(state.isDefaultValue).toEqualTypeOf<boolean>()
        expectTypeOf(fieldState.meta.isDefaultValue).toEqualTypeOf<boolean>()
        // @ts-expect-error Filtered error output is not available while deciding visibility.
        void fieldState.meta.errors
        // @ts-expect-error Validity depends on the visibility decision.
        void fieldState.meta.isValid
        return state.isTouched && fieldState.meta.isTouched
      },
    }
    const fieldOptions: FieldApiOptions<
      TestFormData,
      'name',
      string,
      typeof emptyFieldValidators,
      [],
      TestFormData,
      ToFormErrorTypes<typeof emptyFormValidators, unknown>
    > = {
      name: 'name',
      errorVisibility: ({ fieldState }) => fieldState.value === '',
    }

    void options
    void fieldOptions
  })

  it('creates form-agnostic reusable visibility callbacks', () => {
    const showErrorsAfterBlurOrSubmit = createErrorVisibility(
      ({ state, fieldState }) => {
        expectTypeOf(state).toEqualTypeOf<ReusableErrorVisibilityState>()
        expectTypeOf(state.values).toEqualTypeOf<unknown>()
        expectTypeOf(fieldState).toEqualTypeOf<ErrorVisibilityFieldState>()
        // @ts-expect-error Reusable policies cannot assume a consuming form value shape.
        void state.values.name
        return fieldState.meta.isBlurred || state.submissionAttempts > 0
      },
    )

    void formOptions({
      defaultValues: { name: '' },
      errorVisibility: showErrorsAfterBlurOrSubmit,
    })
    void formOptions({
      defaultValues: { count: 0 },
      errorVisibility: showErrorsAfterBlurOrSubmit,
    })
  })

  it('exposes isDefaultValue through state and meta only', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    expectTypeOf(form.state.isDefaultValue).toEqualTypeOf<boolean>()
    expectTypeOf(field.meta.isDefaultValue).toEqualTypeOf<boolean>()
    // @ts-expect-error isDefaultValue lives on form.state.
    void form.isDefaultValue
    // @ts-expect-error isDefaultValue lives on field.meta.
    void field.isDefaultValue
  })

  it('preserves schema-driven inference with reusable policies', () => {
    const showErrorsAfterSubmit = createErrorVisibility(
      ({ state }) => state.submissionAttempts > 0,
    )
    const options = formOptions.strictSchema({
      defaultValues: { name: '' },
      validators: [
        {
          run: z.object({ name: z.string() }),
          triggers: ['change'],
        },
      ],
      errorVisibility: showErrorsAfterSubmit,
    })

    expectTypeOf(options.defaultValues).toEqualTypeOf<{ name: string }>()
  })

  it('rejects removed string presets', () => {
    const formOpts: FormOptions<
      TestFormData,
      typeof emptyFormValidators,
      never,
      unknown
    > = {
      defaultValues: { name: '' },
      // @ts-expect-error String visibility presets were replaced by callbacks.
      errorVisibility: 'touched',
    }
    const fieldOptions: FieldApiOptions<
      TestFormData,
      'name',
      string,
      typeof emptyFieldValidators,
      [],
      TestFormData,
      ToFormErrorTypes<typeof emptyFormValidators, unknown>
    > = {
      name: 'name',
      // @ts-expect-error String visibility presets were replaced by callbacks.
      errorVisibility: 'always',
    }

    void formOpts
    void fieldOptions
  })
})

describe('createErrorMap', () => {
  it('creates a typed error map shape', () => {
    type ErrorMapFormData = {
      name: string
      user: {
        age: number
      }
    }

    const errors = importCreateErrorMap<ErrorMapFormData>()
    const initial: ValidationErrorMap<ErrorMapFormData> = {
      form: 'Initial form error',
      fields: { name: 'Initial name error' },
    }

    expectTypeOf(errors).toEqualTypeOf<ValidationErrorMap<ErrorMapFormData>>()
    expectTypeOf(importCreateErrorMap<ErrorMapFormData>(initial)).toEqualTypeOf<
      ValidationErrorMap<ErrorMapFormData>
    >()
    expectTypeOf(
      importCreateErrorMap<ErrorMapFormData>({ form: 'Partial form error' }),
    ).toEqualTypeOf<ValidationErrorMap<ErrorMapFormData>>()

    errors.form = 'Form error'
    errors.fields.name = 'Name is required'
    errors.fields['user.age'] = { message: 'Age is required' }
    // @ts-expect-error Error map fields must use valid form keys.
    errors.fields.missing = 'Missing'
  })

  it('infers the error map shape from form validator context', () => {
    const validators = defineFormValidators([
      {
        run: ({ createErrorMap }) => {
          const errors = createErrorMap({ form: 'Form error' })

          errors.fields.name = 'Name is required'
          // @ts-expect-error Error map fields must use valid form keys.
          errors.fields.missing = 'Missing'

          return errors
        },
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFieldErrors<[], [], typeof validators, never>
    >().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('accepts a partial initial error map from group validator context', () => {
    const validators = defineGroupValidators([
      {
        run: ({ createErrorMap }) => {
          const errors = createErrorMap({ form: 'Group error' })

          errors.fields.name = 'Name is required'
          // @ts-expect-error Error map fields must use valid group keys.
          errors.fields.missing = 'Missing'

          return errors
        },
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFieldErrors<[], typeof validators, [], never>
    >().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('allows validators to return error maps directly', () => {
    const validators = defineFormValidators([
      {
        run: ({ createErrorMap }) => {
          const errors = createErrorMap()

          errors.fields.name = 'Name is required'

          return errors
        },
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFieldErrors<[], [], typeof validators, never>
    >().toEqualTypeOf<Array<ValidationIssue>>()
  })
})

describe('ValidationTriggerOption', () => {
  it('provides scope-specific predicate owner APIs', () => {
    defineFormValidators([
      {
        run: () => undefined,
        triggers: [
          {
            trigger: 'change',
            when: (context) => {
              expectTypeOf(context.scope).toEqualTypeOf<'form'>()
              expectTypeOf(context.groupApi).toEqualTypeOf<undefined>()
              expectTypeOf(context.fieldApi).toEqualTypeOf<
                AnyFieldApi | undefined
              >()
              return context.formApi.state.submissionAttempts > 0
            },
          },
        ],
      },
    ])

    defineGroupValidators([
      {
        run: () => undefined,
        triggers: [
          {
            trigger: 'change',
            when: (context) => {
              expectTypeOf(context.scope).toEqualTypeOf<'group'>()
              expectTypeOf(context.groupApi).not.toBeUndefined()
              expectTypeOf(context.fieldApi).toEqualTypeOf<
                AnyFieldApi | undefined
              >()
              return context.groupApi.state.submissionAttempts > 0
            },
          },
        ],
      },
    ])

    defineFieldValidators([
      {
        run: () => undefined,
        triggers: [
          {
            trigger: 'change',
            when: (context) => {
              expectTypeOf(context.scope).toEqualTypeOf<'field'>()
              expectTypeOf(context.groupApi).toEqualTypeOf<undefined>()
              expectTypeOf(context.fieldApi).not.toBeUndefined()
              return context.fieldApi.meta.isInvalid
            },
          },
        ],
      },
    ])
  })

  it('narrows scope-agnostic reusable predicate contexts', () => {
    createValidator({
      triggers: [
        {
          trigger: 'change',
          when: (context) => {
            if (context.scope === 'group') {
              return context.groupApi.state.submissionAttempts > 0
            }
            if (context.scope === 'field') {
              return context.fieldApi.meta.isInvalid
            }
            return context.formApi.state.submissionAttempts > 0
          },
        },
      ],
    })
  })

  it('allows string server triggers on form validators only', () => {
    defineFormValidators([
      {
        run: ({ formApi }) => {
          expectTypeOf(formApi).toEqualTypeOf<
            FormApi<TestFormData, any> | undefined
          >()
          // @ts-expect-error formApi can be undefined for server-triggered validators.
          void formApi.state.values
          return undefined
        },
        triggers: ['server'],
      },
      {
        run: ({ formApi }) => {
          expectTypeOf(formApi).toEqualTypeOf<
            FormApi<TestFormData, any> | undefined
          >()
          return undefined
        },
        triggers: ['server', 'change'],
      },
      {
        run: ({ formApi }) => {
          expectTypeOf(formApi).toEqualTypeOf<
            FormApi<TestFormData, any> | undefined
          >()
          return undefined
        },
        triggers: ['change'],
      },
      {
        run: () => undefined,
        triggers: [
          {
            // @ts-expect-error Server triggers cannot be configured.
            trigger: 'server',
          },
        ],
      },
    ])

    defineFieldValidators([
      {
        run: () => undefined,
        triggers: [
          // @ts-expect-error Field validators cannot use server triggers.
          'server',
        ],
      },
      {
        run: () => undefined,
        triggers: [
          {
            // @ts-expect-error Field validators cannot use server trigger configs.
            trigger: 'server',
          },
        ],
      },
    ])

    defineGroupValidators([
      {
        run: () => undefined,
        triggers: [
          // @ts-expect-error Form group validators cannot use server triggers.
          'server',
        ],
      },
      {
        run: () => undefined,
        triggers: [
          {
            // @ts-expect-error Form group validators cannot use server trigger configs.
            trigger: 'server',
          },
        ],
      },
    ])

    createValidator({
      triggers: ['server'],
    })

    createValidator({
      triggers: [
        {
          // @ts-expect-error Server triggers cannot be configured.
          trigger: 'server',
        },
      ],
    })
  })
})

describe('FormErrors', () => {
  it('exposes only value and formApi in the invalid submit context', () => {
    expectTypeOf<
      keyof FormSubmitInvalidContext<TestFormData, FormErrorTypes>
    >().toEqualTypeOf<'value' | 'formApi'>()

    const form = new InternalFormApi({
      defaultValues: { name: '' },
      onSubmitInvalid: (context) => {
        expectTypeOf(context.value).toEqualTypeOf<{ name: string }>()
        expectTypeOf(context.formApi.state.values).toEqualTypeOf<{
          name: string
        }>()
        expectTypeOf<keyof typeof context>().toEqualTypeOf<
          'value' | 'formApi'
        >()
      },
    })

    void form
  })

  it('should fall back omitted submit errors to ValidationIssue submit meta', () => {
    expectTypeOf<ToFormErrorTypes<[], unknown>>().not.toBeAny()
    expectTypeOf<TestFormErrors<[], unknown>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })

  it('should allow inference for a form', () => {
    const withRequiredValue = createValidator({
      triggers: [
        {
          trigger: 'change',
          when: ({ formApi }) => formApi.state.submissionAttempts > 0,
        },
      ],
      runOnSubmit: true,
    })

    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [withRequiredValue(z.object({ name: z.string() }))],
      onSubmit: ({ schemaOutputs }) => {
        expectTypeOf(schemaOutputs).toEqualTypeOf<readonly [{ name: string }]>()
      },
    })

    expectTypeOf(form.defaultValues).toEqualTypeOf<{ name: string }>()
  })

  it('should preserve run arity when creating a validator array', () => {
    const withRequiredValue = createValidators([
      {
        triggers: [
          {
            trigger: 'change',
            when: ({ formApi }) => formApi.state.submissionAttempts > 0,
          },
        ],
        runOnSubmit: true,
      },
      {
        triggers: [
          {
            trigger: 'change',
            when: ({ formApi }) => formApi.state.submissionAttempts > 0,
          },
        ],
        runOnSubmit: true,
        bailIfInvalid: true,
      },
    ])

    // @ts-expect-error createValidators requires one run argument per option.
    withRequiredValue()

    // @ts-expect-error createValidators requires one run argument per option.
    withRequiredValue(z.object({ name: z.string() }))

    const endpointValidator = () => ({
      message: 'From helper',
      helper: true as const,
    })
    const extraValidator = () => ({ message: 'Extra' })

    withRequiredValue(
      z.object({ name: z.string() }),
      endpointValidator,
      // @ts-expect-error createValidators requires one run argument per option.
      extraValidator,
    )

    const validators = withRequiredValue(
      z.object({ name: z.string() }),
      endpointValidator,
    )

    expectTypeOf(validators.length).toEqualTypeOf<2>()
    expectTypeOf(validators[1].bailIfInvalid).toEqualTypeOf<true>()

    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators,
      onSubmit: ({ schemaOutputs }) => {
        expectTypeOf(schemaOutputs).toEqualTypeOf<
          readonly [{ name: string }, undefined]
        >()
      },
    })

    expectTypeOf(form.defaultValues).toEqualTypeOf<{ name: string }>()
  })

  it('should infer the error type from the validator', () => {
    const validators = defineFormValidators([
      { run: () => ({ message: 'My error', additional: 0 }), triggers: [] },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<{ message: string; additional: number }>
    >()

    const strictValidators = defineFormValidators([
      { run: () => ({ message: 'My error' as const }), triggers: [] },
    ])

    expectTypeOf<
      TestFormErrors<typeof strictValidators, never>
    >().toEqualTypeOf<Array<{ message: 'My error' }>>()
  })

  it('should normalize string errors', () => {
    const validators = defineFormValidators([
      { run: () => 'My error', triggers: [] },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })

  it('should normalize string array errors', () => {
    const validators = defineFormValidators([
      { run: () => ['First error', 'Second error'], triggers: [] },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })

  it('should normalize async errors', () => {
    const validators = defineFormValidators([
      { run: async () => ['First error', 'Second error'], triggers: [] },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })

  it('should preserve custom error arrays', () => {
    const validators = defineFormValidators([
      { run: () => [{ message: 'My error', code: 123 }], triggers: [] },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<{ message: string; code: number }>
    >()
  })

  it('should exclude valid validation results', () => {
    const validValidators = defineFormValidators([
      { run: () => null, triggers: [] },
      { run: () => undefined, triggers: [] },
      { run: () => false, triggers: [] },
    ])

    expectTypeOf<TestFormErrors<typeof validValidators, never>>().toEqualTypeOf<
      Array<never>
    >()

    const mixedValidators = defineFormValidators([
      { run: () => null, triggers: [] },
      {
        run: () => ({ message: 'My error', fromInvalid: true as const }),
        triggers: [],
      },
    ])

    expectTypeOf<TestFormErrors<typeof mixedValidators, never>>().toEqualTypeOf<
      Array<{ message: string; fromInvalid: true }>
    >()
  })

  it('should support standard schemas', () => {
    const validators = defineFormValidators([
      {
        run: z.object({
          name: z.string(),
        }),
        triggers: [],
      },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<StandardSchemaV1Issue>
    >()
  })

  it('should infer form errors from parsed Standard Schema issues', () => {
    const validators = defineFormValidators([
      {
        run: ({ parseIssues }) => parseIssues([{ message: '' }]),
        triggers: [],
      },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<StandardSchemaV1Issue>
    >()
  })

  it('should combine errors from multiple validators', () => {
    const validators = defineFormValidators([
      { run: () => ({ message: '', fromA: true as const }), triggers: [] },
      { run: () => ({ message: '', fromB: true as const }), triggers: [] },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<{ message: string; fromA: true } | { message: string; fromB: true }>
    >()
  })

  it('should combine schema and function validator errors', () => {
    const validators = defineFormValidators([
      { run: z.object({ name: z.string() }), triggers: [] },
      {
        run: () => ({ message: '', fromFunction: true as const }),
        triggers: [],
      },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<StandardSchemaV1Issue | { message: string; fromFunction: true }>
    >()
  })

  it('should infer issues with fields metadata as form errors', () => {
    const validators = defineFormValidators([
      { run: () => ({ message: 'Required', fields: {} }), triggers: [] },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<{ message: string; fields: {} }>
    >()
  })

  it('should extract error map errors', () => {
    const stringValidators = defineFormValidators([
      {
        run: () => ({ form: 'Custom', fields: { name: 'Too short' } }),
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFormErrors<typeof stringValidators, never>
    >().toEqualTypeOf<Array<ValidationIssue>>()

    const customValidators = defineFormValidators([
      {
        run: () => ({
          form: { message: 'Custom', errorCount: 5 },
          fields: { name: 'Too short' },
        }),
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFormErrors<typeof customValidators, never>
    >().toEqualTypeOf<Array<{ message: string; errorCount: number }>>()
  })

  it('should extract error maps with only field errors', () => {
    const validators = defineFormValidators([
      {
        run: () => ({
          fields: { name: { message: '', fieldOnly: true as const } },
        }),
        triggers: [],
      },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<never>
    >()
  })

  it('should extract form errors from an empty-field error map', () => {
    const validators = defineFormValidators([
      { run: () => ({ form: 'Form error', fields: {} }), triggers: [] },
    ])

    expectTypeOf<TestFormErrors<typeof validators, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })

  it('should infer submit errors', () => {
    type SubmitReturn = OnSubmitError<{
      message: string
      fromSubmit: true
    }>

    expectTypeOf<TestFormErrors<[], SubmitReturn>>().toEqualTypeOf<
      Array<{ message: string; fromSubmit: true }>
    >()
  })

  it('should infer error map submit errors', () => {
    type SubmitReturn = OnSubmitError<{
      form: { message: string; formOnly: true }
      fields: { name: { message: string; fieldOnly: true } }
    }>

    expectTypeOf<TestFormErrors<[], SubmitReturn>>().toEqualTypeOf<
      Array<{ message: string; formOnly: true }>
    >()
  })

  it('should infer submit errors from parsed Standard Schema issues', () => {
    type SubmitReturn = ReturnType<ParseSubmitIssuesFn<TestFormData>>

    expectTypeOf<TestFormErrors<[], SubmitReturn>>().toEqualTypeOf<
      Array<StandardSchemaV1Issue>
    >()

    new InternalFormApi({
      defaultValues: { name: '' },
      onSubmit: ({ parseIssues }) => {
        return parseIssues([{ message: '' }])
      },
    })
  })

  it('should infer async error map submit errors', () => {
    type SubmitReturn = Promise<
      | OnSubmitError<{
          form: { message: string; formOnly: true }
          fields: { name: { message: string; fieldOnly: true } }
        }>
      | undefined
    >

    expectTypeOf<TestFormErrors<[], SubmitReturn>>().toEqualTypeOf<
      Array<{ message: string; formOnly: true }>
    >()
  })

  it('should normalize submit string errors', () => {
    expectTypeOf<TestFormErrors<[], OnSubmitError<string>>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()

    expectTypeOf<
      TestFormErrors<[], OnSubmitError<Array<string>>>
    >().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('should ignore broad validators and preserve the submit fallback', () => {
    expectTypeOf<TestFormErrors<any, never>>().toEqualTypeOf<Array<never>>()

    expectTypeOf<TestFormErrors<any, any>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })
})

describe('FieldErrors', () => {
  it('should infer field-level validator errors', () => {
    const fieldValidators = defineFieldValidators([
      { run: () => ({ message: '', fieldOnly: true as const }), triggers: [] },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof fieldValidators,
        [],
        typeof emptyFormValidators,
        never
      >
    >().toEqualTypeOf<Array<{ message: string; fieldOnly: true }>>()
  })

  it('should infer field errors from form validator error maps', () => {
    const formValidators = defineFormValidators([
      {
        run: () => ({
          form: { message: '', formOnly: true },
          fields: { name: { message: '', fieldOnly: true as const } },
        }),
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof emptyFieldValidators,
        [],
        typeof formValidators,
        never
      >
    >().toEqualTypeOf<Array<{ message: string; fieldOnly: true }>>()
  })

  it('should infer field errors from group validator error maps', () => {
    const groupValidators = defineGroupValidators([
      {
        run: () => ({
          form: { message: '', groupOnly: true },
          fields: { name: { message: '', fromGroup: true as const } },
        }),
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof emptyFieldValidators,
        typeof groupValidators,
        typeof emptyFormValidators,
        never
      >
    >().toEqualTypeOf<Array<{ message: string; fromGroup: true }>>()
  })

  it('should combine form error map and field validator errors', () => {
    const formValidators = defineFormValidators([
      {
        run: () => ({
          form: 'Form error',
          fields: { name: { message: '', fromForm: true as const } },
        }),
        triggers: [],
      },
    ])

    const fieldValidators = defineFieldValidators([
      { run: () => ({ message: '', fromField: true as const }), triggers: [] },
    ])

    expectTypeOf<
      TestFieldErrors<typeof fieldValidators, [], typeof formValidators, never>
    >().toEqualTypeOf<
      Array<
        | { message: string; fromForm: true }
        | { message: string; fromField: true }
      >
    >()
  })

  it('should normalize string field errors', () => {
    const formValidators = defineFormValidators([
      {
        run: () => ({ form: 'Form error', fields: { name: 'Field error' } }),
        triggers: [],
      },
    ])

    const fieldValidators = defineFieldValidators([
      { run: () => 'Field error', triggers: [] },
    ])

    expectTypeOf<
      TestFieldErrors<typeof fieldValidators, [], typeof formValidators, never>
    >().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('should preserve custom field error arrays', () => {
    const fieldValidators = defineFieldValidators([
      { run: () => [{ message: 'My error', code: 123 }], triggers: [] },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof fieldValidators,
        [],
        typeof emptyFormValidators,
        never
      >
    >().toEqualTypeOf<Array<{ message: string; code: number }>>()
  })

  it('should exclude valid validation results', () => {
    const fieldValidators = defineFieldValidators([
      { run: () => null, triggers: [] },
      { run: () => undefined, triggers: [] },
      { run: () => false, triggers: [] },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof fieldValidators,
        [],
        typeof emptyFormValidators,
        never
      >
    >().toEqualTypeOf<Array<ValidationIssue>>()

    const mixedFieldValidators = defineFieldValidators([
      { run: () => null, triggers: [] },
      {
        run: () => ({ message: 'My error', fromInvalid: true as const }),
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof mixedFieldValidators,
        [],
        typeof emptyFormValidators,
        never
      >
    >().toEqualTypeOf<Array<{ message: string; fromInvalid: true }>>()
  })

  it('should support standard schemas', () => {
    const formSchema = z.object({ name: z.string() })
    const fieldSchema = z.string()

    const formValidators = defineFormValidators([
      { run: formSchema, triggers: [] },
    ])

    const fieldValidators = defineFieldValidators([
      { run: fieldSchema, triggers: [] },
    ])

    expectTypeOf<
      TestFieldErrors<typeof fieldValidators, [], typeof formValidators, never>
    >().toEqualTypeOf<Array<StandardSchemaV1Issue>>()
  })

  it('should infer field errors from parsed Standard Schema issues', () => {
    const fieldValidators = defineFieldValidators([
      {
        run: ({ parseIssues }) => parseIssues([{ message: '' }]),
        triggers: [],
      },
    ])

    const formValidators = defineFormValidators([
      {
        run: ({ parseIssues }) =>
          parseIssues([{ message: '', path: ['name'] }]),
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFieldErrors<typeof fieldValidators, [], typeof formValidators, never>
    >().toEqualTypeOf<Array<StandardSchemaV1Issue>>()
  })

  it('should infer field errors from group standard schemas', () => {
    const groupSchema = z.object({ name: z.string() })
    const groupValidators = defineGroupValidators([
      { run: groupSchema, triggers: [] },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof emptyFieldValidators,
        typeof groupValidators,
        typeof emptyFormValidators,
        never
      >
    >().toEqualTypeOf<Array<StandardSchemaV1Issue>>()
  })

  it('should infer field errors from group parsed Standard Schema issues', () => {
    const groupValidators = defineGroupValidators([
      {
        run: ({ parseIssues }) =>
          parseIssues([{ message: '', path: ['name'] }]),
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof emptyFieldValidators,
        typeof groupValidators,
        typeof emptyFormValidators,
        never
      >
    >().toEqualTypeOf<Array<StandardSchemaV1Issue>>()
  })

  it('should combine errors from multiple field validators', () => {
    const fieldValidators = defineFieldValidators([
      { run: () => ({ message: '', fromA: true as const }), triggers: [] },
      { run: () => ({ message: '', fromB: true as const }), triggers: [] },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof fieldValidators,
        [],
        typeof emptyFormValidators,
        never
      >
    >().toEqualTypeOf<
      Array<{ message: string; fromA: true } | { message: string; fromB: true }>
    >()
  })

  it('should combine schema and function validator errors', () => {
    const fieldValidators = defineFieldValidators([
      { run: z.string(), triggers: [] },
      {
        run: () => ({ message: '', fromFunction: true as const }),
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof fieldValidators,
        [],
        typeof emptyFormValidators,
        never
      >
    >().toEqualTypeOf<
      Array<StandardSchemaV1Issue | { message: string; fromFunction: true }>
    >()
  })

  it('should extract field errors from form validator error maps with no form error', () => {
    const formValidators = defineFormValidators([
      {
        run: () => ({
          fields: { name: { message: '', fieldOnly: true as const } },
        }),
        triggers: [],
      },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof emptyFieldValidators,
        [],
        typeof formValidators,
        never
      >
    >().toEqualTypeOf<Array<{ message: string; fieldOnly: true }>>()
  })

  it('should ignore empty error maps', () => {
    const formValidators = defineFormValidators([
      { run: () => ({ form: 'Form error', fields: {} }), triggers: [] },
    ])

    expectTypeOf<
      TestFieldErrors<
        typeof emptyFieldValidators,
        [],
        typeof formValidators,
        never
      >
    >().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('should infer field errors from submit returns', () => {
    type SubmitReturn = OnSubmitError<{
      form: { message: string; formOnly: true }
      fields: { name: { message: string; fieldOnly: true } }
    }>

    expectTypeOf<
      TestFieldErrors<
        typeof emptyFieldValidators,
        [],
        typeof emptyFormValidators,
        SubmitReturn
      >
    >().toEqualTypeOf<Array<{ message: string; fieldOnly: true }>>()
  })

  it('should infer field errors from async submit returns', () => {
    type SubmitReturn = Promise<
      | OnSubmitError<{
          form: { message: string; formOnly: true }
          fields: { name: { message: string; fieldOnly: true } }
        }>
      | undefined
    >

    expectTypeOf<
      TestFieldErrors<
        typeof emptyFieldValidators,
        [],
        typeof emptyFormValidators,
        SubmitReturn
      >
    >().toEqualTypeOf<Array<{ message: string; fieldOnly: true }>>()
  })

  it('should normalize submit string field errors', () => {
    expectTypeOf<
      TestFieldErrors<
        typeof emptyFieldValidators,
        [],
        typeof emptyFormValidators,
        OnSubmitError<string>
      >
    >().toEqualTypeOf<Array<ValidationIssue>>()

    expectTypeOf<
      TestFieldErrors<
        typeof emptyFieldValidators,
        [],
        typeof emptyFormValidators,
        OnSubmitError<Array<string>>
      >
    >().toEqualTypeOf<Array<ValidationIssue>>()
  })

  it('should fall back to ValidationIssue if `any` was used', () => {
    expectTypeOf<TestFieldErrors<any, any, any, never>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()

    expectTypeOf<TestFieldErrors<any, any, any, any>>().toEqualTypeOf<
      Array<ValidationIssue>
    >()
  })
})

describe('validator type transforms', () => {
  it('it should transform a schema', () => {
    const vs = defineFormValidators([
      {
        run: z.object({ name: z.string() }),
        triggers: [],
      },
    ])

    type Outputs = ToFormSchemaOutputs<typeof vs>
    type Errors = ToFormErrorTypes<typeof vs, never>

    expectTypeOf<Outputs>().toEqualTypeOf<readonly [{ name: string }]>()
    expectTypeOf<Errors>().toEqualTypeOf<
      FormErrorTypes<StandardSchemaV1Issue, StandardSchemaV1Issue>
    >()
  })

  it('it should transform based on runOnSubmit', () => {
    const vs = defineFormValidators([
      {
        run: z.object({ name: z.string() }),
        triggers: [],
      },
      {
        run: z.object({ name: z.string() }),
        triggers: [],
        runOnSubmit: false,
      },
      {
        run: z.object({ name: z.string() }),
        triggers: [],
        runOnSubmit: true,
      },
      {
        run: z.object({ name: z.string() }),
        triggers: ['server'],
      },
      {
        run: z.object({ name: z.string() }),
        triggers: ['server'],
        runOnSubmit: true,
      },
      {
        run: z.object({ name: z.string() }),
        triggers: ['server', 'change'],
      },
    ])

    type Outputs = ToFormSchemaOutputs<typeof vs>

    expectTypeOf<Outputs>().toEqualTypeOf<
      readonly [
        // Assume runOnSubmit is true if omitted.
        { name: string },
        // It was explicitly set false.
        undefined,
        // Explicit true, server-only, and mixed triggers all run on client submit.
        { name: string },
        { name: string },
        { name: string },
        { name: string },
      ]
    >()
  })

  it('makes schema outputs optional when runOnSubmit is dynamic', () => {
    const dynamicRunOnSubmit = true as boolean
    const vs = defineFormValidators([
      {
        run: z.object({ name: z.string() }),
        triggers: [],
      },
      {
        run: z.object({ name: z.string() }),
        triggers: [],
        runOnSubmit: true,
      },
      {
        run: z.object({ name: z.string() }),
        triggers: [],
        runOnSubmit: false,
      },
      {
        run: z.object({ name: z.string() }),
        triggers: [],
        runOnSubmit: dynamicRunOnSubmit,
      },
      {
        run: z.object({ name: z.string() }),
        triggers: [],
        runOnSubmit: () => true,
      },
      {
        run: z.object({ name: z.string() }),
        triggers: [],
        runOnSubmit: () => false,
      },
      {
        run: z.object({ name: z.string() }),
        triggers: [],
        runOnSubmit: () => dynamicRunOnSubmit,
      },
      {
        run: z.object({ name: z.string() }),
        triggers: [],
        runOnSubmit: undefined,
      },
    ])

    type Output = { name: string }
    type Outputs = ToFormSchemaOutputs<typeof vs>
    type Expected = readonly [
      // An omitted runOnSubmit defaults to true, so the output is guaranteed.
      Output,
      // A literal true always runs the validator during submit.
      Output,
      // A literal false always skips the validator during submit.
      undefined,
      // A broad boolean may skip the validator at runtime.
      Output | undefined,
      // Predicates currently always assume dynamic results. Types are here if you plan to tighten it in the future.
      Output | undefined,
      Output | undefined,
      Output | undefined,
      // An explicit undefined receives the same true default as an omitted property.
      Output,
    ]

    expectTypeOf<Outputs>().toEqualTypeOf<Expected>()
  })

  it('should transform field validators', () => {
    const vs = defineFieldValidators([
      {
        run: () => ({ message: '', fromField: true as const }),
        triggers: [],
      },
    ])

    type Error = ToFieldError<typeof vs, never, FormErrorTypes<never, never>>

    expectTypeOf<Error>().toEqualTypeOf<{
      message: string
      fromField: true
    }>()
  })

  it('should fall back only after resolving all field error sources', () => {
    expectTypeOf<
      ToFieldError<[], never, FormErrorTypes<never, never>>
    >().toEqualTypeOf<ValidationIssue>()

    type FormFieldError = {
      message: string
      fromForm: true
    }

    expectTypeOf<
      ToFieldError<any, any, FormErrorTypes<never, FormFieldError>>
    >().toEqualTypeOf<FormFieldError>()
  })

  it('should transform group validators', () => {
    const schema = z
      .object({ name: z.string() })
      .transform(({ name }) => ({ nameLength: name.length }))
    const vs = defineGroupValidators([
      {
        run: schema,
        triggers: [],
      },
      {
        run: () => ({
          form: { message: '', fromGroup: true as const },
          fields: { name: { message: '', fromGroupField: true as const } },
        }),
        triggers: [],
      },
      {
        run: schema,
        runOnSubmit: false,
        triggers: [],
      },
    ])

    type ErrorTypes = ToFormGroupErrorTypes<typeof vs>
    type Outputs = ToFormGroupSchemaOutputs<typeof vs>

    expectTypeOf<ErrorTypes>().toEqualTypeOf<
      FormErrorTypes<
        StandardSchemaV1Issue | { message: string; fromGroup: true },
        StandardSchemaV1Issue | { message: string; fromGroupField: true }
      >
    >()
    expectTypeOf<Outputs['length']>().toEqualTypeOf<3>()
    expectTypeOf<Outputs[0]>().toEqualTypeOf<{ nameLength: number }>()
    expectTypeOf<Outputs[1]>().toEqualTypeOf<undefined>()
    expectTypeOf<Outputs[2]>().toEqualTypeOf<undefined>()
  })

  it('should normalize broad and empty validator transforms', () => {
    expectTypeOf<ToFormErrorTypes<any, never>>().toEqualTypeOf<
      FormErrorTypes<never, never>
    >()
    expectTypeOf<ToFormGroupErrorTypes<any>>().toEqualTypeOf<
      FormErrorTypes<never, never>
    >()
    expectTypeOf<ToFormGroupSchemaOutputs<any>>().toEqualTypeOf<
      Array<unknown>
    >()
    expectTypeOf<ToFormGroupErrorTypes<[]>>().toEqualTypeOf<
      FormErrorTypes<never, never>
    >()
    expectTypeOf<ToFormGroupSchemaOutputs<[]>>().toEqualTypeOf<[]>()
  })
})
