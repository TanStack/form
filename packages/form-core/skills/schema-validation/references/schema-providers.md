Use the schema provider already installed in the application. These shapes follow the React Standard Schema example; the validator configuration is shared by all adapters.

## Valibot

```ts
import { formOptions } from '@tanstack/form-core'
import * as v from 'valibot'

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(3, 'Enter at least three characters')),
})

export const options = formOptions.strictSchema(schema, {
  defaultValues: { name: '' },
  validators: [{ run: schema, triggers: ['change'] }],
})
```

## ArkType

```ts
import { formOptions } from '@tanstack/form-core'
import { type } from 'arktype'

const schema = type({ name: 'string >= 3' })

export const options = formOptions.strictSchema(schema, {
  defaultValues: { name: '' },
  validators: [{ run: schema, triggers: ['change'] }],
})
```

## Effect

```ts
import { formOptions } from '@tanstack/form-core'
import { Schema as S } from 'effect'

const schema = S.standardSchemaV1(
  S.Struct({ name: S.String.pipe(S.minLength(3)) }),
)

export const options = formOptions.strictSchema(schema, {
  defaultValues: { name: '' },
  validators: [{ run: schema, triggers: ['change'] }],
})
```

Effect's schema needs the `standardSchemaV1` wrapper in the version used by the example. Zod, Valibot, and ArkType schemas in that example are passed directly.

The [example manifest](https://github.com/TanStack/form/blob/main/examples/react/standard-schema/package.json) uses Zod 4, Valibot 1, ArkType 2, and Effect 3. Verify support against the application's installed versions before adapting these examples.
