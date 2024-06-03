import * as Schema from '@effect/schema/Schema'
import * as ArrayFormatter from '@effect/schema/ArrayFormatter'
import * as Effect from 'effect/Effect'
import * as Exit from 'effect/Exit'
import * as Layer from 'effect/Layer'
import * as ManagedRuntime from 'effect/ManagedRuntime'
import type { ValidationError, Validator } from '@tanstack/form-core'
import { ParseOptions } from '@effect/schema/AST'

/**
 * Creates a validator from a `Layer`
 */
export const createValidator = <R>(layer: Layer.Layer<R>, parseOptions?: ParseOptions) => {
  const runtime = ManagedRuntime.make(layer)

  const validator: Validator<unknown, Schema.Schema<any, any, R>> = () => ({
    validate(
      { value }: { value: unknown },
      schema: Schema.Schema<any, any, R>,
    ): ValidationError {
      return runtime.runSyncExit(
        Schema.decodeUnknown(schema, parseOptions)(value).pipe(
          Effect.flip,
          Effect.flatMap(ArrayFormatter.formatError),
          Effect.map((es) => es.map((e) => e.message).join(', ')),
        ),
      ).pipe(Exit.getOrElse(() => undefined))
    },
    async validateAsync(
      { value }: { value: unknown },
      schema: Schema.Schema<any, any, R>,
    ): Promise<ValidationError> {
      return Schema.decodeUnknown(schema, parseOptions)(value).pipe(
        Effect.flatMap(() => Effect.void),
        Effect.flip,
        Effect.flatMap(ArrayFormatter.formatError),
        Effect.map((es) => es.map((e) => e.message).join(', ')), // must be joined into 1 string
        runtime.runPromiseExit,
      ).then(Exit.getOrElse(() => undefined))
    },
  })

  return validator
}

/**
 * Default validator w/o context.
 */
export const effectValidator = createValidator(Layer.empty)
