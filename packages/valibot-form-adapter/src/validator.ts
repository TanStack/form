import { safeParse, safeParseAsync } from 'valibot'
import type { BaseSchema, BaseSchemaAsync } from 'valibot'
import type { Validator } from '@tanstack/form-core'

export const valibotValidator = (() => {
  return {
    validate({ value }, fn) {
      if (fn.async) return
      const result = safeParse(fn, value)
      if (result.success) return
      return result.issues.map((i) => i.message).join(', ')
    },
    async validateAsync({ value }, fn) {
      const result = await safeParseAsync(fn, value)
      if (result.success) return
      return result.issues.map((i) => i.message).join(', ')
    },
  }
}) as Validator<unknown, BaseSchema | BaseSchemaAsync>
