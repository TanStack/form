<script setup lang="ts">
import { useFormContext } from "./formContext";

const props = defineProps();

const formContext = useFormContext();

formContext
</script>

<template>
  <slot/>
</template>
