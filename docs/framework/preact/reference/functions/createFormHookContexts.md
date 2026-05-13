---
id: createFormHookContexts
title: createFormHookContexts
---

# Function: createFormHookContexts()

```ts
function createFormHookContexts(): object;
```

Defined in: [packages/preact-form/src/createFormHook.tsx:91](https://github.com/TanStack/form/blob/main/packages/preact-form/src/createFormHook.tsx#L91)

## Returns

`object`

### fieldContext

```ts
fieldContext: Context<AnyFieldApi> = FieldContext;
```

### formContext

```ts
formContext: Context<AnyFormApi> = FormContext;
```

### useFieldContext()

```ts
useFieldContext: <TData>() => FieldApi<any, string, TData, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
```

#### Type Parameters

##### TData

`TData`

#### Returns

`FieldApi`\<`any`, `string`, `TData`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>

### useFormContext()

```ts
useFormContext: () => ReactFormExtendedApi<Record<string, never>, any, any, any, any, any, any, any, any, any, any, any>;
```

#### Returns

[`ReactFormExtendedApi`](../type-aliases/ReactFormExtendedApi.md)\<`Record`\<`string`, `never`\>, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>
