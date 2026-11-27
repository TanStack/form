---
id: ServerFormState
title: ServerFormState
---

Defined in: [FormApi/formServerState.public.ts:16](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formServerState.public.ts#L16)

Server validation state with formatted error contents for hydration.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [FormApi/formServerState.public.ts:24](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formServerState.public.ts#L24)

***

### validationResults

```ts
validationResults: object[];
```

Defined in: [FormApi/formServerState.public.ts:18](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formServerState.public.ts#L18)

#### hasOutput?

```ts
optional hasOutput?: boolean;
```

#### output

```ts
output: unknown;
```

#### result

```ts
result: FormattedValidationResult<TFormData>;
```

#### validatorIndex

```ts
validatorIndex: number;
```

***

### values

```ts
values: TFormData | undefined;
```

Defined in: [FormApi/formServerState.public.ts:17](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formServerState.public.ts#L17)
