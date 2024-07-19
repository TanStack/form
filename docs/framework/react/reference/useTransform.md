---
id: useTransform
title: useTransform
---

# Function: useTransform()

```ts
function useTransform<TFormData, TFormValidator>(fn, deps): object
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **fn**

• **deps**: `unknown`[]

## Returns

`object`

### deps

```ts
deps: unknown[];
```

### fn()

```ts
fn: (formBase) => FormApi<TFormData, TFormValidator>;
```

#### Parameters

• **formBase**: `FormApi`\<`any`, `any`\>

#### Returns

`FormApi`\<`TFormData`, `TFormValidator`\>

## Defined in

[useTransform.ts:3](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/react-form/src/useTransform.ts#L3)
