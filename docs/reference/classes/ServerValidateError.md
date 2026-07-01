---
id: ServerValidateError
title: ServerValidateError
---

# ~~Class: ServerValidateError\<TFormData, TFormValidators\>~~

Defined in: [packages/form-core/src/ssr.public.ts:71](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L71)

## Deprecated

Server validation failures are returned as
`ServerValidateFailure` instead of being thrown.

## Extends

- `Error`

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`TFormData`\>

## Implements

- `ServerValidateErrorState`\<`TFormData`, `TFormValidators`\>

## Constructors

### Constructor

```ts
new ServerValidateError<TFormData, TFormValidators>(options): ServerValidateError<TFormData, TFormValidators>;
```

Defined in: [packages/form-core/src/ssr.public.ts:80](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L80)

#### Parameters

##### options

`ServerValidateErrorState`\<`TFormData`, `TFormValidators`\>

#### Returns

`ServerValidateError`\<`TFormData`, `TFormValidators`\>

#### Overrides

```ts
Error.constructor
```

## Properties

### ~~cause?~~

```ts
optional cause: unknown;
```

Defined in: node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### Inherited from

```ts
Error.cause
```

***

### ~~message~~

```ts
message: string;
```

Defined in: node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

```ts
Error.message
```

***

### ~~name~~

```ts
name: string;
```

Defined in: node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1074

#### Inherited from

```ts
Error.name
```

***

### ~~serverState~~

```ts
serverState: ServerFormState<TFormData, TFormValidators>;
```

Defined in: [packages/form-core/src/ssr.public.ts:78](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L78)

#### Implementation of

```ts
ServerValidateErrorState.serverState
```

***

### ~~stack?~~

```ts
optional stack: string;
```

Defined in: node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

```ts
Error.stack
```
