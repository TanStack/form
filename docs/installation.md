---
id: installation
title: Installation
---

TanStack Form is compatible with various front-end frameworks, including React, Vue, and Solid. To use TanStack Form with your desired framework, install the corresponding adapter via your preferred package manager:

### React Example
```bash
# npm
$ npm i @tanstack/react-form
# pnpm
$ pnpm add @tanstack/react-form
# bun
$ bun add @tanstack/react-form
# yarn
$ yarn add @tanstack/react-form
```

### Vue Example
```bash
# npm
$ npm i @tanstack/vue-form
# pnpm
$ pnpm add @tanstack/vue-form
# bun
$ bun add @tanstack/vue-form
# yarn
$ yarn add @tanstack/vue-form
```

### Angular Example
```bash
# npm
$ npm i @tanstack/angular-form
# pnpm
$ pnpm add @tanstack/angular-form
# bun
$ bun add @tanstack/angular-form
# yarn
$ yarn add @tanstack/angular-form
```

### Solid Example
```bash
# npm
$ npm i @tanstack/solid-form
# pnpm
$ pnpm add @tanstack/solid-form
# bun
$ bun add @tanstack/solid-form
# yarn
$ yarn add @tanstack/solid-form
```

### Lit Example
```bash
# npm
$ npm i @tanstack/lit-form
# pnpm
$ pnpm add @tanstack/lit-form
# bun
$ bun add @tanstack/lit-form
# yarn
$ yarn add @tanstack/lit-form
```

> Depending on your environment, you might need to add polyfills. If you want to support older browsers, you need to transpile the library from `node_modules` yourselves.

In addition, we support Zod, Yup, and Valibot as validators through official validator packages:

### Validator Adapters
```bash
# npm
$ npm i @tanstack/zod-form-adapter zod
$ npm i @tanstack/yup-form-adapter yup
$ npm i @tanstack/valibot-form-adapter valibot

# pnpm
$ pnpm add @tanstack/zod-form-adapter zod
$ pnpm add @tanstack/yup-form-adapter yup
$ pnpm add @tanstack/valibot-form-adapter valibot

# bun
$ bun add @tanstack/zod-form-adapter zod
$ bun add @tanstack/yup-form-adapter yup
$ bun add @tanstack/valibot-form-adapter valibot

# yarn
$ yarn add @tanstack/zod-form-adapter zod
$ yarn add @tanstack/yup-form-adapter yup
$ yarn add @tanstack/valibot-form-adapter valibot
