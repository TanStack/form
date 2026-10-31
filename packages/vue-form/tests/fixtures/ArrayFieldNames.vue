<script setup lang="ts">
import { createFormHook, getFormHookHelpers } from '../../src'
import ArrayItemControl from './ArrayItemControl.vue'

defineProps<{ mode: 'slot' | 'injected' }>()

const { fieldComponent } = getFormHookHelpers()
const { useAppForm } = createFormHook({
  fieldComponents: {
    ItemControl: fieldComponent.strict(ArrayItemControl, 'field'),
  },
  formComponents: {},
})
const form = useAppForm({
  defaultValues: { items: [] as Array<{ id: string; title: string }> },
})
// Push the items instead of using defaultValues: with no default at any index,
// moving a field leaves its value and meta unchanged, so only `name` changes.
form.pushFieldValue('items', { id: 'a', title: 'A' })
form.pushFieldValue('items', { id: 'b', title: 'B' })
form.pushFieldValue('items', { id: 'c', title: 'C' })
</script>

<template>
  <form.ArrayField name="items" v-slot="{ field: array }">
    <div v-for="(item, index) in array.value" :key="item.id">
      <form.Field :name="`items[${index}].title`" v-slot="{ field }">
        <ArrayItemControl
          v-if="mode === 'slot'"
          :field="field"
          :item-id="item.id"
        />
        <field.ItemControl v-else :item-id="item.id" />
      </form.Field>
    </div>
    <button @click="array.removeValue(0)">Remove first</button>
    <button @click="array.swapValues(0, 1)">Swap first two</button>
    <button @click="array.moveValue(0, 2)">Move first to last</button>
    <button @click="array.insertValue(0, { id: 'z', title: 'Z' })">
      Insert first
    </button>
  </form.ArrayField>
  <form.Subscribe :selector="(state) => state.values.items" v-slot="items">
    <output data-testid="titles">{{
      items.map((item) => `${item.id}:${item.title}`).join(',')
    }}</output>
  </form.Subscribe>
</template>
