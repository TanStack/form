<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import { type } from 'arktype'
  import { Schema as S } from 'effect'
  import * as v from 'valibot'
  import { z } from 'zod'
  import FieldInfo from './FieldInfo.svelte'

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

  void ValibotSchema
  void ArkTypeSchema
  void EffectSchema
</script>

<div>
  <h1>Standard Schema Form Example</h1>
  <form
    onsubmit={(event) => {
      event.preventDefault()
      event.stopPropagation()
      form.handleSubmit()
    }}
  >
    <form.Field name="firstName">
      {#snippet children(field)}
        <div>
          <label for={field.name}>First Name:</label>
          <input
            id={field.name}
            name={field.name}
            value={field.value}
            onblur={field.handleBlur}
            oninput={(event) => field.handleChange(event.currentTarget.value)}
            aria-invalid={field.meta.isInvalid}
          />
          <FieldInfo {field} />
        </div>
      {/snippet}
    </form.Field>
    <form.Field name="lastName">
      {#snippet children(field)}
        <div>
          <label for={field.name}>Last Name:</label>
          <input
            id={field.name}
            name={field.name}
            value={field.value}
            onblur={field.handleBlur}
            oninput={(event) => field.handleChange(event.currentTarget.value)}
            aria-invalid={field.meta.isInvalid}
          />
          <FieldInfo {field} />
        </div>
      {/snippet}
    </form.Field>
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    >
      {#snippet children([canSubmit, isSubmitting])}
        <button type="submit" disabled={!canSubmit}>
          {isSubmitting ? '...' : 'Submit'}
        </button>
      {/snippet}
    </form.Subscribe>
  </form>
</div>
