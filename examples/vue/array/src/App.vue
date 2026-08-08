<script setup lang="ts">
import { computed, ref } from 'vue'
import ArrayForm from './ArrayForm.vue'

const itemAmount = ref(50)
const requestedItemAmount = ref(50)
const items = computed(() => Array.from({ length: itemAmount.value }, () => ''))

function updateItems() {
  if (!Number.isNaN(requestedItemAmount.value)) {
    itemAmount.value = Math.min(10_000, Math.max(0, requestedItemAmount.value))
  }
}
</script>

<template>
  <div>
    <h1>Arrays in Form Example</h1>
    <label for="itemsAmount">
      Enter the amount of items to render with the form.
      <br />
      Note that it will reset the state.
    </label>
    <br />
    <input
      id="itemsAmount"
      v-model.number="requestedItemAmount"
      type="number"
      min="1"
      step="1"
      max="10000"
    />
    <button type="button" @click="updateItems">Update</button>

    <br />

    <ArrayForm :key="itemAmount" :items="items" />
  </div>
</template>
