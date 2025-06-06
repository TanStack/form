import { describe, expectTypeOf, it } from 'vitest'
import { FieldGroupApi, FormApi } from '../src'

describe('fieldGroupApi', () => {
  it('should have the correct properties based on defaultValues', () => {
    const form = new FormApi({
      defaultValues: {
        a: '',
        b: '',
      },
    })

    const group = new FieldGroupApi({
      form,
      defaultValues: { foo: '', bar: '' },
      fields: {
        foo: 'a',
        bar: 'b',
      },
    })

    expectTypeOf(group.state.values).toEqualTypeOf<{
      foo: string
      bar: string
    }>()
    expectTypeOf(group.getFieldValue)
      .parameter(0)
      .toEqualTypeOf<'foo' | 'bar'>()
  })

  it('should have strict typing for meta if specified', () => {
    const defaultValues = {
      a: '',
      b: '',
    }
    const groupValues = {
      foo: '',
    }
    const fields = {
      foo: 'a',
    } as const

    const correctMeta = {
      action: '',
    }
    const wrongMeta = {
      action: 0,
    }

    const formNoMeta = new FormApi({
      defaultValues,
    })

    const formWithMeta = new FormApi({
      defaultValues,
      onSubmitMeta: correctMeta,
    })

    const formWithWrongMeta = new FormApi({
      defaultValues,
      onSubmitMeta: wrongMeta,
    })

    // When no meta is specified, any meta should do
    const correctGroup1 = new FieldGroupApi({
      form: formNoMeta,
      defaultValues: groupValues,
      fields,
    })
    const correctGroup2 = new FieldGroupApi({
      form: formWithMeta,
      defaultValues: groupValues,
      fields,
    })
    const correctGroup3 = new FieldGroupApi({
      form: formWithWrongMeta,
      defaultValues: groupValues,
      fields,
    })

    const wrongGroup1 = new FieldGroupApi({
      // @ts-expect-error
      form: formNoMeta,
      defaultValues: groupValues,
      fields,
      onSubmitMeta: correctMeta,
    })
    const correctGroup4 = new FieldGroupApi({
      form: formWithMeta,
      defaultValues: groupValues,
      fields,
      onSubmitMeta: correctMeta,
    })
    const wrongGroup2 = new FieldGroupApi({
      form: formWithWrongMeta,
      defaultValues: groupValues,
      fields,
      // @ts-expect-error
      onSubmitMeta: correctMeta,
    })
  })

  it('should allow wrapping groups in other groups', () => {
    const defaultValues = {
      a: '',
      b: '',
    }

    const groupWrapperValues = {
      foo: '',
    }

    const groupNestedValues = {
      bar: '',
    }

    const form = new FormApi({
      defaultValues,
    })

    const fieldGroupWrapper = new FieldGroupApi({
      defaultValues: groupWrapperValues,
      form,
      fields: {
        foo: 'a',
      },
    })

    const fieldGroupNested = new FieldGroupApi({
      defaultValues: groupNestedValues,
      form: fieldGroupWrapper,
      fields: {
        bar: 'foo',
      },
    })
  })

  it('should allow mapping fields to field groups', () => {
    const defaultValues = {
      a: '',
      b: '',
      c: 0,
      d: { e: '', f: 0 },
    }

    const form = new FormApi({
      defaultValues,
    })

    const group = new FieldGroupApi({
      form,
      defaultValues: { canBeA: '', orB: '', notC: '', butE: '', notF: '' },
      fields: {
        canBeA: 'a',
        orB: 'b',
        // @ts-expect-error
        notC: 'c',
        butE: 'd.e',
        // @ts-expect-error
        notF: 'f',
      },
    })

    const prefixGroup = new FieldGroupApi({
      form,
      defaultValues: { e: '', f: 0 },
      fields: 'd',
    })
  })

  it('should allow null and undefined for fields when string', () => {
    type FormValues = {
      foo:
        | {
            bar: string
          }
        | null
        | undefined
    }

    const defaultValues: FormValues = {
      foo: { bar: '' },
    }

    const form = new FormApi({
      defaultValues,
    })

    const group = new FieldGroupApi({
      form,
      defaultValues: { bar: '' },
      fields: 'foo',
    })

    const wrongGroup = new FieldGroupApi({
      form,
      defaultValues: { bar: '' },
      fields: {
        // @ts-expect-error
        bar: 'foo.bar',
      },
    })
  })
})
