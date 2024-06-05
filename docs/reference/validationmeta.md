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

[packages/form-core/src/FormApi.ts:165](https://github.com/TanStack/form/blob/19d935c69213e853289898ebd84f9d212a145038/packages/form-core/src/FormApi.ts#L165)
