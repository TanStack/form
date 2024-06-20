# Type alias: ValidationMeta

```ts
type ValidationMeta: object;
```

An object representing the validation metadata for a field. Not intended for public usage.

## Type declaration

### lastAbortController

```ts
lastAbortController: AbortController;
```

An abort controller stored in memory to cancel previous async validation attempts.

## Source

[packages/form-core/src/FormApi.ts:165](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FormApi.ts#L165)
