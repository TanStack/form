# Example Scenarios

Useful maintainer examples to scaffold:

- Schema-driven booking form: strict or loose schema mode, app-form components, named validator timing, and visible error workflow.
- Query-backed edit form: gated data loading or `emptyFormValues`, async submit, returned validation errors, and transient error ownership outside the form.
- Field-group reuse: one reusable date range or bounds section bound into multiple forms and array paths.
- Array rendering: `ArrayField` at the list boundary, `Field` for item properties, and array helpers for insert/remove/swap/move.
- Type-debugging fixture: small examples that intentionally trigger common type boundaries without using assertions.

Keep UI-library ownership honest. TanStack Form owns form state and validation; UI libraries own visuals; query libraries own transient async error state.
