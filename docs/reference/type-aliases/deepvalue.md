---
id: DeepValue
title: DeepValue
---

# Type Alias: DeepValue\<TValue, TAccessor, TNullable\>

```ts
type DeepValue<TValue, TAccessor, TNullable>: unknown extends TValue ? TValue : TValue extends ReadonlyArray<any> ? TAccessor extends `[${infer TBrackets}].${infer TAfter}` ? DeepValue<DeepValue<TValue, TBrackets>, TAfter> : TAccessor extends `[${infer TBrackets}]` ? DeepValue<TValue, TBrackets> : TAccessor extends keyof TValue ? TValue[TAccessor] : TValue[TAccessor & number] : TValue extends Record<string | number, any> ? TAccessor extends `${infer TBefore}[${infer TEverythingElse}` ? DeepValue<DeepValue<TValue, TBefore>, `[${TEverythingElse}`> : TAccessor extends `[${infer TBrackets}]` ? DeepValue<TValue, TBrackets> : TAccessor extends `${infer TBefore}.${infer TAfter}` ? DeepValue<DeepValue<TValue, TBefore>, TAfter> : TAccessor extends string ? TNullable extends true ? Nullable<TValue[TAccessor]> : TValue[TAccessor] : never : never;
```

Infer the type of a deeply nested property within an object or an array.

## Type Parameters

• **TValue**

• **TAccessor**

• **TNullable** *extends* `boolean` = `IsNullable`\<`TValue`\>

## Defined in

[packages/form-core/src/util-types.ts:109](https://github.com/TanStack/form/blob/ab5a89b11f2af9f11c720387ff2da9e9d2b82764/packages/form-core/src/util-types.ts#L109)
