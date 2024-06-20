# Function: useTransform()

```ts
function useTransform<TFormData, TFormValidator>(fn, deps): object
```

## Type parameters

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

## Source

[useTransform.ts:3](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/react-form/src/useTransform.ts#L3)