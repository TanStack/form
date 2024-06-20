# Type alias: DeepValue\<TValue, TAccessor, TNullable\>

```ts
type DeepValue<TValue, TAccessor, TNullable>: unknown extends TValue ? TValue : TValue extends ReadonlyArray<any> ? TAccessor extends `[${infer TBrackets}].${infer TAfter}` ? DeepValue<DeepValue<TValue, TBrackets>, TAfter> : TAccessor extends `[${infer TBrackets}]` ? DeepValue<TValue, TBrackets> : TAccessor extends keyof TValue ? TValue[TAccessor] : TValue[TAccessor & number] : TValue extends Record<string | number, any> ? TAccessor extends `${infer TBefore}[${infer TEverythingElse}` ? DeepValue<DeepValue<TValue, TBefore>, `[${TEverythingElse}`> : TAccessor extends `[${infer TBrackets}]` ? DeepValue<TValue, TBrackets> : TAccessor extends `${infer TBefore}.${infer TAfter}` ? DeepValue<DeepValue<TValue, TBefore>, TAfter> : TAccessor extends string ? TNullable extends true ? Nullable<TValue[TAccessor]> : TValue[TAccessor] : never : never;
```

Infer the type of a deeply nested property within an object or an array.

## Type parameters

• **TValue**

• **TAccessor**

• **TNullable** *extends* `boolean` = `IsNullable`\<`TValue`\>

## Source

[packages/form-core/src/util-types.ts:111](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/util-types.ts#L111)
