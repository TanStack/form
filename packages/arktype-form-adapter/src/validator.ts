import { type } from 'arktype'
import type { ValidationError, Validator } from '@tanstack/form-core'
import type { ArkErrors, Type } from 'arktype'

type Params = {
  transformErrors?: (errors: ArkErrors) => ValidationError
}

export const arktypeValidator = (params: Params = {}) =>
  (() => {
    return {
      validate({ value }, fn) {
        console.log(fn, 'XD')
        // Call Arktype on the value here and return the error message
        const result = fn.type(value)

        console.log(result)

        if (result instanceof type.errors) {
          if (params.transformErrors) {
            return params.transformErrors(result)
          }

          return result.summary
        }

        return
      },
      async validateAsync({ value }, fn): Promise<ValidationError> {
        console.log(fn, 'XD')

        // Call Arktype on the value here and return the error message
        const result = fn.type(value)

        if (result instanceof type.errors) {
          if (params.transformErrors) {
            return params.transformErrors(result)
          }

          return result.summary
        }

        return
      },
    }
  }) as Validator<unknown, { type: Type }>
