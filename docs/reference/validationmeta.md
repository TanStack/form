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

[packages/form-core/src/FormApi.ts:165](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/form-core/src/FormApi.ts#L165)
