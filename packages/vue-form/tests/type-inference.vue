<script setup lang="ts">
import { defineComponent, h } from 'vue'
import {
  createFormHook,
  getFieldGroupHelpers,
  getFormHookHelpers,
  useForm,
} from '../src'
import type { FieldWithValue } from '../src'

const form = useForm({
  defaultValues: {
    name: 'Tony',
    people: [{ name: 'Rodney' }],
    guest: { email: 'tony@example.com' },
  },
})

const TextField = defineComponent<{
  field: FieldWithValue<string>
  label: string
}>({
  props: ['field', 'label'],
  setup(props) {
    return () => h('label', {}, `${props.label}: ${props.field.value}`)
  },
})

const { fieldComponent } = getFormHookHelpers()
const AppTextField = fieldComponent.strict(TextField, 'field')
const { useAppForm } = createFormHook({
  fieldComponents: { AppTextField },
  formComponents: {},
})
const appForm = useAppForm({ defaultValues: { name: 'Tony', age: 42 } })

const { helper, defineFields, withFields } = getFieldGroupHelpers()
const reusableFields = defineFields({ email: helper.strict<string>() })
const ReusableFields = defineComponent<{ fields: typeof reusableFields }>({
  props: ['fields'],
  setup: () => () => null,
})
const Reusable = withFields(reusableFields, ReusableFields, 'fields')
</script>

<template>
  <form.Field name="name" v-slot="{ field }">
    {{ field.value.toUpperCase() }}
    {{ field.meta.isTouched }}
  </form.Field>

  <form.ArrayField name="people" v-slot="{ field }">
    {{ field.value.length }}
  </form.ArrayField>

  <form.FormGroup name="guest" v-slot="{ group }">
    <group.Field name="email" v-slot="{ field }">
      {{ field.name }}:{{ field.value.toUpperCase() }}
    </group.Field>
  </form.FormGroup>

  <appForm.AppForm>
    <appForm.Field name="name" v-slot="{ field }">
      <field.AppTextField label="Name" />
    </appForm.Field>

    <appForm.Field name="age" v-slot="{ field }">
      <!-- @vue-expect-error string-only component is filtered from number fields -->
      <field.AppTextField label="Age" />
    </appForm.Field>
  </appForm.AppForm>

  <!-- @vue-expect-error root field names are checked -->
  <form.Field name="missing" />

  <!-- @vue-expect-error ArrayField only accepts array-valued paths -->
  <form.ArrayField name="name" />

  <Reusable :form="form" :fields="{ email: 'guest.email' }" />

  <!-- @vue-expect-error strict string slots reject array-valued paths -->
  <Reusable :form="form" :fields="{ email: 'people' }" />
</template>
