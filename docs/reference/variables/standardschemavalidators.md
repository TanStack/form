---
id: standardSchemaValidators
title: standardSchemaValidators
---

# Variable: standardSchemaValidators

```ts
const standardSchemaValidators: object;
```

Defined in: [packages/form-core/src/standardSchemaValidator.ts:48](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L48)

## Type declaration

### validate()

#### Parameters

##### \_\_namedParameters

[`TStandardSchemaValidatorValue`](../type-aliases/tstandardschemavalidatorvalue.md)\<`unknown`\>

##### schema

[`StandardSchemaV1`](../type-aliases/standardschemav1.md)

#### Returns

  \| `undefined`
  \| readonly [`StandardSchemaV1Issue`](../interfaces/standardschemav1issue.md)[]
  \| \{
  `fields`: \{\};
  `form`: \{\};
 \}

### validateAsync()

#### Parameters

##### \_\_namedParameters

[`TStandardSchemaValidatorValue`](../type-aliases/tstandardschemavalidatorvalue.md)\<`unknown`\>

##### schema

[`StandardSchemaV1`](../type-aliases/standardschemav1.md)

#### Returns

`Promise`\<
  \| `undefined`
  \| readonly [`StandardSchemaV1Issue`](../interfaces/standardschemav1issue.md)[]
  \| \{
  `fields`: \{\};
  `form`: \{\};
 \}\>
