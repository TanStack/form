import { safeParse, safeParseAsync } from 'valibot'
import type { BaseSchema, BaseSchemaAsync } from 'valibot'
import type { ValidationError, Validator } from '@tanstack/form-core'

export const valibotValidator = (<
  Fn extends BaseSchema | BaseSchemaAsync = BaseSchema | BaseSchemaAsync,
>() => {
  return {
    validate(value: unknown, fn: Fn): ValidationError {
      if (fn.async) return
      const result = safeParse(fn, value)
      if (result.success) return
      return result.issues.map((i) => i.message).join(', ')
    },
    async validateAsync(value: unknown, fn: Fn): Promise<ValidationError> {
      const result = await safeParseAsync(fn, value)
      if (result.success) return
      return result.issues.map((i) => i.message).join(', ')
    },
  }
}) satisfies Validator<unknown>
