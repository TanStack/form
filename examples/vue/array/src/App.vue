<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'

const form = useForm({
  defaultValues: {
    people: [] as Array<{ age: number; name: string }>,
  },
  onSubmit: ({ value }) => alert(JSON.stringify(value)),
})
</script>

<template>
  <form
    @submit="
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }
    "
  >
    <div>
      <form.Field name="people">
        <template v-slot="{ field, state }">
          <div>
            <form.Field
              v-for="(_, i) of field.state.value"
              :key="i"
              :name="`people[${i}].name`"
            >
              <template v-slot="{ field: subField, state }">
                <div>
                  <label>
                    <div>Name for person {{ i }}</div>
                    <input
                      :value="subField.state.value"
                      @input="
                        (e) =>
                          subField.handleChange(
                            (e.target as HTMLInputElement).value,
                          )
                      "
                    />
                  </label>
                </div>
              </template>
            </form.Field>

            <button
              @click="field.pushValue({ name: '', age: 0 })"
              type="button"
            >
              Add person
            </button>
          </div>
        </template>
      </form.Field>
    </div>
    <form.Subscribe>
      <template v-slot="{ canSubmit, isSubmitting }">
        <button type="submit" :disabled="!canSubmit">
          {{ isSubmitting ? '...' : 'Submit' }}
        </button>
      </template>
    </form.Subscribe>
  </form>
</template>
