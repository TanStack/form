---
id: createFormHookContexts
title: createFormHookContexts
---

```ts
function createFormHookContexts(): object;
```

Defined in: [packages/octane-form/src/createFormHook.tsrx.d.ts:73](https://github.com/TanStack/form/blob/main/packages/octane-form/src/createFormHook.tsrx.d.ts#L73)

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
useFormContext: () => OctaneFormExtendedApi<Record<string, never>, any, any, any, any, any, any, any, any, any, any, any>;
```

#### Returns

[`OctaneFormExtendedApi`](../type-aliases/OctaneFormExtendedApi.md)\<`Record`\<`string`, `never`\>, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>
