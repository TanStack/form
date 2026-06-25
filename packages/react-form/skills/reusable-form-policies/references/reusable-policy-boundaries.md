# Reusable Policy Boundaries

Use `ReactFormType<typeof sharedOptions>` when a child component receives one known form. Keep the shared options submit-agnostic if the child should accept parent forms with different `onSubmit` handlers.

Use AppForm when the repeated thing is field JSX or application UI wiring. AppForm reduces repeated component composition; it is not the same problem as splitting a known form into child sections.

Use field groups when a section must work across different forms or paths. Do not accept `ReactFormType<A> | ReactFormType<B>` for shared sections.

Use `createErrorVisibility` when the visibility policy can be form-agnostic. The reusable callback sees `state.values` as `unknown`. Inline `errorVisibility` is better when the callback needs typed values from one specific form.

Use `createValidator` or `createValidators` when timing is the policy: `triggers`, `triggerDebounceMs`, `bailIfInvalid`, `runOnSubmit`, or a named workflow such as reward early and punish late.
