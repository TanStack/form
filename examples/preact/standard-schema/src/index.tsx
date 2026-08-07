import { render } from 'preact'

import { type } from 'arktype'
import { Schema as S } from 'effect'
import * as v from 'valibot'
import { z } from 'zod'

import { useForm } from '@tanstack/preact-form'

import type { AnyFieldApi } from '@tanstack/preact-form'

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.meta.isTouched && field.meta.isInvalid ? (
        <em>{field.errors.map((err) => err.message).join(',')}</em>
      ) : null}
      {field.meta.isValidating ? 'Validating...' : null}
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

void ValibotSchema
void ArkTypeSchema
void EffectSchema

export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validators: [
      {
        // DEMO: You can switch between schemas seamlessly
        run: ZodSchema,
        // run: ValibotSchema,
        // run: ArkTypeSchema,
        // run: EffectSchema,
        triggers: ['change'],
      },
    ],
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <div>
      <h1>Standard Schema Form Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="firstName"
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name}>First Name:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onBlur={field.handleBlur}
                    onInput={(e) => field.handleChange(e.currentTarget.value)}
                  />
                  <FieldInfo field={field} />
                </>
              )
            }}
          />
        </div>
        <div>
          <form.Field
            name="lastName"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Last Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onBlur={field.handleBlur}
                  onInput={(e) => field.handleChange(e.currentTarget.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        />
      </form>
    </div>
  )
}

const rootElement = document.getElementById('root')!

render(<App />, rootElement)
