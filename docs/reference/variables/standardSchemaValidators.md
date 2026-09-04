---
id: standardSchemaValidators
title: standardSchemaValidators
---

# Variable: standardSchemaValidators

```ts
const standardSchemaValidators: object;
```

Defined in: [packages/form-core/src/standardSchemaValidator.ts:73](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L73)

## Type Declaration

### validate()

```ts
validate<TSource>(__namedParameters, schema): 
  | TStandardSchemaValidatorIssue<TSource>
  | undefined;
```

#### Type Parameters

##### TSource

`TSource` *extends* [`ValidationSource`](../type-aliases/ValidationSource.md) = [`ValidationSource`](../type-aliases/ValidationSource.md)

#### Parameters

##### \_\_namedParameters

[`TStandardSchemaValidatorValue`](../type-aliases/TStandardSchemaValidatorValue.md)\<`unknown`, `TSource`\>

##### schema

[`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)

#### Returns

  \| [`TStandardSchemaValidatorIssue`](../type-aliases/TStandardSchemaValidatorIssue.md)\<`TSource`\>
  \| `undefined`

### validateAsync()

```ts
validateAsync<TSource>(__namedParameters, schema): Promise<
  | TStandardSchemaValidatorIssue<TSource>
| undefined>;
```

#### Type Parameters

##### TSource

`TSource` *extends* [`ValidationSource`](../type-aliases/ValidationSource.md)

#### Parameters

##### \_\_namedParameters

[`TStandardSchemaValidatorValue`](../type-aliases/TStandardSchemaValidatorValue.md)\<`unknown`, `TSource`\>

##### schema

[`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)

#### Returns

`Promise`\<
  \| [`TStandardSchemaValidatorIssue`](../type-aliases/TStandardSchemaValidatorIssue.md)\<`TSource`\>
  \| `undefined`\>
