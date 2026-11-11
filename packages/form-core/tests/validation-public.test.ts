import { describe, expect, it } from 'vitest'
import z from 'zod'
import {
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
})
