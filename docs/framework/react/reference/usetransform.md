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

[useTransform.ts:3](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/react-form/src/useTransform.ts#L3)
