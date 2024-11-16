import { describe, expect, it, vi } from 'vitest'
import * as v from 'valibot'
import { FieldApi, FormApi, standardSchemaValidator } from '../src/index'
import { sleep } from './utils'

describe('standard schema validator', () => {
  it('should support StandardSchema sync validation with valibot', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
      validators: {
        onChange: v.object({
          firstName: v.pipe(
            v.string(),
            v.minLength(3, 'First name is too short'),
          ),
          lastName: v.string(),
        }),
      },
      validatorAdapter: standardSchemaValidator(),
    })

    const field = new FieldApi({
      form,
      name: 'firstName',
    })

    field.mount()

    field.setValue('')
    expect(form.state.errors).toStrictEqual(['First name is too short'])
  })

  it('should support StandardSchema async validation with valibot', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
      validators: {
        onChangeAsync: v.objectAsync({
          firstName: v.pipeAsync(
            v.string(),
            v.checkAsync(async (val) => {
              await sleep(1)
              return val.length > 3
            }, 'First name is too short'),
          ),
          lastName: v.string(),
        }),
      },
      validatorAdapter: standardSchemaValidator(),
    })

    const field = new FieldApi({
      form,
      name: 'firstName',
    })

    field.mount()

    field.setValue('')
    await vi.runAllTimersAsync()
    expect(form.state.errors).toStrictEqual(['First name is too short'])
  })
})
