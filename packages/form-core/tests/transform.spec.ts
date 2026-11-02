import { describe, expect, it } from 'vitest'
import { FieldApi, FormApi, mergeAndUpdate, mergeForm } from '../src'
import type { AnyFormState } from '../src'

it('transform option does not invalidate state for the field', () => {
  const state: Partial<AnyFormState> = {
    errorMap: {
      onChange: {
        fields: {
          age: 'Age is required',
        },
      },
    },
  }

  const form = new FormApi({
    defaultValues: {
      age: 0,
    },
  })

  form.mount()

  const ageField = new FieldApi({
    form,
    name: 'age',
  })

  ageField.mount()

  expect(ageField.state.meta.isValid).toBe(true)

  mergeAndUpdate(form, (f) => mergeForm(f, state))

  expect(ageField.state.meta.isValid).toBe(false)
})

describe('transform preserves binary values', () => {
  const makeFile = (name = 'attachment.txt') =>
    new File(['payload'], name, { type: 'text/plain' })

  it('should preserve File values when a transform runs', () => {
    const file = makeFile()
    const form = new FormApi({ defaultValues: { file } })

    mergeAndUpdate(form, (value) => value)

    expect(form.state.values.file).toBe(file)
  })

  it('should preserve Blob values when a transform runs', () => {
    const blob = new Blob(['payload'], { type: 'text/plain' })
    const form = new FormApi({ defaultValues: { blob } })

    mergeAndUpdate(form, (value) => value)

    expect(form.state.values.blob).toBe(blob)
  })

  it('should preserve File values that fail instanceof (e.g. other realms)', () => {
    // A File created in another realm (such as an iframe) is not an instance of
    // this realm's Blob, but still reports the same type tag.
    const foreignFile = Object.create(null, {
      [Symbol.toStringTag]: { value: 'File' },
    })
    expect(foreignFile instanceof Blob).toBe(false)

    const form = new FormApi({ defaultValues: { file: foreignFile } })

    mergeAndUpdate(form, (value) => value)

    expect(form.state.values.file).toBe(foreignFile)
  })

  it('should preserve File values nested in objects and arrays', () => {
    const first = makeFile('first.txt')
    const second = makeFile('second.txt')
    const nested = makeFile('nested.txt')
    const form = new FormApi({
      defaultValues: {
        attachments: [first, second],
        profile: { avatar: nested },
      },
    })

    mergeAndUpdate(form, (value) => value)

    expect(form.state.values.attachments[0]).toBe(first)
    expect(form.state.values.attachments[1]).toBe(second)
    expect(form.state.values.profile.avatar).toBe(nested)
  })

  it('should preserve File values when a transform only merges errors', () => {
    const file = makeFile()
    const form = new FormApi({
      defaultValues: { age: 0, file },
    })
    form.mount()

    const state: Partial<AnyFormState> = {
      errorMap: { onChange: { fields: { age: 'Age is required' } } },
    }
    mergeAndUpdate(form, (f) => mergeForm(f, state))

    expect(form.state.values.file).toBe(file)
    expect(form.state.values.file.name).toBe('attachment.txt')
    expect(form.state.values.file.size).toBe(7)
  })
})
