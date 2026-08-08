<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { type } from 'arktype'
import { Schema as S } from 'effect'
import * as v from 'valibot'
import { z } from 'zod'
import FieldInfo from './FieldInfo.vue'

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

const form = useForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
  validators: [
    {
      // Switch this run value to any of the schemas above.
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
})
</script>

<template>
  <div>
    <h1>Standard Schema Form Example</h1>
    <form @submit.prevent.stop="form.handleSubmit()">
      <div>
        <form.Field name="firstName" v-slot="{ field }">
          <label :for="field.name">First Name:</label>
          <input
            :id="field.name"
            :name="field.name"
            :value="field.value"
            :aria-invalid="field.meta.isInvalid"
            @blur="field.handleBlur"
            @input="
              field.handleChange(($event.target as HTMLInputElement).value)
            "
          />
          <FieldInfo :field="field" />
        </form.Field>
      </div>

      <div>
        <form.Field name="lastName" v-slot="{ field }">
          <label :for="field.name">Last Name:</label>
          <input
            :id="field.name"
            :name="field.name"
            :value="field.value"
            :aria-invalid="field.meta.isInvalid"
            @blur="field.handleBlur"
            @input="
              field.handleChange(($event.target as HTMLInputElement).value)
            "
          />
          <FieldInfo :field="field" />
        </form.Field>
      </div>

      <form.Subscribe
        :selector="(state) => [state.canSubmit, state.isSubmitting] as const"
        v-slot="[canSubmit, isSubmitting]"
      >
        <button type="submit" :disabled="!canSubmit">
          {{ isSubmitting ? '...' : 'Submit' }}
        </button>
      </form.Subscribe>
    </form>
  </div>
</template>
