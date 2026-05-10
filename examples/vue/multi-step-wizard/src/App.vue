<script setup lang="ts">
import { revalidateLogic, useForm } from '@tanstack/vue-form'
import { ref } from 'vue'
import { z } from 'zod'
import { step1Schema, step2Schema, wizardFormOpts } from './shared-form'

const step = ref(0)

const form = useForm({
  ...wizardFormOpts,
  validationLogic: revalidateLogic(),
  validators: {
    // onDynamic is only used when `form.handleSubmit` is called itself.
    // When `form.FormGroup`'s `handleSubmit` is called, it will only validate the current step's schema.
    // This means that this schema will not be called when the user submits the form group, but instead when they submit the entire form.
    onDynamic: z.object({
      step1: step1Schema,
      step2: step2Schema,
    }),
  },
  onSubmit: ({ value }) => {
    alert(`Form submitted: ${JSON.stringify(value)}`)
  },
})

const onGroupSubmit = () => {
  step.value++
}

const onGroupSubmitInvalid = () => {
  // Just like a form, you can also handle invalid submits at the group level, which is useful for multi-step wizards to prevent going to the next step if the current step is invalid
}

const stringify = (value: unknown) => JSON.stringify(value, null, 2)
</script>

<template>
  <form.FormGroup
    v-if="step === 0"
    name="step1"
    :validators="{ onDynamic: step1Schema }"
    :onGroupSubmit="onGroupSubmit"
    :onGroupSubmitInvalid="onGroupSubmitInvalid"
    v-slot="{ group: formGroup }"
  >
    <form @submit.prevent.stop="formGroup.handleSubmit()">
      <form.Field name="step1.name" v-slot="{ field }">
        <div>
          <label>
            <div>Step 1 Name</div>
            <input
              :value="field.state.value"
              @input="
                field.handleChange(($event.target as HTMLInputElement).value)
              "
              @blur="field.handleBlur()"
            />
          </label>
          <div
            v-for="error of field.state.meta.errors"
            :key="error?.message"
            style="color: red"
          >
            {{ error?.message }}
          </div>
        </div>
      </form.Field>
      <form.Subscribe
        :selector="(state) => state.isSubmitting"
        v-slot="isSubmitting"
      >
        <button type="submit" :disabled="isSubmitting">Submit</button>
      </form.Subscribe>
      <!-- formGroup contains errorMaps and errors, just like forms and fields -->
      <pre>{{ stringify(formGroup.state.meta.errorMap) }}</pre>
    </form>
  </form.FormGroup>
  <form.FormGroup
    v-if="step === 1"
    name="step2"
    :validators="{ onDynamic: step2Schema }"
    :onGroupSubmit="() => form.handleSubmit()"
    v-slot="{ group: formGroup }"
  >
    <form @submit.prevent.stop="formGroup.handleSubmit()">
      <form.Field name="step2.name" v-slot="{ field }">
        <div>
          <label>
            <div>Step 2 Name</div>
            <input
              :value="field.state.value"
              @input="
                field.handleChange(($event.target as HTMLInputElement).value)
              "
              @blur="field.handleBlur()"
            />
          </label>
          <div
            v-for="error of field.state.meta.errors"
            :key="error?.message"
            style="color: red"
          >
            {{ error?.message }}
          </div>
        </div>
      </form.Field>
      <button @click="step--">Back</button>
      <form.Subscribe
        :selector="(state) => state.isSubmitting"
        v-slot="isSubmitting"
      >
        <button type="submit" :disabled="isSubmitting">Submit</button>
      </form.Subscribe>
    </form>
  </form.FormGroup>
</template>
