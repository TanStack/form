import { expectTypeOf, it } from 'vitest'
import { FormApi, FormGroupApi } from '../src/index'

it('should type value properly', () => {
  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
      step2: { name: 'test2' },
    },
  } as const)

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
  })

  expectTypeOf(group.state.value).toEqualTypeOf<{ readonly name: 'test' }>()
})

it('should type the name property', () => {
  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
      step2: { age: 10 },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
  })

  expectTypeOf(group.name).toEqualTypeOf<'step1'>()
})

it('should type the validator onChange value properly', () => {
  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
      step2: { name: 'test2' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
    validators: {
      onChange: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<{ name: string }>()
        return undefined
      },
    },
  })
})

it('should type the validator onSubmit value properly', () => {
  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test', age: 20 },
      step2: { name: 'test2' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
    validators: {
      onSubmit: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<{ name: string; age: number }>()
        return undefined
      },
    },
  })
})

it('should type the errorMap from group validators', () => {
  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
      step2: { name: 'test2' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
    validators: {
      onSubmit: () => 'submit-error' as const,
    },
  })

  expectTypeOf(group.state.meta.errorMap.onSubmit).toEqualTypeOf<
    'submit-error' | undefined
  >()
})

it('should type errors array from group validators', () => {
  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
      step2: { name: 'test2' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
    validators: {
      onChange: () => 'change-error' as const,
    },
  })

  expectTypeOf(group.state.meta.errors).toEqualTypeOf<
    Array<'change-error' | undefined>
  >()
})

it('should type handleSubmit return as Promise<void>', () => {
  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
  })

  expectTypeOf(group.handleSubmit()).toEqualTypeOf<Promise<void>>()
})

it('should type handleSubmit with the correct meta type when onSubmitMeta is provided', () => {
  type SubmitMeta = { source: string }

  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
    onSubmitMeta: {} as SubmitMeta,
  })

  expectTypeOf(group.handleSubmit).toEqualTypeOf<{
    (): Promise<void>
    (submitMeta: SubmitMeta): Promise<void>
  }>()
})

it('should type onGroupSubmit callback value and meta properly', () => {
  type SubmitMeta = { source: string }

  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
      step2: { name: 'test2' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onSubmitMeta: {} as SubmitMeta,
    onGroupSubmit: ({ value, meta }) => {
      expectTypeOf(value).toEqualTypeOf<{ name: string }>()
      expectTypeOf(meta).toEqualTypeOf<SubmitMeta>()
    },
  })
})

it('should type onGroupSubmitInvalid callback value and meta properly', () => {
  type SubmitMeta = { source: string }

  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
      step2: { name: 'test2' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onSubmitMeta: {} as SubmitMeta,
    onGroupSubmit: () => {},
    onGroupSubmitInvalid: ({ value, meta }) => {
      expectTypeOf(value).toEqualTypeOf<{ name: string }>()
      expectTypeOf(meta).toEqualTypeOf<SubmitMeta>()
    },
  })
})

it('should type errorMap with both sync and async validator return types', () => {
  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
    validators: {
      onChange: () => 'sync-change' as const,
      onChangeAsync: async () => 'async-change' as const,
      onBlur: () => 'sync-blur' as const,
      onBlurAsync: async () => 'async-blur' as const,
      onSubmit: () => 'sync-submit' as const,
      onSubmitAsync: async () => 'async-submit' as const,
    },
  })

  expectTypeOf(group.state.meta.errorMap.onChange).toEqualTypeOf<
    'sync-change' | 'async-change' | undefined
  >()

  expectTypeOf(group.state.meta.errorMap.onBlur).toEqualTypeOf<
    'sync-blur' | 'async-blur' | undefined
  >()

  expectTypeOf(group.state.meta.errorMap.onSubmit).toEqualTypeOf<
    'sync-submit' | 'async-submit' | undefined
  >()
})

it('should type the listener onChange callback value', () => {
  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
      step2: { name: 'test2' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
    listeners: {
      onChange: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<{ name: string }>()
      },
    },
  })
})

it('should type setValue updater properly', () => {
  const form = new FormApi({
    defaultValues: {
      step1: { name: 'test' },
      step2: { name: 'test2' },
    },
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
  })

  // Should accept the correct value type
  group.setValue({ name: 'new name' })

  // Should accept an updater function
  group.setValue((prev) => {
    expectTypeOf(prev).toEqualTypeOf<{ name: string }>()
    return { name: 'updated' }
  })
})

it('should allow optional array fields for array-specific methods', () => {
  type FormValues = {
    step1: {
      aliases?: string[]
      relatives: { name: string }[] | undefined
      title: string | undefined
    }
  }

  const form = new FormApi({
    defaultValues: {
      step1: {
        title: undefined,
      },
    } as FormValues,
  })

  const group = new FormGroupApi({
    name: 'step1',
    form,
    onGroupSubmit: () => {},
  })

  group.pushFieldValue('step1.aliases', 'alias')
  group.insertFieldValue('step1.aliases', 0, 'alias')
  group.replaceFieldValue('step1.aliases', 0, 'alias')
  group.removeFieldValue('step1.aliases', 0)
  group.swapFieldValues('step1.aliases', 0, 1)
  group.moveFieldValues('step1.aliases', 0, 1)
  group.clearFieldValues('step1.aliases')
  group.validateArrayFieldsStartingFrom('step1.aliases', 0, 'change')

  group.pushFieldValue('step1.relatives', { name: 'relative' })
  group.insertFieldValue('step1.relatives', 0, { name: 'relative' })
  group.replaceFieldValue('step1.relatives', 0, { name: 'relative' })

  // @ts-expect-error non-array fields are still rejected
  group.removeFieldValue('step1.title', 0)
  // @ts-expect-error array values must still match the array element type
  group.pushFieldValue('step1.aliases', 1)
})
