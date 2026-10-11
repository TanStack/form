# Schema Validation And Submit Output

Schema validators can run alongside callback validators in the `validators` array.

`validatorOutputs` is ordered by validator position. If a validator does not run on submit, its output slot is undefined. Custom form and group validators can return `createOutput(data)` from their context to populate their slot too.

Use `createValidationError` for explicit form or field validation errors from submit code.

Use `parseIssues` for Standard Schema issue arrays. Issue paths can target nested object and array fields.

Do not put transient query, network, or framework failures into validation state. Validation state blocks submission.
