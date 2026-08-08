import { For, Show } from 'solid-js'
import { render } from 'solid-js/web'
import { createForm } from '@tanstack/solid-form'
import { type } from 'arktype'
import { Schema as S } from 'effect'
import * as v from 'valibot'
import { z } from 'zod'
import type { Accessor } from 'solid-js'
import type { AnyFieldApi } from '@tanstack/solid-form'

function FieldInfo(props: { field: Accessor<AnyFieldApi> }) {
  return (
    <>
      <Show when={props.field().meta.isTouched && props.field().meta.isInvalid}>
        <em role="alert">
          <For each={props.field().errors}>
            {(error, index) => (
              <>
                {index() > 0 ? ', ' : ''}
                {error.message}
              </>
            )}
          </For>
        </em>
      </Show>
      <Show when={props.field().meta.isValidating}>Validating...</Show>
    </>
  )
}

const ZodSchema = z.object({
  firstName: z
    .string()
    .min(3, '[Zod] You must have a length of at least 3')
    .startsWith('A', "[Zod] First name must start with 'A'"),
  lastName: z.string().min(3, '[Zod] You must have a length of at least 3'),
})

const ValibotSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.minLength(3, '[Valibot] You must have a length of at least 3'),
    v.startsWith('A', "[Valibot] First name must start with 'A'"),
  ),
  lastName: v.pipe(
    v.string(),
    v.minLength(3, '[Valibot] You must have a length of at least 3'),
  ),
})

const ArkTypeSchema = type({
  firstName: 'string >= 3',
  lastName: 'string >= 3',
})

const EffectSchema = S.standardSchemaV1(
  S.Struct({
    firstName: S.String.pipe(
      S.minLength(3),
      S.annotations({
        message: () => '[Effect/Schema] You must have a length of at least 3',
      }),
    ),
    lastName: S.String.pipe(
      S.minLength(3),
      S.annotations({
        message: () => '[Effect/Schema] You must have a length of at least 3',
      }),
    ),
  }),
)

function App() {
  const form = createForm(() => ({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validators: [
      {
        // Switch between these Standard Schema implementations seamlessly.
        run: ZodSchema,
        // run: ValibotSchema,
        // run: ArkTypeSchema,
        // run: EffectSchema,
        triggers: ['change'],
      },
    ],
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  }))

  return (
    <div>
      <h1>Standard Schema Form Example</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          <form.Field name="firstName">
            {(field) => (
              <>
                <label for={field().name}>First Name:</label>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().value}
                  onBlur={field().handleBlur}
                  onInput={(event) =>
                    field().handleChange(event.currentTarget.value)
                  }
                  aria-invalid={field().meta.isInvalid}
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="lastName">
            {(field) => (
              <>
                <label for={field().name}>Last Name:</label>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().value}
                  onBlur={field().handleBlur}
                  onInput={(event) =>
                    field().handleChange(event.currentTarget.value)
                  }
                  aria-invalid={field().meta.isInvalid}
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {(state) => (
            <button type="submit" disabled={!state()[0] || state()[1]}>
              {state()[1] ? '...' : 'Submit'}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}

void ValibotSchema
void ArkTypeSchema
void EffectSchema
render(() => <App />, document.getElementById('root')!)
