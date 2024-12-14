---
id: Props
title: Props
---

# Interface: Props\<Input, Output\>

The Standard Schema properties interface.

## Type Parameters

• **Input** = `unknown`

• **Output** = `Input`

## Properties

### types?

```ts
readonly optional types: Types<Input, Output>;
```

Inferred types associated with the schema.

#### Defined in

[packages/form-core/src/standardSchemaValidator.ts:121](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L121)

***

### validate()

```ts
readonly validate: (value) => Result<Output> | Promise<Result<Output>>;
```

Validates unknown input values.

#### Parameters

##### value

`unknown`

#### Returns

[`Result`](../type-aliases/result.md)\<`Output`\> \| `Promise`\<[`Result`](../type-aliases/result.md)\<`Output`\>\>

#### Defined in

[packages/form-core/src/standardSchemaValidator.ts:115](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L115)

***

### vendor

```ts
readonly vendor: string;
```

The vendor name of the schema library.

#### Defined in

[packages/form-core/src/standardSchemaValidator.ts:111](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L111)

***

### version

```ts
readonly version: 1;
```

The version number of the standard.

#### Defined in

[packages/form-core/src/standardSchemaValidator.ts:107](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L107)
