<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import FieldInfo from './FieldInfo.svelte'

  import { type } from 'arktype'
  import * as v from 'valibot'
  import { z } from 'zod'
  import { Schema as S } from 'effect'

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
    validators: {
      // DEMO: You can switch between schemas seamlessly
      onChange: ZodSchema,
      // onChange: ValibotSchema,
      // onChange: ArkTypeSchema,
      // onChange: EffectSchema,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      alert(JSON.stringify(value))
    },
  }))
</script>

<form
  id="form"
  onsubmit={(e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }}
>
  <h1>TanStack Form - Svelte Demo</h1>

  <form.Field
    name="firstName"
  >
    {#snippet children(field)}
      <div>
        <label for={field.name}>First Name</label>
        <input
          id={field.name}
          type="text"
          placeholder="First Name"
          value={field.state.value}
          onblur={() => field.handleBlur()}
          oninput={(e: Event) => {
            const target = e.target as HTMLInputElement
            field.handleChange(target.value)
          }}
        />
        <FieldInfo {field} />
      </div>
    {/snippet}
  </form.Field>
  <form.Field
    name="lastName"
  >
    {#snippet children(field)}
      <div>
        <label for={field.name}>Last Name</label>
        <input
          id={field.name}
          type="text"
          placeholder="Last Name"
          value={field.state.value}
          onblur={() => field.handleBlur()}
          oninput={(e: Event) => {
            const target = e.target as HTMLInputElement
            field.handleChange(target.value)
          }}
        />
        <FieldInfo {field} />
      </div>
    {/snippet}
  </form.Field>
  <div>
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {#snippet children({ canSubmit, isSubmitting })}
        <button type="submit" disabled={!canSubmit}>
          {isSubmitting ? 'Submitting' : 'Submit'}
        </button>
      {/snippet}
    </form.Subscribe>
    <button
      type="button"
      id="reset"
      onclick={() => {
        form.reset()
      }}
    >
      Reset
    </button>
  </div>
</form>
