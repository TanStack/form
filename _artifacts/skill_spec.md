# TanStack Form V2 Skill Spec

Status: reviewed, Phase 5 finalized.

This reviewed artifact follows the `pnpm intent:scaffold` domain-discovery workflow. It is intentionally adapter-first: user-facing guidance starts from `@tanstack/react-form`, with `@tanstack/form-core` used as the source of concepts and behavior rather than as a workflow entrypoint.

## Scope

In scope:

- React form composition with `useForm`, `form.Field`, `form.ArrayField`, `form.Subscribe`, app-form helpers, and field groups.
- Standard Schema-compatible schema usage.
- Choosing between default form options, `strictSchema`, and `looseSchema`.
- Query-like async defaults and mutation-like submit handling.
- Error visibility callback workflows.
- Split-form helper types and reusable validation or visibility policy modules.
- Type error diagnosis for schema/form composition.
- Authoring richer React examples.

Out of scope for this pass:

- Devtools as an entrypoint.
- Migration guidance.
- Schema metadata extraction, such as automatically deriving required labels.
- TanStack Form owning transient or non-validation error state.
- Teaching UI-library behavior as part of TanStack Form itself.
- Solid-first coverage.

## Hard Do Nots

- Do not type assert to make TanStack Form code compile. The library is built around inference, and assertions are usually a sign that the code is fighting the API.
- Do not write field names like ``name={`users[${index}].name` as const}``; `name` is inferred without the assertion.
- Do not annotate render-prop children as `any`; field children already receive inferred field APIs.
- Do not shim field prop types by hand, such as `{ value: string }`; use inferred render-prop types, `FieldWithValue<T>`, or `AnyFieldApi` when a reusable component needs an explicit field prop type.
- Do not treat validation errors and transient errors as the same thing. Errors stored from validators or `onSubmit` block the user from submitting.
- Do not store query/network/framework transient failures as form validation errors. Most query libraries already own transient error state; use that state instead.
- Do not throw validation errors from validators or `onSubmit`; validation errors must be returned values, such as `createValidationError` or `parseIssues`.
- Do not type a shared section as `form: FormA | FormB` where each form is a different `ReactFormType`; TypeScript cannot make sense of that union. Use field groups for shared sections that need to work across different forms.

## Proposed Skills

### 1. React Form Composition Setup

Purpose: Help users build adapter-first React forms, reusable field components, app-form setups, field groups, arrays, and UI-library bindings.

Primary APIs:

- `useForm`
- `ReactFormType`
- `FieldWithValue`
- `AnyFieldApi`
- `formOptions`
- `createFormHook`
- `form.Field`
- `form.ArrayField`
- `form.Subscribe`
- `form.FormGroup`
- `withFields`

Core guidance:

- Start from `@tanstack/react-form`, not `@tanstack/form-core`.
- Use render-prop field APIs and subscriptions for state reads.
- Treat `useForm` and `useAppForm` as stable form creation hooks, not reactive state reads by themselves.
- Use `useSelector` or `form.Subscribe` when component output must update in response to form state.
- Use app-form helpers when an application wants reusable field and form components.
- Keep shared form options submit-agnostic when child components need to accept forms with different `onSubmit` handlers.
- Use `ReactFormType<typeof sharedFormOptions>` as one option for splitting a known form into child sections that receive the form as a prop.
- Do not use unions like `ReactFormType<typeof formAOptions> | ReactFormType<typeof formBOptions>` for shared sections; use field groups when one section should bind into multiple different forms.
- Use AppForm to reduce repeated field JSX boilerplate. Use split form sections to reduce component nesting. Use field groups for reusable sections that bind to different form paths or different forms.
- Let field `name` props and render-prop children infer their types; use `FieldWithValue<T>` or `AnyFieldApi` for explicit reusable field component props.
- `form.Field` may bind to an array value. It treats that array immutably like any other field value, so changing one element changes the field `value` and rerenders consumers of the whole array field.
- Use `form.ArrayField` when the array is a rendering boundary for child fields or list items, and those child fields are the reactive units the example cares about.
- Use array helpers for array mutations and reorders.

Important failure modes:

- Adding `as const`, `as any`, render-prop `field: any`, or other assertions to force form code to compile.
- Shimming field prop types by hand instead of using inferred field types, `FieldWithValue<T>`, or `AnyFieldApi`.
- Reading from the stable `useForm` or `useAppForm` return and expecting the component to re-render as form state changes.
- Importing core directly in examples or application code.
- Rendering app field components outside their required app-form or field context.
- Making a reusable child form prop too specific by baking in an `onSubmit` type.
- Splitting a form by hand-writing a large form prop type instead of deriving it from shared options with `ReactFormType`.
- Typing a shared section as a union of multiple `ReactFormType` forms instead of using field groups.
- Using `form.Field` to render a list of child fields, then being surprised that item changes rerender the whole array-value consumer.
- Treating `form.ArrayField` as required for every array-typed value, instead of using it when the array will render child fields or list items.
- Mutating arrays manually and desynchronizing values from field meta.

Source trail:

- `packages/react-form/src/ReactForm/Components.public.ts`
- `packages/react-form/src/ReactForm/ReactFormApi.lib.tsx`
- `packages/react-form/src/Subscribe.public.tsx`
- `packages/react-form/src/ReactForm/fieldSubscriptions.lib.ts`
- `packages/react-form/src/AppForm/createFormHook.public.ts`
- `packages/react-form/src/AppForm/contexts.lib.ts`
- `docs/reference/type-aliases/FieldWithValue.md`
- `docs/reference/type-aliases/AnyFieldApi.md`
- `docs/framework/react/reference/type-aliases/ReactFormType.md`
- `packages/react-form/tests/submit-return.test-d.tsx`
- `packages/form-core/src/FormApi/array-methods.lib.ts`
- `packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts`
- `packages/form-core/src/FieldApi/fieldState.lib.ts`
- `examples/react/array/src/index.tsx`
- `examples/react/basic-splitting-form/src/index.tsx`
- `examples/react/basic-splitting-form/src/FormSection.tsx`
- `examples/react/basic-splitting-form/src/StringField.tsx`
- `examples/react/basic-splitting-form/src/FieldError.tsx`
- `examples/react/ui-integration/shadcn/src/components/form/app-form.ts`

### Cross-Cutting: Reusable Form Policies

Purpose: Help agents recognize when form behavior should be extracted into a named reusable helper rather than repeated inline.

Primary APIs:

- `ReactFormType`
- `createErrorVisibility`
- `createValidator`
- `createValidators`
- shared `formOptions` / `appFormOptions`

Core guidance:

- Use `ReactFormType<typeof sharedFormOptions>` as the helper type for split form sections that receive a `form` prop.
- Treat `ReactFormType` splitting as one composition option, not a general replacement for AppForm or field groups.
- AppForm reduces repeated field JSX boilerplate; split sections reduce nesting in a known form; field groups cover shared sections across different forms or field paths.
- Prefer form-level `errorVisibility` callbacks over scattered local patterns like `const showErrors = field.meta.isTouched && field.meta.isInvalid`.
- Use helper functions mainly when a callback or validator config deserves a semantic name that preserves intent.
- Extract validator configs with `createValidator` or `createValidators` when trigger timing, debounce, `bailIfInvalid`, or `runOnSubmit` policy is complex enough to name.
- Use comments or JSDoc on named helpers to explain behavior intent, such as why errors wait for blur or submit, or why a validator uses a `rewardEarlyPunishLate` policy.
- Keep reusable policies value-agnostic unless they are intentionally tied to a specific form shape; inline callbacks are better when typed values are required.

Important failure modes:

- A split form loses field-name inference because the child prop type was hand-written.
- A shared section accepts `FormA | FormB` and TypeScript cannot narrow field names or form methods enough to make the section usable.
- Error display behavior is scattered through local `showErrors` variables instead of being controlled by form-level `errorVisibility`.
- A complex visibility workflow is duplicated inline and later examples preserve code shape but lose the user-workflow reason.
- Validator trigger settings are copied without explanation, so agents cannot tell whether `blur`, `change`, debounce, or `bailIfInvalid` is intentional.
- A reusable visibility function tries to read a concrete `state.values.name` even though reusable visibility callbacks are form-agnostic.

Source trail:

- `examples/react/basic-splitting-form/src/FormSection.tsx`
- `examples/react/basic-splitting-form/src/sharedForm.ts`
- `packages/react-form/tests/submit-return.test-d.tsx`
- `packages/form-core/tests/validation.test.ts`
- `packages/form-core/tests/validation.test-d.ts`
- `examples/react/ui-integration/shadcn/src/app/booking/shared-form.tsx`

### 2. Choosing Form Options Modes

Purpose: Help users decide between default `formOptions`, `strictSchema`, and `looseSchema`.

Primary APIs:

- `formOptions`
- `formOptions.strictSchema`
- `formOptions.looseSchema`
- `appFormOptions`
- `appFormOptions.strictSchema`
- `appFormOptions.looseSchema`

Core guidance:

- Treat the option helpers as runtime identity helpers with type-level meaning.
- Use default `formOptions` when the form should be inferred from `defaultValues`; the default values are taken at face value and that type flows into validators and callbacks.
- Default `formOptions` is especially useful for callback-based validation because callback `value` is already typed from the form defaults.
- Use `strictSchema` when the schema is the source of typing and acts as a transforming pipeline from input type to output type.
- In `strictSchema`, `defaultValues` should type-check against the schema input type. If they do not align, the defaults should produce type errors.
- Use `looseSchema` when the schema is a ruleset for confirming valid output, but editable defaults need nullable or undefined values, such as a date field that starts as `null`.
- In `looseSchema`, default values must still align with the schema shape, but properties may also be `null` or `undefined` where editing requires it.
- In both schema modes, callbacks may not have useful inference unless there is a schema in the validator array for the helper to infer from.
- In both schema modes, `onSubmit` should read the parsed transform output from `schemaOutputs` rather than raw `value`.
- Treat pipeline-vs-ruleset as TanStack Form guidance, not a Standard Schema concept. Standard Schema only gives the shared validation/typing interface.
- Explain the mental model as: is this schema a pipeline of constraints/transforms, or a firewall that only lets valid values through?
- List current Standard Schema-capable libraries as examples with a general leaning, not as hard categories.
- Zod generally leans ruleset/firewall for form work, while explicit transforms/codecs can still make a Zod schema pipeline-like.
- Valibot generally leans pipeline because its docs center `pipe` and validation/transformation actions.
- ArkType is mixed: structural constraints often read like a firewall, while morphs/pipes can make it pipeline-like.
- Effect Schema often leans pipeline/codec when used as an encoded-to-decoded boundary.

Important failure modes:

- Expecting `strictSchema` or `looseSchema` to add runtime validation by itself.
- Using default `formOptions` while expecting the schema to be the source of the form type.
- Using strict schema mode for a form whose editable UI states cannot satisfy the schema type.
- Using `looseSchema` but providing default values that no longer match the schema shape at all.
- Using schema modes without putting a schema in the validator array, then expecting callbacks to infer from that schema.
- Using loose schema mode for a true pipeline and then reading raw `value` as if it were parsed output.
- Reading `value` in `onSubmit` for schema-mode forms instead of reading the corresponding `schemaOutputs` entry.
- Treating all Zod `input` and `output` differences as a real pipeline decision.

Source trail:

- `packages/form-core/src/utils.public.ts`
- `packages/react-form/src/AppForm/appFormOptions.public.ts`
- `packages/form-core/tests/validation.test.ts`
- `packages/form-core/tests/validation.test-d.ts`
- `examples/react/ui-integration/shadcn/src/app/booking/schema.ts`
- `examples/react/ui-integration/shadcn/src/app/booking/shared-form.tsx`
- `https://standardschema.dev/`
- `https://zod.dev/library-authors`
- `https://valibot.dev/guides/integrate-valibot/`
- `https://arktype.io/docs/integrations`
- `https://effect.website/docs/schema/standard-schema/`

### 3. Schema Driven Forms

Purpose: Help users take a Standard Schema-compatible schema and wire it into validation, field errors, submit output, and type inference.

Primary APIs:

- `validators`
- `schemaOutputs`
- `parseIssues`
- `createValidationError`

Core guidance:

- Configure schema validation through validators.
- Extract reusable validator trigger configs with `createValidator` or `createValidators` when the behavior is complex enough to need a semantic name.
- Read parsed schema output from `schemaOutputs`; raw `value` remains form state.
- Route submit validation errors as returned values through `createValidationError` or `parseIssues`; do not throw them.
- Let Standard Schema issue paths route nested and array field errors when possible.
- Keep UI metadata explicit or schema-library-specific; Standard Schema does not standardize it.

Important failure modes:

- Expecting schema output to replace form `value`.
- Returning or throwing raw schema errors from submit code and expecting field errors.
- Throwing validation errors instead of returning `createValidationError` or `parseIssues` values.
- Manually mapping nested issue paths incorrectly.
- Duplicating validator trigger, debounce, submit, or bail policy inline without documenting why that behavior exists.
- Trying to build general UI metadata extraction from Standard Schema.

Source trail:

- `packages/form-core/src/standardSchema.public.ts`
- `packages/form-core/src/standardSchema.lib.ts`
- `packages/form-core/src/FormApi/FormApi.public.ts`
- `packages/form-core/tests/validation.test.ts`
- `packages/form-core/tests/FormApi/submission-handling.spec.ts`
- `examples/react/field-groups/src/index.tsx`

### 4. Query Backed Forms

Purpose: Help users combine form state with query-like async defaults and mutation-like submit calls.

Primary APIs:

- `useForm({ defaultValues })`
- `onSubmit`
- `form.reset`
- `createValidationError`
- `parseIssues`

Core guidance:

- Do not feed maybe-undefined query data into the form by itself; choose an explicit default-values plan.
- Approach 1: do not mount the fields until the query is finished. The whole form can also be gated so the first mounted form state is populated with correct data.
- Approach 2: define a static shape-complete `emptyFormValues` object and pass defaults as `query.data ?? emptyFormValues`.
- Neither approach is preferred globally; choose based on the desired loading and visual UI language.
- Gating fields changes the UI because fields or the whole form appear only after data is ready. The fallback approach can render the form immediately, often with loading or placeholder state around it.
- Update defaults when async data arrives and rely on touched-field preservation for user edits.
- Separate transient errors from validation errors.
- Use an async promise for the endpoint call inside `onSubmit` so `isSubmitting` reflects the request.
- Catch submit failures only when the endpoint can return validation errors that should be converted into returned `createValidationError` or `parseIssues` values.
- Transient submit failures may throw or reject; the form will set `isSubmitSuccessful` to false, and query/framework state should preserve the transient error details.
- Leave transient query, network, and framework failures in the query/framework error state instead of converting them into form validation errors.
- Use reset options deliberately when replacing both values and default baselines.

Important failure modes:

- Treating initial `undefined` query data as a final form shape.
- Passing `query.data` directly as defaults without either gated mounting or an `emptyFormValues` fallback.
- Gating fields without accounting for the different loading UI, or rendering fallback values without communicating that query data is still loading.
- Overwriting touched user edits when async defaults arrive.
- Starting an endpoint call inside `onSubmit` without returning or awaiting its promise, so `isSubmitting` does not cover the request.
- Turning transient network or server failures into validation errors and accidentally blocking future submits.
- Throwing validation errors from `onSubmit` instead of returning validation values.
- Treating a rejected transient `onSubmit` as something that should produce visible field errors.

Source trail:

- `packages/react-form/tests/useForm.spec.tsx`
- `packages/form-core/src/FormApi/FormApi.lib.ts`
- `packages/form-core/src/FormApi/FormApi.public.ts`
- `packages/form-core/tests/FormApi/default-value.spec.ts`
- `packages/form-core/tests/FormApi/submission-handling.spec.ts`

Open evidence gap: the IDE referenced `examples/react/tanstack-query/src/App.tsx`, but this checkout did not contain `examples/react/tanstack-query`.

### 5. Error Visibility Workflows

Purpose: Help users implement policies such as "show after blur", "show after submit", or "show after blur or submit".

Primary APIs:

- `errorVisibility`
- `createErrorVisibility`
- `createValidator`
- `createValidators`
- `fieldState.meta`
- `state.submissionAttempts`
- `form.FormGroup`

Core guidance:

- `errorVisibility` is callback-based.
- Use form-level `errorVisibility` to control default visible-error behavior instead of scattering local checks like `field.meta.isTouched && field.meta.isInvalid`.
- Reusable visibility policies created with `createErrorVisibility` should be value-agnostic.
- Use `createErrorVisibility`, `createValidator`, and `createValidators` mainly when a policy benefits from a semantic name or intent-focused comments/JSDoc.
- Inline callbacks can use the consuming form's typed values.
- Visibility callbacks receive pre-filter field meta, not visible errors or validity.
- Grouped forms scope submission attempts to the nearest group.

Important failure modes:

- Writing string presets such as `errorVisibility: 'touched'`.
- Repeating local `showErrors` expressions across fields instead of setting the form's default error visibility behavior.
- Inspecting `fieldState.meta.errors` or validity inside the visibility callback.
- Expecting reusable `createErrorVisibility` callbacks to know a concrete form value shape.
- Copying complex visibility or validator policy inline without documenting the workflow intent.
- Forgetting group-scoped submission attempts in wizard or section-level flows.

Source trail:

- `packages/form-core/src/validation.public.ts`
- `packages/form-core/src/FieldApi/fieldState.lib.ts`
- `packages/form-core/tests/validation.test-d.ts`
- `packages/form-core/tests/FormApi/validation.spec.ts`
- `packages/form-core/tests/FormGroupApi/FormGroupApi.spec.ts`
- `examples/react/ui-integration/shadcn/src/app/booking/shared-form.tsx`

### 6. Type Error Debugging

Purpose: Help users interpret large TypeScript errors from schemas, option modes, field groups, reusable forms, and adapter APIs.

Primary APIs and concepts:

- `ReactFormType`
- `formOptions`
- `appFormOptions`
- `createErrorVisibility`
- `createValidators`
- schema `strictSchema` / `looseSchema`
- field component `strict` / `loose`
- field group `strict` / `loose`
- `DeepKeys`
- `DeepValue`
- public `atom` APIs

Core guidance:

- Do not use type assertions to silence TanStack Form type errors; preserve inference and fix the mismatched boundary.
- Classify the error by boundary: schema option mode, schema output, submit return, reusable child form props, error visibility state, validator helper arity, form group scope, field group virtual path/binding, field component brand, deep-key path, or public/private API mismatch.
- Treat a `ReactFormType` union in a shared section as a design issue, not a TypeScript problem to assert through; reach for field groups instead.
- Do not confuse schema strict/loose with field component or field group strict/loose.
- For long errors, find the first concrete path, value, validator, or submit-return mismatch and ignore the expanded generic machinery around it.
- Reusable `createErrorVisibility` callbacks are form-agnostic; if a type error mentions `unknown` values, use an inline callback for form-specific values.
- `createValidators` type errors often mean the number of run functions does not match the number of option configs.
- FormGroup type errors often mean the code used a root-form path/value where the group expects group-scoped paths/values.
- Field-group type errors often mean the code used real form paths where virtual paths are expected, passed an incomplete binding map, or chose `strict` when the real path is only loosely compatible.
- Deep-key path errors usually point to path shape: arrays use bracket segments such as `users[${number}].name`, and array helpers only accept paths whose value includes an array.
- Look for the first meaningful generic mismatch rather than the full expanded error wall.
- Prefer source-backed explanation over broad TypeScript folklore.

Important failure modes:

- Adding assertions like `as const`, `as any`, or `(field: any)` instead of letting form names and children infer.
- Hand-writing shim field prop types instead of using inferred props, `FieldWithValue<T>`, or `AnyFieldApi`.
- Typing a shared section as `ReactFormType<typeof formAOptions> | ReactFormType<typeof formBOptions>`.
- Expecting a reusable `createErrorVisibility` callback to read concrete form values.
- Calling `createValidators` with fewer or more run functions than option configs.
- Using root-form field names or values inside a `FormGroup` validator or grouped field.
- Passing real form paths into a field group API where virtual paths are required.
- Providing an incomplete `withFields` binding map, passing the internal defined-fields object as a binding, or omitting the required `form` prop.
- Reading `form.store` or `field.store` instead of public `atom` APIs.
- Treating `fieldComponent.strict/loose` as schema mode selection.
- Passing a submit-specific form type to a reusable child that should accept several submit handlers.
- Binding a strict field group slot to a field path whose value is only loosely compatible.

Source trail:

- `packages/form-core/tests/validation.test-d.ts`
- `packages/form-core/tests/deep-keys.test-d.ts`
- `packages/react-form/tests/submit-return.test-d.tsx`
- `packages/react-form/tests/FormGroup.test-d.tsx`
- `packages/react-form/tests/FieldGroupApi.test-d.tsx`
- `packages/react-form/src/AppForm/getFormHookHelpers.public.ts`
- `packages/react-form/src/FieldGroup/withFields.public.ts`

### 7. Examples Authoring

Purpose: Help Codex scaffold substantial maintainer examples for testing, future documentation, and user reference.

Primary example areas:

- Basic form and submit handling.
- Schema-driven form.
- Query-backed form.
- Error visibility workflow.
- App-form and UI-library integration.
- Field groups.
- Arrays and reorder behavior.

Core guidance:

- Examples are scaffolding targets for maintainers in this private repository, and future users experience them as reference examples.
- Examples should be adapter-first and user-journey-shaped.
- Combine features when real workflows combine them, such as schema mode plus async defaults plus submit validation plus visibility policy.
- Keep boundaries explicit: TanStack Form handles validation and form state; query/framework code owns transient errors; UI libraries own visual behavior.
- Show reactive state reads with `useSelector` or `form.Subscribe`; do not imply the stable hook return is itself reactive.
- Prefer realistic examples over minimal API proofs once behavior has test coverage.

Important failure modes:

- Writing barren examples that resemble core tests more than user workflows.
- Modeling complex DnD multi-list state as a single indexed array and creating UI races.
- Letting native reset behavior fight form reset semantics.
- Reading form state from the stable hook return without a selector or subscription, then wondering why UI does not update.
- Reading submit state outside `form.Subscribe` and missing updates.

Source trail:

- `examples/react/basic/src/index.tsx`
- `examples/react/array/src/index.tsx`
- `examples/react/basic-splitting-form/src/index.tsx`
- `examples/react/field-groups/src/index.tsx`
- `examples/react/ui-integration/shadcn/src/app/booking/shared-form.tsx`
- `examples/react/ui-integration/shadcn/src/app/booking/booking-form.tsx`
- `examples/react/ui-integration/dnd-kit/src/singleList/index.tsx`
- `examples/react/ui-integration/dnd-kit/src/twoLists/index.tsx`

## Cross-Skill Relationships

- React Form Composition Setup is the base skill for all example work.
- Reusable Form Policies sits between React Form Composition Setup, Error Visibility Workflows, and Type Error Debugging.
- Choosing Form Options Modes feeds Schema Driven Forms and Type Error Debugging.
- Schema Driven Forms feeds Query Backed Forms when submit returns server-side validation.
- Error Visibility Workflows is often layered on top of Schema Driven Forms and Query Backed Forms.
- Examples Authoring should compose the other skills into realistic maintainer scaffolds that can later serve as references.

## Cross-Skill Tensions

- Schema strictness vs editable defaults: strict schema typing helps submit output, but editable forms often need nullable or undefined intermediate values.
- Query loading UI vs form initialization: gated mounting gives correct first form state, while `emptyFormValues` lets the UI render immediately.
- Validation state vs transient state: validation errors block submit, while query/network/framework failures should remain outside form validation state.
- Reuse vs inference boundaries: reusable sections are valuable, but assertions, hand-written field props, or `ReactFormType` unions break the intended inference model.

## Remaining Gaps

- Query Backed Forms: the IDE referenced `examples/react/tanstack-query/src/App.tsx`, but this checkout did not contain `examples/react/tanstack-query`. Query-backed guidance is reviewed from tests and maintainer interview, and should be exercised by scaffolding a realistic example later.

## Phase 5 Finalization

Resolved in the detail interview:

- Hard do-nots, especially no type assertions and no transient errors as validation errors.
- Schema mode wording for default `formOptions`, `strictSchema`, and `looseSchema`.
- Query-backed default-value strategies and their visual loading language.
- Async `onSubmit` behavior, including `isSubmitting`, `isSubmitSuccessful`, returned validation values, and thrown transient failures.
- Reusable policy helpers as semantic names for complex callbacks/configs.
- AppForm, `ReactFormType` split sections, and field groups as separate composition tools.
- Field vs `ArrayField`, especially array-as-immutable-value versus array-as-child-field-rendering-boundary.
- Type-error debugging categories derived from the type tests.
- Examples authoring as maintainer scaffolding for testing and future reference examples.
- Standard Schema libraries as heuristic examples, with pipeline-vs-firewall/ruleset clearly marked as TanStack Form guidance rather than a Standard Schema concept.

Reviewed acceptance criteria:

- Skills never make `@tanstack/form-core` the user-facing workflow entrypoint.
- Skills explain schemas through adapter APIs while preserving core semantics.
- Skills distinguish validation errors from transient async failures.
- Skills do not promise schema metadata extraction.
- Skills do not use devtools or migration as current entrypoints.
- Examples guidance is realistic enough for agents to build non-barren examples.
