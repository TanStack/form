import * as Schema from '@effect/schema/Schema'
import * as ArrayFormatter from '@effect/schema/ArrayFormatter'
import * as Effect from 'effect/Effect'
import * as Exit from 'effect/Exit'
import * as Layer from 'effect/Layer'
import * as ManagedRuntime from 'effect/ManagedRuntime'
import type { ValidationError, Validator } from '@tanstack/form-core'

export const createValidator = <R>(layer: Layer.Layer<R>) => {
  const runtime = ManagedRuntime.make(layer)

  const validator: Validator<unknown, Schema.Schema<any, any, R>> = () => ({
    validate(
      { value }: { value: unknown },
      schema: Schema.Schema<any, any, R>,
    ): ValidationError {
      const exit = runtime.runSyncExit(
        Schema.decodeUnknown(schema)(value).pipe(
          Effect.flip,
          Effect.flatMap(ArrayFormatter.formatError),
          Effect.map((es) => es.map((e) => e.message).join(', ')),
        ),
      )
      return Exit.getOrElse(exit, () => undefined)
    },
    async validateAsync(
      { value }: { value: unknown },
      schema: Schema.Schema<any, any, R>,
    ): Promise<ValidationError> {
      const exit = await Schema.decodeUnknown(schema)(value).pipe(
        Effect.flatMap(() => Effect.void),
        Effect.flip,
        Effect.flatMap(ArrayFormatter.formatError),
        Effect.map((es) => es.map((e) => e.message).join(', ')), // must be joined into 1 string
        runtime.runPromiseExit,
      )

      return Exit.getOrElse(exit, () => undefined)
    },
  })

  return validator
}

export const effectValidator = createValidator(Layer.empty)
