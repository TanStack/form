<script setup lang="ts">
import { useForm } from '../../../src'

type Person = {
  firstName: string
  lastName: string
}

const form = useForm({
  defaultValues: {} as Person,
})
</script>

<template>
  <form.Field name="firstName" defaultValue="FirstName">
    <template v-slot="{ field }">
      <input
        data-testid="fieldinput"
        :value="field.state.value"
        @blur="field.handleBlur"
        @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
      />
    </template>
  </form.Field>
</template>
