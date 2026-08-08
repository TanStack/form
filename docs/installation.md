---
id: installation
title: Installation
---

TanStack Form is compatible with various front-end frameworks, including React, Vue, Angular, Solid, Lit, and Svelte. Install the corresponding adapter for your framework using your preferred package manager:

<!-- ::start:tabs variant="package-managers" -->

react: @tanstack/react-form
vue: @tanstack/vue-form
solid: @tanstack/solid-form

<!-- ::end:tabs -->

<!-- ::start:framework -->

# React

## Meta-frameworks

If you're using a meta-framework, TanStack Form provides additional adapters to streamline integration:

- TanStack Start
- Next.js

<!-- ::end:framework -->

<!-- ::start:tabs variant="package-manager" -->

react: @tanstack/react-form-start
react: @tanstack/react-form-nextjs

<!-- ::end:tabs -->

<!-- ::start:framework -->

# React

## Devtools

Developer tools are available using [TanStack Devtools](https://tanstack.com/devtools/latest). Install the devtools adapter for your framework as a dev dependency to debug forms and inspect their state.

# Solid

## Devtools

Developer tools are available using [TanStack Devtools](https://tanstack.com/devtools/latest). Install the devtools adapter for your framework as a dev dependency to debug forms and inspect their state.

<!-- ::end:framework -->

<!-- ::start:tabs variant="package-manager" -->

react: @tanstack/react-devtools
react: @tanstack/react-form-devtools

<!-- ::end:tabs -->

> [!NOTE]- Polyfill requirements
> Depending on your environment, you might need to add polyfills. If you want to support older browsers, you need to transpile the library from `node_modules` yourself.
