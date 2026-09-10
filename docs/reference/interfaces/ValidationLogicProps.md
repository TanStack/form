---
id: ValidationLogicProps
title: ValidationLogicProps
---

# Interface: ValidationLogicProps

Defined in: [packages/form-core/src/ValidationLogic.ts:21](https://github.com/TanStack/form/blob/main/packages/form-core/src/ValidationLogic.ts#L21)

## Properties

### event

```ts
event: object;
```

Defined in: [packages/form-core/src/ValidationLogic.ts:35](https://github.com/TanStack/form/blob/main/packages/form-core/src/ValidationLogic.ts#L35)

#### async

```ts
async: boolean;
```

#### fieldName?

```ts
optional fieldName: string;
```

#### type

```ts
type: "change" | "blur" | "submit" | "mount" | "server";
```

***

### form

```ts
form: AnyFormApi;
```

Defined in: [packages/form-core/src/ValidationLogic.ts:23](https://github.com/TanStack/form/blob/main/packages/form-core/src/ValidationLogic.ts#L23)

***

### group?

```ts
optional group: AnyFormGroupApi;
```

Defined in: [packages/form-core/src/ValidationLogic.ts:29](https://github.com/TanStack/form/blob/main/packages/form-core/src/ValidationLogic.ts#L29)

Set when the validators being processed belong to a `FormGroupApi`.
Allows validation strategies (e.g. `revalidateLogic`) to gate their
behavior on the group's own state instead of the parent form's.

***

### runValidation()

```ts
runValidation: (props) => void;
```

Defined in: [packages/form-core/src/ValidationLogic.ts:40](https://github.com/TanStack/form/blob/main/packages/form-core/src/ValidationLogic.ts#L40)

#### Parameters

##### props

###### form

[`AnyFormApi`](../type-aliases/AnyFormApi.md)

###### validators

(
  \| [`ValidationLogicValidatorsFn`](ValidationLogicValidatorsFn.md)
  \| `undefined`)[]

#### Returns

`void`

***

### validators

```ts
validators: 
  | FormValidators<any, any, any, any, any, any, any, any, any, any>
  | null
  | undefined;
```

Defined in: [packages/form-core/src/ValidationLogic.ts:31](https://github.com/TanStack/form/blob/main/packages/form-core/src/ValidationLogic.ts#L31)
