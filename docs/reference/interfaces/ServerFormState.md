---
id: ServerFormState
title: ServerFormState
---

Defined in: [FormApi/formServerState.public.ts:11](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formServerState.public.ts#L11)

## Type Parameters

### TFormData

`TFormData`

## Properties

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [FormApi/formServerState.public.ts:19](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formServerState.public.ts#L19)

***

### validationResults

```ts
validationResults: object[];
```

Defined in: [FormApi/formServerState.public.ts:13](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formServerState.public.ts#L13)

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
result: FormValidationResult<TFormData>;
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

Defined in: [FormApi/formServerState.public.ts:12](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formServerState.public.ts#L12)
