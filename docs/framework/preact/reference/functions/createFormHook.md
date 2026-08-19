---
id: createFormHook
title: createFormHook
---

# Function: createFormHook()

```ts
function createFormHook<TFormComponents, TFieldComponents>(createOptions): AppFormHookResult<{
  fieldComponents: TFieldComponents;
  formComponents: TFormComponents;
}>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHook.public.ts:20](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHook.public.ts#L20)

## Type Parameters

### TFormComponents

`TFormComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Parameters

### createOptions

[`CreateFormHookOptions`](../interfaces/CreateFormHookOptions.md)\<`TFormComponents`, `TFieldComponents`\>

## Returns

[`AppFormHookResult`](../interfaces/AppFormHookResult.md)\<\{
  `fieldComponents`: `TFieldComponents`;
  `formComponents`: `TFormComponents`;
\}\>
