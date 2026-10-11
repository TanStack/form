---
'@tanstack/angular-form': minor
'@tanstack/form-core': minor
'@tanstack/preact-form': minor
'@tanstack/react-form': minor
---

BREAKING: `schemaOutputs` no longer exists. It is superceded by `validatorOutputs`. This is only a name change, the schema's result is the same as before

`validatorOutputs` now allows a callback validator to specify data that the submit function should know. Schemas do this
automatically, but now you can do it manually as well:
`run: ({ createOutput }) => createOutput('This is not a validation error and onSubmit can use this')`

The current map is:

| Validator                  | `onSubmit: ({ validatorOutputs }) => ...` |
| -------------------------- | ----------------------------------------- |
| Schema                     | Schema's output data                      |
| `createOutput(X)`          | `X`                                       |
| Default callback validator | `undefined`                               |
| Validation error           | N/A, `onSubmit` doesn't run               |
