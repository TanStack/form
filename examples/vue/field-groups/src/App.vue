<script setup lang="ts">
import AgeRangeForm from './forms/AgeRangeForm.vue'
import NestedFieldGroupsForm from './forms/NestedFieldGroupsForm.vue'
import PricingFilterForm from './forms/PricingFilterForm.vue'
import SwappableDateRangesForm from './forms/SwappableDateRangesForm.vue'
</script>

<template>
  <div>
    <h1>Field Group example</h1>
    <section>
      <h2>Price Filter Form</h2>
      <PricingFilterForm />
    </section>
    <section>
      <h2>Age Range Form</h2>
      <AgeRangeForm />
    </section>
    <section>
      <h2>Nested Field Groups</h2>
      <NestedFieldGroupsForm />
    </section>
    <section>
      <h2>Swappable Date Ranges Form</h2>
      <SwappableDateRangesForm />
    </section>
  </div>
</template>
