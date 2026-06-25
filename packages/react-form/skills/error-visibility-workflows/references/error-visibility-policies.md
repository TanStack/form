# Error Visibility Policies

Useful policies:

- Show after blur: `fieldState.meta.isBlurred`
- Show after submit: `state.submissionAttempts > 0`
- Show after blur or submit: `fieldState.meta.isBlurred || state.submissionAttempts > 0`
- Show while dirty: `fieldState.meta.isDirty`

Reusable policies created by `createErrorVisibility` must be value-agnostic.

Visibility callbacks see pre-filter field meta. Do not inspect visible `errors` to decide whether errors should become visible.

Form groups scope scalar state such as `submissionAttempts` to the nearest group.
