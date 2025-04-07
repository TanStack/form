---
id: submission-handling
title: Submission handling
---

In a situation where you want to have multiple form submission types, for example, a form that has a button that navigates to a sub-form and another button that handles a standard submission, you can make use of the onSubmitMeta prop and the handleSubmit function overloads.

## Basic Usage

First you must define the default state of the form.onSubmitMeta prop:

```tsx
const form = useForm({
  defaultValues: {
    firstName: 'Rick',
  },
  // {} is the default value passed to `onSubmit`'s `meta` property
  onSubmitMeta: {} as { lastName: string },
  onSubmit: async ({ value, meta }) => {
    // Do something with the values passed via handleSubmit
    console.log(`${value.firstName} - ${meta}`)
  },
})
```

Note: the default state of onSubmitMeta is `never`, so if the prop is not provided and you try to access it in `handleSubmit`, or `onSubmit` it will error.

Then when you call `onSubmit` you can provide it the predefined meta like so:

```tsx
<form
  onSubmit={(e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit({
      lastName: 'Astley',
    })
  }}
></form>
```
