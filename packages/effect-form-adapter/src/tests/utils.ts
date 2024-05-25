import { Context, Effect, Layer } from 'effect'
import { Schema } from '@effect/schema'

export class Ctx extends Context.Tag('Ctx')<Ctx, string>() {}
export const ctx = Layer.succeed(Ctx, Ctx.of('ctx-123'))

export const schema = Schema.String.pipe(
  Schema.minLength(3, {
    message: () => 'You must have a length of at least 3',
  }),
)

export const schemaWithContext = Schema.transformOrFail(schema, schema, {
  decode: () => Effect.flatMap(Ctx, (c) => Effect.succeed(c)),
  encode: (value) => Effect.succeed(value),
})

export const asyncSchema = Schema.transformOrFail(schema, schema, {
  decode: (value) => Effect.succeed(value).pipe(Effect.delay('10 millis')),
  encode: (value) => Effect.succeed(value).pipe(Effect.delay('10 millis')),
})

export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, timeout)
  })
}
