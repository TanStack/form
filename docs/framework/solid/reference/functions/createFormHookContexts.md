---
id: createFormHookContexts
title: createFormHookContexts
---

# Function: createFormHookContexts()

```ts
function createFormHookContexts(): object;
```

Defined in: [packages/solid-form/src/createFormHook.tsx:68](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createFormHook.tsx#L68)

## Returns

`object`

### fieldContext

```ts
fieldContext: Context<Accessor<AnyFieldApi>>;
```

### formContext

```ts
formContext: Context<AnyFormApi>;
```

### useFieldContext()

```ts
useFieldContext: <TData>() => Accessor<FieldApi<any, string, TData, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>>;
```

#### Type Parameters

##### TData

`TData`

#### Returns

`Accessor`\<`FieldApi`\<`any`, `string`, `TData`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>\>

### useFormContext()

```ts
useFormContext: () => SolidFormExtendedApi<Record<string, never>, any, any, any, any, any, any, any, any, any, any, any>;
```

#### Returns

[`SolidFormExtendedApi`](../type-aliases/SolidFormExtendedApi.md)\<`Record`\<`string`, `never`\>, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>
