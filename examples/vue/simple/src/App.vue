<script setup lang="ts">
import { useTest, Test } from '@tanstack/vue-form'

const test = useTest()
console.log(test.value)
</script>

<template>
  <Test />
</template>
