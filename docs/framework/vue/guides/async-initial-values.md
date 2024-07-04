---
id: async-initial-values
title: Async Initial Values
---

Let's say that you want to fetch some data from an API and use it as the initial value of a form.

While this problem sounds simple on the surface, there are hidden complexities you might not have thought of thus far.

For example, you might want to show a loading spinner while the data is being fetched, or you might want to handle errors gracefully.
Likewise, you could also find yourself looking for a way to cache the data so that you don't have to fetch it every time the form is rendered.

While we could implement many of these features from scratch, it would end up looking a lot like another project we maintain: [TanStack Query](https://tanstack.com/query).

As such, this guide shows you how you can mix-n-match TanStack Form with TanStack Query to achieve the desired behavior.

## Basic Usage

```vue 
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form';
import { useQuery } from '@tanstack/vue-query';
import { watchEffect, reactive } from 'vue';

const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return { firstName: 'FirstName', lastName: "LastName" }
    }
});

const defaultValues = reactive({
    firstName: '',
    lastName: '',
});

watchEffect(() => {
    if (data.value) {
        defaultValues.firstName = data.value.firstName;
        defaultValues.lastName = data.value.lastName;
    }
});

const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
        // Do something with form data
        console.log(value)
    },
})
</script>

<template>
    <p v-if="isLoading">Loading..</p>
    <form v-else @submit.prevent.stop="form.handleSubmit">
        <!-- ... -->
    </form>
</template>
```

This will show a loading text until the data is fetched, and then it will render the form with the fetched data as the initial values.
