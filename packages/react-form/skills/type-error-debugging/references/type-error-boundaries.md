# Type Error Boundaries

Schema option mode: check whether defaults-first, strict schema, or loose schema matches the intended source of truth.

Schema output: raw `value` is editable form state; parsed output is in `schemaOutputs`.

Submit return: reusable child form props can become too specific if shared options include an `onSubmit` type.

Error visibility: reusable `createErrorVisibility` callbacks see unknown values.

Validator helpers: `createValidators` requires one run function per options entry.

Form groups: values and paths are group-scoped.

Field groups: use virtual paths inside the group and real paths only in bindings.

Deep keys: array paths use bracket segments such as `users[0].name`.

Public API: use `atom` and adapter subscriptions, not private store shapes.
