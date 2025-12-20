---
id: installation
title: Installation
---

TanStack Form is compatible with various front-end frameworks, including React, Vue, and Solid. To use TanStack Form with your desired framework, install the corresponding adapter via your preferred package manager:

<!-- ::start:tabs variant="package-managers" id="form-install" -->

react: @tanstack/react-form
vue: @tanstack/vue-form
angular: @tanstack/angular-form
solid: @tanstack/solid-form
lit: @tanstack/lit-form
svelte: @tanstack/svelte-form

react: @tanstack/react-form-devtools # Optional: Form devtools
solid: @tanstack/solid-form-devtools # Optional: Form devtools

<!-- ::end:tabs -->

> [!NOTE]- Polyfill requirements
> Depending on your environment, you might need to add polyfills. If you want to support older browsers, you need to transpile the library from `node_modules` yourself.

## Meta-frameworks

There are additional adapters for meta-frameworks such as:

- TanStack Start
- Next.js
- Remix

<!-- ::start:tabs variant="package-manager" id="form-meta-install" -->

react: @tanstack/react-form-start
react: @tanstack/react-form-nextjs
react: @tanstack/react-form-remix

<!-- ::end:tabs -->
