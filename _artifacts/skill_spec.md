# TanStack Form skill spec

The first batch covers shared form configuration and validation in `@tanstack/form-core`. Every adapter can use this guidance through its form options and core dependency. React's public examples provide the current usage patterns.

## Domains and skill inventory

| Domain             | Skill               | Type | Coverage                                                                                            |
| ------------------ | ------------------- | ---- | --------------------------------------------------------------------------------------------------- |
| Form configuration | `form-options`      | core | Inline versus shared options, inferred defaults, strict and loose schema helpers.                   |
| Validation         | `schema-validation` | core | Standard Schema providers, issue routing, transforms, parsed submission output.                     |
| Validation         | `validation`        | core | Interaction and submission timing, predicates, async checks, error maps, watches, error visibility. |

Each skill ships under `packages/form-core/skills/<name>/SKILL.md`. Provider details live in `schema-validation/references/schema-providers.md`. The skills link to each other only when another task becomes relevant; none requires loading the full batch.

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

- Adapter-specific creation, rendering, subscriptions, registered components, and server integrations remain unassessed. Array editing, groups, and listeners may justify later core tasks after source review.
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
