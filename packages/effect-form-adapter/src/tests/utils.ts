import { Context, Effect, Layer, Option } from 'effect'
import { Schema } from '@effect/schema'
import * as ParseResult from '@effect/schema/ParseResult'

export class Ctx extends Context.Tag('Ctx')<Ctx, string>() {}
export const ctxLayer = Layer.succeed(Ctx, Ctx.of('ctx-123'))

export const schema = Schema.String.pipe(
  Schema.minLength(3, {
    message: () => 'You must have a length of at least 3',
  }),
).pipe(Schema.propertySignature)

const delay = Effect.delay('2 millis')
export const asyncSchema = Schema.transformOrFail(
  Schema.String,
  Schema.String,
  {
    decode: (value, _, ast) =>
      delay(
        value.length >= 3
          ? Effect.succeed(value)
          : Effect.fail(new ParseResult.Type(ast, value, 'inner msg')),
      ),
    encode: (value) => Effect.succeed(value).pipe(delay),
  },
).annotations({
  message: () => delay(Effect.succeed('async schema error')),
})

export const schemaWithContext = Schema.transformOrFail(
  Schema.String,
  Schema.String,
  {
    decode: (_, value, ast) =>
      Effect.fail(new ParseResult.Type(ast, value, '')),
    encode: (value) => Effect.succeed(value),
  },
).annotations({
  message: () =>
    Effect.map(
      Effect.serviceOption(Ctx),
      Option.getOrElse(() => 'no context'),
    ),
})

export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, timeout)
  })
}
