import { describe, expect, it } from 'vitest'
import z from 'zod'
import {
  createErrorMap,
  createErrorVisibility,
  createValidator,
  createValidators,
  formOptions,
} from '../src'

describe('validation public helpers', () => {
  it('returns form options unchanged at runtime', () => {
    const options = { defaultValues: { name: 'Ada' } }
    const triggers: Array<'change'> = ['change']
    const schema = z.object({ name: z.string() })
    const schemaOptions = {
      ...options,
      validators: [
        {
          run: schema,
          triggers,
        },
      ],
    }

    expect(formOptions(options)).toBe(options)
    expect(formOptions.strictSchema(schema, schemaOptions)).toBe(schemaOptions)
    expect(formOptions.looseSchema(schema, schemaOptions)).toBe(schemaOptions)
  })

  it('creates validators by pairing options with run functions', () => {
    const run = () => null
    const validator = createValidator({
      bailIfInvalid: true,
      triggers: ['change'],
    })(run)

    expect(validator).toEqual({
      bailIfInvalid: true,
      triggers: ['change'],
      run,
    })
  })

  it('creates multiple validators from option and run tuples', () => {
    const firstRun = () => null
    const secondRun = () => ({ message: 'Required' })

    const validators = createValidators([
      { triggers: ['change'] },
      { bailIfInvalid: true, triggers: ['blur'] },
    ])(firstRun, secondRun)

    expect(validators).toEqual([
      { triggers: ['change'], run: firstRun },
      { bailIfInvalid: true, triggers: ['blur'], run: secondRun },
    ])
  })

  it('returns reusable error visibility callbacks unchanged', () => {
    const visibility = () => true

    expect(createErrorVisibility(visibility)).toBe(visibility)
  })

  it('creates mutable validation error maps', () => {
    const errors = createErrorMap<{ name: string; age: number }>()

    expect(errors).toEqual({ fields: {} })
    errors.fields.name = undefined
    errors.fields.age = 'Age is required'
    errors.form = 'Form is invalid'

    expect(errors).toEqual({
      form: 'Form is invalid',
      fields: { name: undefined, age: 'Age is required' },
    })
  })

  it('returns the prefilled validation error map', () => {
    const initial = {
      form: 'Form is invalid',
      fields: { name: 'Name is required' },
    }

    const errors = createErrorMap(initial)

    expect(errors).toBe(initial)
  })

  it('preserves falsy form errors in the initial error map', () => {
    const initial = {
      form: '',
      fields: {},
    }

    const errors = createErrorMap(initial)

    expect(errors).toBe(initial)
    expect(errors).toHaveProperty('form', '')
  })
})
