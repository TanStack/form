# Schema Validation And Submit Output

Schema validators can run alongside callback validators in the `validators` array.

`schemaOutputs` is ordered by validator position. If a validator does not run on submit, its schema output slot can be absent or undefined.

Use `createValidationError` for explicit form or field validation errors from submit code.

Use `parseIssues` for Standard Schema issue arrays. Issue paths can target nested object and array fields.

Do not put transient query, network, or framework failures into validation state. Validation state blocks submission.
