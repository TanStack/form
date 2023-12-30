---
id: installation
title: Installation
---

TanStack Form is compatible with various front-end frameworks, including React, Vue, and Solid. To use TanStack Form with your desired framework, install the corresponding adapter via NPM:

```bash
$ npm i @tanstack/react-form
# or
$ pnpm add @tanstack/vue-form
# or
$ yarn add @tanstack/solid-form
```

> Depending on your environment, you might need to add polyfills. If you want to support older browsers, you need to transpile the library from `node_modules` yourselves.

In addition, we support Zod, Yup, and Valibot as validators through official validator packages:

```bash
$ npm i @tanstack/zod-form-adapter zod
# or
$ npm i @tanstack/yup-form-adapter yup
# or
$ npm i @tanstack/valibot-form-adapter valibot
```
