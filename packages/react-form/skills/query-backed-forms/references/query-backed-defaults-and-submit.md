# Query-Backed Defaults And Submit

Default-values plan:

- Gate the form or fields until query data is available.
- Or provide a static, shape-complete `emptyFormValues` object and pass `query.data ?? emptyFormValues`.

Neither plan is globally preferred. Gating gives correct initial mounted values. Fallback values let the form render immediately.

Submit plan:

- Use an async promise in `onSubmit` so `isSubmitting` reflects the request.
- Return `createValidationError` or `parseIssues` only for validation-shaped responses.
- Let transient failures throw or reject when the query/framework layer owns that error state.

Validation state blocks submit. Transient error state should not be validation state.
