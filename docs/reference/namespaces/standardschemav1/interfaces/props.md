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

node\_modules/.pnpm/@standard-schema+spec@1.0.0-beta.4/node\_modules/@standard-schema/spec/dist/index.d.ts:30

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

node\_modules/.pnpm/@standard-schema+spec@1.0.0-beta.4/node\_modules/@standard-schema/spec/dist/index.d.ts:26

***

### vendor

```ts
readonly vendor: string;
```

The vendor name of the schema library.

#### Defined in

node\_modules/.pnpm/@standard-schema+spec@1.0.0-beta.4/node\_modules/@standard-schema/spec/dist/index.d.ts:22

***

### version

```ts
readonly version: 1;
```

The version number of the standard.

#### Defined in

node\_modules/.pnpm/@standard-schema+spec@1.0.0-beta.4/node\_modules/@standard-schema/spec/dist/index.d.ts:18
