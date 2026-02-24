---
id: revalidateLogic
title: revalidateLogic
---

# Function: revalidateLogic()

```ts
function revalidateLogic(__namedParameters): ValidationLogicFn;
```

Defined in: [packages/form-core/src/ValidationLogic.ts:68](https://github.com/TanStack/form/blob/main/packages/form-core/src/ValidationLogic.ts#L68)

This forces a form's validation logic to be ran as if it were a React Hook Form validation logic.

This means that it will only run the `onDynamic` validator, and it will not run any other validators and changes the validation
type based on the state of the form itself.

When the form is not yet submitted, it will not run the validation logic.
When the form is submitted, it will run the validation logic on `change`

## Parameters

### \_\_namedParameters

`RevalidateLogicProps` = `{}`

## Returns

[`ValidationLogicFn`](../type-aliases/ValidationLogicFn.md)
