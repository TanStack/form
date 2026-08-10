---
id: typescript
title: TypeScript
---

TanStack Form is written 100% in **TypeScript** with the highest quality generics, constraints, and interfaces to make sure the library and your projects are as type-safe as possible!

## Infer form and field types

TanStack Form works out your form's data type from its `defaultValues`. From
there, each field name points to a value in that data shape, so field callbacks
and form methods know which values belong at each path.

Don't write the full `FormApi` or `FieldApi` generic parameter lists by hand in
application code. Those signatures may change as TanStack Form's type
inference evolves. At component boundaries, use the adapter's `*FormType`,
`FieldWithValue<T>`, `AnyFieldApi`, or the adapter's `Any*FormApi` helper,
depending on what the component needs. The [Splitting forms](./splitting-forms)
guide shows how to use each helper.

## Compiler requirements

Enable `strict: true` in your `tsconfig.json` so TypeScript can check field
paths, values, and callbacks as intended. TanStack Form's types require
TypeScript 5.4 or later.

## Type changes between releases

Improvements and corrections to TanStack Form's types may ship in patch
releases. These changes don't affect runtime behaviour, but they may reveal a
type error in application code that previously compiled.

If you need to plan for those updates, pin your TanStack Form adapter to an
exact patch version and review any new type errors when upgrading. Changes to
the runtime API continue to follow semantic versioning.
