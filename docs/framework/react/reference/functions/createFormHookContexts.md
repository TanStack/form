---
id: createFormHookContexts
title: createFormHookContexts
---

# Function: createFormHookContexts()

```ts
function createFormHookContexts(): object;
```

Defined in: [packages/react-form/src/createFormHook.tsx:68](https://github.com/TanStack/form/blob/main/packages/react-form/src/createFormHook.tsx#L68)

## Returns

`object`

### fieldContext

```ts
fieldContext: Context<AnyFieldApi>;
```

### formContext

```ts
formContext: Context<AnyFormApi>;
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
