# TanStack Form skill spec

The first batch covers shared form configuration and validation in `@tanstack/form-core`. Every adapter can use this guidance through its form options and core dependency. React's public examples provide the current usage patterns. The second batch adds six React-specific workflows in `@tanstack/react-form`. The form-group batch adds multi-step validation and submission.

## Domains and skill inventory

| Domain             | Skill                  | Type      | Coverage                                                                                            |
| ------------------ | ---------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| Form configuration | `form-options`         | core      | Inline versus shared options, inferred defaults, strict and loose schema helpers.                   |
| Validation         | `schema-validation`    | core      | Standard Schema providers, issue routing, transforms, parsed submission output.                     |
| Validation         | `validation`           | core      | Interaction and submission timing, predicates, async checks, error maps, watches, error visibility. |
| Form configuration | `async-initial-values` | framework | Async defaults, touched edits, refetch policies, record changes, reset.                             |
| React composition  | `app-forms`            | framework | Registered field/form controls, injected props, value matching, shared defaults.                    |
| React composition  | `form-context`         | framework | Typed providers and hooks, nearest owner, explicit subscriptions.                                   |
| React fields       | `arrays`               | framework | Array-valued controls, row fields, structural methods, stable keys, meta subscriptions.             |
| React composition  | `field-groups`         | framework | Virtual field contracts, bindings, watched paths, composition, registered controls.                 |
| React rendering    | `subscriptions`        | framework | Subscribe and useSelector, atom shapes, snapshot reads, component scope.                            |
| React composition  | `form-groups`          | framework | Multi-step navigation, scoped submission, relative paths, complete validation after step unmount.   |

The three core skills ship under `packages/form-core/skills/<name>/SKILL.md`; React skills ship under `packages/react-form/skills/<name>/SKILL.md`. Provider details live in `schema-validation/references/schema-providers.md`. The skills link to each other only when another task becomes relevant; none requires loading the full batch.

## Consequential decisions

- Keep the first batch in form-core, as requested. Examples export configuration without framework hooks or JSX. Consumers retain their adapter and can import shared helpers from its public package.
- Target the checked-out v2.0.0-alpha.3 API. Use ordered validator arrays with `run`, rather than v1 event-keyed validator objects.
- Use `formOptions` for extracted options and the schema helpers when schema input types should determine values. Both schema helpers retain runtime identity and require separate validator registration.
- Do not supply explicit generic arguments to form creation or options helpers. Type application defaults or use schema helpers to guide inference. Application data types and supported form utility types remain appropriate.
- Preserve incomplete input types with `looseSchema`. Obtain parsed or transformed values from submission `validatorOutputs`.
- Use the existing schema provider. Zod, Valibot, and ArkType are direct runners in the public example; Effect uses `S.standardSchemaV1`.
- Keep scheduling independent from visibility. Use submission attempts and interaction state for predicates. Use `bailIfInvalid` for checks that depend on earlier validation succeeding. Predicate callback counts and validation-state ordering are unspecified.
- Keep validator and listener array lengths constant. Validators must not modify form values. Abort signals support cancellation and early exits.
- Ship skills with the owning npm package. Optional GitHub installer and native plugin distribution remain unselected. No publication is part of this batch.

## Failure modes and relationships

The domain map records the source and remedy for each assessed failure:

| Skill               | Failure modes                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `form-options`      | Supplying library-managed generic arguments; assuming schema helpers validate; losing inference in extracted options or narrow defaults. |
| `schema-validation` | Expecting transforms in editable values; returning parsed data without `createOutput`.                                                   |
| `validation`        | Using v1 configuration; disabling interaction triggers while expecting submission to stop; equating hidden errors with validity.         |

Editable input and parsed output have different types and lifetimes. The options and schema skills explain that boundary together. Validation timing and error visibility are separate policies, so the schema skill routes scheduling questions to the validation skill.

## Representative tasks and existing checks

Reuse the existing checks. This batch changes guidance and packaging, so it does not add runtime tests that duplicate established behavior.

| Task                                                               | Observable success                                                                                                                   | Existing check                                                                                                      |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Share options while allowing schema unions and incomplete defaults | Adapter callbacks retain value and output types; invalid strict defaults fail type checks.                                           | Core `FormApi/formOptions.public.test-d.ts`; React `public/shared-form/WithValidators.test-d.tsx`.                  |
| Validate a schema and save transformed data                        | Output types differ from editable input; invalid values block submission, including values from an unmounted wizard step.            | React `public/form-options/ValidatorOutputs.test-d.tsx`; `public/submission-handling/group-submission.spec.tsx`.    |
| Configure validation and delayed error visibility                  | Mount errors and pending validation are visible when configured; hidden errors block submission and become visible after an attempt. | React `public/validation-execution/mount-validation.spec.tsx`; `public/error-visibility/error-visibility.spec.tsx`. |

Compile all TypeScript skill examples against the public core entry point and installed schema providers. Run Intent structural validation and maintainer checks separately from runtime and type checks. Record the actual outcomes below after execution.

## Discovery prompts for consumer evaluation

Keep task success and observed skill loading as separate results. These prompts define cases; they are not recorded activation evidence.

| Skill               | Should load                                                                                                                        | Adjacent task that should not load it                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `form-options`      | “Share the signup configuration across two TanStack forms. The account type can be personal or business, and age starts empty.”    | “Style this React form's submit button.”                  |
| `schema-validation` | “Use our existing Valibot schema with TanStack Form and submit its parsed result.”                                                 | “Design a database schema for account storage.”           |
| `validation`        | “Validate this TanStack form on blur and after the first submit, debounce the username lookup, and hide errors until interaction.” | “Replace this React input with a different UI component.” |

## Remaining work

- The six React workflows are covered by the second batch, and the form-group batch covers scoped wizard validation and submission. Other adapters, server integrations, and a standalone listener workflow remain unassessed. Shared array mechanics may justify later core guidance; the React batch owns the rendering workflow.
- The first consumer evaluation passed one positive task per skill, as recorded below. Adjacent negative activation tasks, repeated prompts, other agents or models, and a without-skill comparison remain unmeasured. These are possible follow-up evaluations.

## Coverage and batch history

### Initial shared-core batch — 2026-11-27

- Scope: the three tasks selected in the conversation, owned by form-core and usable from every adapter.
- Evidence: source revision `f8e2ce4aa3c0dd36e251892825b7e25a912cc628`, package version `2.0.0-alpha.3`, installed Intent `0.5.6`.
- Reviewed examples: React basic, simple, Standard Schema, basic form splitting, booking schema options, and server-action schema options. Core public types and React public tests resolve behavioral details.
- Added the three skills, their source mappings, provider reference, and this cumulative planning record.
- Structural checks: Intent validated all three skills, including the provider reference. All 12 TypeScript examples compiled against the public core entry point and the installed Zod, Valibot, ArkType, and Effect providers.
- Type checks: `pnpm --dir packages/form-core test:types --pretty false` and the corresponding React command passed.
- Runtime checks: the focused React public suites for form options, error visibility, validation execution, and group submission passed all 58 tests across normal and Strict Mode runs.
- Packaging: the core build and publint passed. A local package archive contains all three skills and the provider reference. Intent lists the three skills from that archive in a disposable consumer layout where core is a transitive dependency and its skill source is permitted.
- Source review and `maintainer check` complete the mechanical handoff. They record this evidence; they do not establish fresh consumer agent success. Agent selection and task execution remain unverified.

### Clarify inference mistakes — 2026-11-27

- Maintainer feedback: explicitly identify patterns agents should avoid, particularly generic arguments on APIs designed for inference.
- Added a focused Common mistakes section to `form-options`, pairing each mistake with its cause and supported alternative. Added an example with typed application defaults and inferred callbacks.
- Preserved the boundary between library-managed call generics and application or utility types. The domain map records the additional failure mode; skill identities and source mappings in the tree remain accurate.
- Verification: all 13 TypeScript examples compiled, including the new typed-defaults example. Intent structural validation passed. No library behavior changed, so the existing runtime and type test results above remain the source evidence. Fresh consumer agent behavior remains unverified.

### First consumer evaluation — 2026-11-27

- Setup: three fresh subagents with no authoring conversation, one per task. Each received a plain developer task, a disposable consumer project, the packed core package, the matching built React adapter, and the installed Intent runner. Task instructions limited access to that consumer and its installed dependencies. The grader, expected solutions, other consumers, and author repository were excluded from the task context. No model override was supplied.
- The projects permit `@tanstack/form-core` as an Intent source, with React Form as the direct dependency. Agents selected skills from `intent list`; the prompt did not identify a skill to load. The runner recorded successful `load` commands.
- Grader controls: known-good solutions passed the type checks and eight browser checks. Deliberately incorrect defaults failed the type grader. Omitting schema registration and submitting raw values, and enabling unconditional undebounced remote validation, failed all eight browser checks. The grader remained unchanged for consumer grading.

| Consumer task                                                                                    | Observed skill loads                | Result                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Share signup options with two plans, string interests, and numeric or empty age                  | `form-options`                      | Typed defaults and inferred API generics. The adapter consumer retained exact value types and rejected invalid field values.                                                          |
| Validate person input and save parsed values without changing editable strings                   | `schema-validation`, `form-options` | Invalid submission exposed field errors. Valid submission saved a trimmed name and numeric age while preserving input strings.                                                        |
| Configure conditional username checks, visibility, debouncing, and cancellable availability work | `validation`, `form-options`        | Local errors blocked submission without a remote lookup. Blur and changes after submission triggered the expected availability checks, with interaction debounce and an abort signal. |

- All three agents' own TypeScript checks passed. The separate consumer type grader passed. Four runtime scenarios passed in both normal and Strict Mode, for eight passing browser checks. Manual inspection found no explicit library-managed call generics or `any` casts in the solutions.
- The evaluated skill hashes matched the working tree. Guidance changes were unnecessary. The domain map resolves the assessed positive-task gap and records broader evaluation as remaining work. Skill identities, prerequisites, and source mappings in the tree remain accurate without changes.
- Temporary prompts, source fixtures, grading code, solution diffs, command traces, skill hashes, and `results.json` are under `/tmp/tanstack-form-intent-evaluation/`. They are disposable evaluation artifacts, not a permanent test suite.
- Scope: one observed positive attempt per task with normal Intent bootstrap instructions. Adjacent negative activation prompts and a without-skill baseline were not run, so these results do not measure broader activation accuracy or improvement over unaided agents.

### React workflow batch — 2026-11-27

- Scope: the six React tasks agreed in the conversation. Context remains separate from app forms because sharing a concrete form and registering reusable controls are independently useful tasks. Field groups cover reusable mapped fields; scoped form-group validation and submission remain future work.
- Evidence: source revision `161624f8048a5ec91e895ef8282644d3c101b218`, package version `2.0.0-alpha.3`, installed Intent `0.5.6`.
- Every entry point has a complete example and no required skill dependency (`requires: []`). Core options and validation are conditional handoffs through their package-qualified Intent identities. React skills link to each other only when their task needs that guidance. No reference files or bundled scripts are needed.
- Keep data fetching in the existing server-state layer. Updated defaults preserve touched values; switching records needs a keyed editor or deliberate reset. Do not prescribe reset on every refetch.
- Register v2 controls through `getFormHookHelpers`, `fieldComponent`, and `formComponent`. Use the existing app hook, retain component inference, and use its `appFormOptions` and `defineAppFieldGroup` when those types matter.
- Typed context helpers share one runtime form context. The nearest compatible owner supplies the form; a typed context is not a separate runtime channel and does not subscribe snapshot reads.
- Use regular fields for whole-array controls and `ArrayField` for item fields. Keep stable item keys and indexed field paths. Structural methods retain item field state; array metadata requires its own subscription.
- Field-group atoms contain typed virtual values directly. Their `Subscribe` selectors receive parent form state with unknown values. Watches and field methods use virtual paths inside the section.
- Preserve the existing package-only distribution. The React package allowlist now includes the six skill directories. No documentation generation, dependency installation, publication, staging, or commits are part of this batch.
- Verification: Intent structural validation passed all six skills; all eight TypeScript/TSX examples compiled against the packed public React API; React type checks passed; 64 relevant public browser tests passed across normal and Strict Mode. The local archive includes all six skills and their relative links resolve in the installed layout.
- Consumer task checks reuse the repository's Vitest Browser Mode setup in disposable projects, following the first batch's evaluation approach instead of adding library regression tests for guidance-only changes.

Representative React tasks and source checks:

| Skill                  | Observable result                                                                             | Existing evidence                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `async-initial-values` | Loaded defaults fill untouched fields; edits survive refresh; a new record gets fresh values. | Async defaults guide, query integration example, touched-state public cases.   |
| `app-forms`            | Registered fields preserve value types and each prepared control uses its owning form.        | Public field-components and form-components runtime and type cases.            |
| `form-context`         | Typed descendants share the right form and subscribed previews update.                        | Public context types and factory; disposable consumer runtime and type checks. |
| `arrays`               | Rows retain values and field state when moved or removed; meta output updates.                | Core array method cases and React array-field-subscriptions cases.             |
| `field-groups`         | One section works across value shapes and watches the mapped dependency.                      | Public field-group cases and reusable range examples.                          |
| `subscriptions`        | Repeated edits update previews and derived output through the right source shape.             | Public Subscribe source, migration guide, array subscription cases.            |

Discovery cases retained for this batch:

| Skill                  | Should load                                                                                                         | Adjacent task that should not load it                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `async-initial-values` | “Load the selected customer's data into this React editor, keep edits during refresh, and switch customers safely.” | “Add a required-name validator to this already populated form.”      |
| `app-forms`            | “Share our text inputs and reset controls across React TanStack forms.”                                             | “Pass this one form to an extracted section component.”              |
| `form-context`         | “Let deeply nested React components access the same typed form without threading it through props.”                 | “Create a reusable range section for several unrelated form shapes.” |
| `arrays`               | “Add, remove, and reorder editable people rows while keeping the right values attached.”                            | “Add spacing between existing form fields.”                          |
| `field-groups`         | “Reuse this date-range section when each form stores start and end at different paths.”                             | “Submit just the current wizard step.”                               |
| `subscriptions`        | “The input changes but its name-length preview stays stale after another edit.”                                     | “Choose when the username availability check should run.”            |

Positive combined tasks exercise two skills per consumer. Adjacent negative activation prompts, independent repetitions, and a without-skill comparison remain unmeasured unless explicitly recorded below.

React fresh-consumer evaluation:

- Three fresh subagents received only a plain developer task, the isolated project, installed public packages, and the normal Intent list/load entry point. The authoring conversation, repository, sibling consumers, reference solutions, and grader were excluded from their task context. No model override was supplied.
- The packed React adapter includes all six skills; core skills are available through its dependency. Intent lists and loads both permitted packages. Command traces record the successful skill loads below.
- Controls: reference solutions passed the separate type grader and all 14 browser checks. Deliberately incorrect record switching, snapshot reads, reset control, array meta subscription, and watched paths caused 12 of those checks to fail; the two unaffected row-operation checks still passed. The grader was not changed for consumer grading.

| Consumer task                                                   | Observed loads                                                     | Result                                                                                                                             |
| --------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Async record editor and derived preview                         | React `async-initial-values`, `subscriptions`                      | Untouched values refresh, local edits remain, switching records creates fresh values, repeated edits update the preview.           |
| Shared registered controls and typed descendant access          | React `app-forms`, `form-context`                                  | String-only injected controls retain props and value types; descendants share the correct form; each reset affects its own editor. |
| Reusable range sections in editable rows and another form shape | React `field-groups`, `arrays`, `subscriptions`; core `validation` | Row operations preserve edited values; virtual previews and array meta react; watched validation maps correctly for both shapes.   |

- All three consumers' TypeScript checks passed. The separate type grader passed, including seven expected rejection cases for component props, field value types, context paths/providers, and bindings. All 14 browser checks passed in normal and Strict Mode. Inspection found no explicit library-managed call generics or `any` casts in the solutions.
- All evaluated skill hashes match the final working tree, and relative React skill links resolve in the packed layout. No guidance changes were needed after the consumer runs.
- Prompts, starter contracts, protected grading code, reference solutions, negative-control logs, solution diffs, successful-load traces, package archive, skill hashes, and `results.json` are under `/tmp/tanstack-react-intent-evaluation/`. They are disposable evaluation artifacts.
- This verifies one positive combined task per consumer, covering all six React skills. Negative activation cases, repetitions, and a without-skill baseline remain unmeasured; these observations do not establish broader discovery accuracy or improvement over unaided agents.
- Validator compatibility: the generic skill-creator checker rejects Intent's `sources` and `requires` frontmatter extensions. The installed Intent validator is authoritative for this package format and passes all six skills without warnings.

### App-form default example — 2026-11-27

- Maintainer feedback: use `errorVisibility` as the representative application default. The app-forms example now sets `defaultFormOptions.errorVisibility` to show field errors after blur or a submission attempt, with a reminder that hidden errors still block submission.
- This replaces the example's `errorBoundary` setting; it changes skill guidance without changing library behavior. Skill identity, task coverage, source mappings, and prerequisites remain accurate in the domain map and tree.
- The earlier consumer evaluation remains evidence for registered controls and form ownership. It did not exercise this default policy. The revised example is checked separately against the public API and existing visibility tests.
- Verification: the revised example type-checks against the public React entry point; all 10 focused default-option and error-visibility browser checks pass across normal and Strict Mode; Intent validates the six React skills.

### Form-group wizard skill — 2026-11-27

- Scope: `@tanstack/react-form#form-groups` covers multi-step forms, step validation and submission, retained values during navigation, relative error paths, and final validation after earlier steps unmount. This completes the dedicated form-group workflow previously listed as future work.
- Evidence: source revision `161624f8048a5ec91e895ef8282644d3c101b218`, package version `2.0.0-alpha.3`, installed Intent `0.5.6`. Sources include the multi-step wizard, public group API and components, group submission checks, and full-path group field fixture.
- Keep one parent form mounted. Advance only from the group's validated `onSubmit`. The last step awaits parent submission, and only the parent callback saves the complete form. Reuse the step schemas in a complete parent validator because parent submission excludes group validators and earlier field validators disappear on unmount.
- Keep `field-groups` for reusable virtual bindings and `form-groups` for scoped submission. The new skill is self-contained with `requires: []`; schema providers, advanced validation, subscriptions, registered controls, and reusable sections are conditional handoffs.
- Package-only distribution continues. No library behavior, generated documentation, repository dependency changes, publication, staging, or commits are part of this batch.
- Representative task: build a two-step checkout with independent validation, Back navigation, retained edits, and final validation of a value changed after its step unmounts. Should load: “Build a checkout wizard that validates each page before Next and saves all pages at the end.” Adjacent should not load: “Reuse this address section at different paths in several forms.”
- Verification: Intent validates all seven React skills; the exact published example and adapted checkout fixture compile against the packed public API. Core and React builds pass, including publint. All 56 focused public group-submission and group-event browser checks pass across normal and Strict Mode.
- The disposable reference checkout passes eight browser checks: invalid steps block advancement, later invalid steps do not block Next, Back retains edits, a changed value from an unmounted step blocks final saving, and asynchronous saving receives both addresses once. Removing the complete parent validator makes the unmounted-step case fail in both modes. The initial reference run exposed errors inside the input label changing its accessible name; the skill now renders errors outside the label, and all eight checks pass.
- One fresh consumer received only the task, installed public packages, and normal Intent discovery. It selected `@tanstack/react-form#form-groups` and `@tanstack/form-core#validation`, implemented the wizard without library casts or explicit library-managed call generics, and passed its TypeScript check and all eight unchanged browser checks. It reloaded the final skill after the accessibility correction and confirmed its existing implementation already used separate labels and errors.
- The final local package archive contains the new skill. Its relative React links resolve in the installed layout. The domain map records coverage, failure modes, relationships, and the consumer result; the tree records package ownership, sources, purpose, and no prerequisites.
- Task prompts, reference and incorrect solutions, protected checks, consumer implementation, discovery cases, and package archive are under `/tmp/tanstack-form-groups-evaluation/`. This is one positive consumer attempt. Negative discovery cases, repeated attempts, and a without-skill comparison remain unmeasured.
- Validator compatibility remains unchanged: skill-creator's generic checker rejects Intent's `sources` and `requires` extensions. Intent's installed validator supports this format and passes without warnings.
