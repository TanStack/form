import * as Schema from '@effect/schema/Schema'
import { flow } from "effect/Function"
import * as ArrayFormatter from '@effect/schema/ArrayFormatter'
import * as Effect from 'effect/Effect'
import * as Exit from 'effect/Exit'
import * as Runtime from 'effect/Runtime'
import * as ManagedRuntime from 'effect/ManagedRuntime'
import * as Predicate from 'effect/Predicate'
import type { ParseOptions } from '@effect/schema/AST'
import type * as Layer from 'effect/Layer'
import type { ValidationError, Validator } from '@tanstack/form-core'

const isPropertySignature = <S extends Schema.Schema<any, any, any>>(u: unknown): u is Schema.propertySignature<S> =>
  Predicate.hasProperty(u, Schema.PropertySignatureTypeId)

export type EffectValidator<R> = Schema.Schema<any, any, R> | Schema.propertySignature<Schema.Schema<any, any, R>>;

const validate = <R>(validator: EffectValidator<R>, parseOptions?: ParseOptions) => flow(
  Schema.decodeUnknown(isPropertySignature(validator) ? validator.from : validator, parseOptions),
  Effect.flatMap(() => Effect.void),
  Effect.flip,
  Effect.flatMap(ArrayFormatter.formatError),
  Effect.map((es) => es.map((e) => e.message).join(', ')), // must be joined into 1 string
  Effect.exit,
  Effect.map(Exit.getOrElse(() => undefined))
)

/**
 * Creates a validator from a `Runtime`
 */
export const createValidatorRuntime = <R>(runtime: Runtime.Runtime<R>, parseOptions?: ParseOptions) => {

const validator: Validator<unknown, EffectValidator<R>> = () => ({
  validate(
    { value }: { value: unknown },
    schema: EffectValidator<R>
  ): ValidationError {
    return Runtime.runSync(runtime)(validate(schema, parseOptions)(value))
  },
  async validateAsync(
    { value }: { value: unknown },
    schema: EffectValidator<R>
  ): Promise<ValidationError> {
    return Runtime.runPromise(runtime)(validate(schema, parseOptions)(value))
  },
})

return validator;
}

/**
 * Creates a validator from a `Layer`
 */
export const createValidatorLayer = <R>(layer: Layer.Layer<R>, parseOptions?: ParseOptions) => {
  const runtime = ManagedRuntime.make(layer)

  const validator: Validator<unknown, EffectValidator<R>> = () => ({
    validate(
      { value }: { value: unknown },
      schema: EffectValidator<R>
    ): ValidationError {
        return runtime.runSync(validate(schema, parseOptions)(value))
    },
    async validateAsync(
      { value }: { value: unknown },
      schema: EffectValidator<R>
    ): Promise<ValidationError> {
      return runtime.runPromise(validate(schema, parseOptions)(value))
    },
  })

  return validator
}

/**
 * Creates a validator using the default runtime
 */
export const createValidator = (parseOptions?: ParseOptions) => createValidatorRuntime(Runtime.defaultRuntime, parseOptions)

/**
 * Default validator w/o context.
 */
export const effectValidator = createValidator()
