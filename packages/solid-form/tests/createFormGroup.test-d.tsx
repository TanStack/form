import { describe, expectTypeOf, it } from 'vitest'
import { createForm, createFormGroup } from '../src/index'
import type { FormGroupApi } from '../src/index'

describe('createFormGroup form-like surface', () => {
  it('should type state.value based on the selected field', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onGroupSubmit: () => {},
      }))

      expectTypeOf(group().state.value).toEqualTypeOf<{ name: string }>()
      expectTypeOf(group().name).toEqualTypeOf<'step1'>()
    }
  })

  it('should type onGroupSubmit value and meta', () => {
    type SubmitMeta = { source: string }

    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onSubmitMeta: {} as SubmitMeta,
        onGroupSubmit: ({ value, meta }) => {
          expectTypeOf(value).toEqualTypeOf<{ name: string }>()
          expectTypeOf(meta).toEqualTypeOf<SubmitMeta>()
        },
      }))
    }
  })

  it('should type onGroupSubmitInvalid value and meta', () => {
    type SubmitMeta = { source: string }

    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onSubmitMeta: {} as SubmitMeta,
        onGroupSubmit: () => {},
        onGroupSubmitInvalid: ({ value, meta }) => {
          expectTypeOf(value).toEqualTypeOf<{ name: string }>()
          expectTypeOf(meta).toEqualTypeOf<SubmitMeta>()
        },
      }))
    }
  })

  it('should type validators with the scoped value', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test', age: 10 },
          step2: { name: 'test2' },
        },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onGroupSubmit: () => {},
        validators: {
          onChange: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<{ name: string; age: number }>()
            return undefined
          },
          onSubmit: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<{ name: string; age: number }>()
            return undefined
          },
        },
      }))
    }
  })

  it('should type listeners with the scoped value', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onGroupSubmit: () => {},
        listeners: {
          onChange: ({ value }) => {
            expectTypeOf(value).toEqualTypeOf<{ name: string }>()
          },
        },
      }))
    }
  })

  it('should type handleSubmit return as Promise<void>', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: { step1: { name: 'test' } },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onGroupSubmit: () => {},
      }))

      expectTypeOf(group().handleSubmit()).toEqualTypeOf<Promise<void>>()
    }
  })

  it('should type handleSubmit overload when onSubmitMeta is provided', () => {
    type SubmitMeta = { source: string }

    function Comp() {
      const form = createForm(() => ({
        defaultValues: { step1: { name: 'test' } },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onSubmitMeta: {} as SubmitMeta,
        onGroupSubmit: () => {},
      }))

      expectTypeOf(group().handleSubmit).toEqualTypeOf<{
        (): Promise<void>
        (submitMeta: SubmitMeta): Promise<void>
      }>()
    }
  })

  it('should type setValue updater', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onGroupSubmit: () => {},
      }))

      group().setValue({ name: 'new name' })
      group().setValue((prev) => {
        expectTypeOf(prev).toEqualTypeOf<{ name: string }>()
        return { name: 'updated' }
      })
    }
  })

  it('should infer the FormGroupApi instance type for createFormGroup', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onGroupSubmit: () => {},
      }))

      expectTypeOf(group()).toMatchTypeOf<
        FormGroupApi<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >()
    }
  })
})

describe('createFormGroup field-like meta surface', () => {
  it('should type meta booleans', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onGroupSubmit: () => {},
      }))

      expectTypeOf(group().state.meta.isTouched).toEqualTypeOf<boolean>()
      expectTypeOf(group().state.meta.isBlurred).toEqualTypeOf<boolean>()
      expectTypeOf(group().state.meta.isDirty).toEqualTypeOf<boolean>()
      expectTypeOf(group().state.meta.isValidating).toEqualTypeOf<boolean>()
    }
  })

  it('should type errorMap entries based on validator return types', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: { step1: { name: 'test' } },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onGroupSubmit: () => {},
        validators: {
          onChange: () => 'sync-change' as const,
          onChangeAsync: async () => 'async-change' as const,
          onBlur: () => 'sync-blur' as const,
          onBlurAsync: async () => 'async-blur' as const,
          onSubmit: () => 'sync-submit' as const,
          onSubmitAsync: async () => 'async-submit' as const,
        },
      }))

      expectTypeOf(group().state.meta.errorMap.onChange).toEqualTypeOf<
        'sync-change' | 'async-change' | undefined
      >()
      expectTypeOf(group().state.meta.errorMap.onBlur).toEqualTypeOf<
        'sync-blur' | 'async-blur' | undefined
      >()
      expectTypeOf(group().state.meta.errorMap.onSubmit).toEqualTypeOf<
        'sync-submit' | 'async-submit' | undefined
      >()
    }
  })

  it('should type errors array from group validators', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      }))

      const group = createFormGroup(() => ({
        form,
        name: 'step1',
        onGroupSubmit: () => {},
        validators: {
          onChange: () => 'change-error' as const,
        },
      }))

      expectTypeOf(group().state.meta.errors).toEqualTypeOf<
        Array<'change-error' | undefined>
      >()
    }
  })
})

describe('form.FormGroup component surface', () => {
  it('should type the children render prop with the scoped value', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      }))

      return (
        <form.FormGroup name="step1" onGroupSubmit={() => {}}>
          {(group) => {
            expectTypeOf(group().state.value).toEqualTypeOf<{ name: string }>()
            expectTypeOf(group().name).toEqualTypeOf<'step1'>()
            return null
          }}
        </form.FormGroup>
      )
    }
  })

  it('should type the children render prop with onSubmitMeta', () => {
    type SubmitMeta = { source: string }

    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      }))

      return (
        <form.FormGroup
          name="step1"
          onSubmitMeta={{} as SubmitMeta}
          onGroupSubmit={({ value, meta }) => {
            expectTypeOf(value).toEqualTypeOf<{ name: string }>()
            expectTypeOf(meta).toEqualTypeOf<SubmitMeta>()
          }}
        >
          {(group) => {
            expectTypeOf(group().handleSubmit).toEqualTypeOf<{
              (): Promise<void>
              (submitMeta: SubmitMeta): Promise<void>
            }>()
            return null
          }}
        </form.FormGroup>
      )
    }
  })

  it('should type validators on the FormGroup component', () => {
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          step1: { name: 'test', age: 10 },
          step2: { name: 'test2' },
        },
      }))

      return (
        <form.FormGroup
          name="step1"
          validators={{
            onChange: ({ value }) => {
              expectTypeOf(value).toEqualTypeOf<{ name: string; age: number }>()
              return undefined
            },
          }}
          onGroupSubmit={() => {}}
        >
          {() => null}
        </form.FormGroup>
      )
    }
  })
})
