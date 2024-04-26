---
id: comparison
title: Comparison | TanStack Form
---

> ⚠️ This comparison table is under construction and is still not completely accurate. If you use any of these libraries and feel the information could be improved, feel free to suggest changes (with notes or evidence of claims) using the "Edit this page on Github" link at the bottom of this page.

Feature/Capability Key:

- ✅ 1st-class, built-in, and ready to use with no added configuration or code
- 🟡 Supported, but as an unofficial 3rd party or community library/contribution
- 🔶 Supported and documented, but requires extra user-code to implement
- 🛑 Not officially supported or documented.

| Feature                                           | TanStack Form                                | Formik                         | Redux Form                             | React Hook Form                                  | Final Form                             |
| ------------------------------------------------- |----------------------------------------------| ------------------------------ | -------------------------------------- | ------------------------------------------------ | -------------------------------------- |
| Github Repo / Stars                               | [![][stars-tanstack-form]][gh-tanstack-form] | [![][stars-formik]][gh-formik] | [![][stars-redux-form]][gh-redux-form] | [![][stars-react-hook-form]][gh-react-hook-form] | [![][stars-final-form]][gh-final-form] |
| Supported Frameworks                              | React, Vue, Angular, Solid, Lit              | React                          | React                                  | React                                            | React                                  |
| Bundle Size                                       | [![][bp-tanstack-form]][bpl-tanstack-form]   | [![][bp-formik]][bpl-formik]   | [![][bp-redux-form]][bpl-redux-form]   | [![][bp-react-hook-form]][bpl-react-hook-form]   | [![][bp-final-form]][bpl-final-form]                                       |
| First-class TypeScript support                    | ✅                                            | ❓                             | ❓                                     | ✅                                               | ❓                                     |
| Fully Inferred TypeScript (Including Deep Fields) | ✅                                            | ❓                             | ❓                                     | ✅                                               | ❓                                     |
| Headless UI components                            | ✅                                            | ❓                             | ❓                                     | ✅                                               | ❓                                     |
| Framework agnostic                                | ✅                                            | ❓                             | ❓                                     | 🛑                                               | ❓                                     |
| Granular reactivity                               | ✅                                            | ❓                             | ❓                                     | ❓                                               | ❓                                     |
| Nested object/array fields                        | ✅                                            | ✅                             | ❓                                     | ✅*(1)                                           | ❓                                     |
| Async validation                                  | ✅                                            | ✅                             | ❓                                     | ✅                                               | ❓                                     |
| Built-in async validation debounce                | ✅                                            | ❓                             | ❓                                     | ❓                                               | ❓                                     |
| Schema-based Validation                           | ✅                                            | ✅                             | ❓                                     | ✅                                               | ❓                                     |

*(1) For nested arrays, react-hook-form requires you [to cast the field array by its name](https://react-hook-form.com/docs/usefieldarray) if you're using TypeScript

[bpl-tanstack-form]: https://bundlephobia.com/result?p=@tanstack/react-form
[bp-tanstack-form]: https://badgen.net/bundlephobia/minzip/@tanstack/react-form?label=💾
[gh-tanstack-form]: https://github.com/TanStack/form
[stars-tanstack-form]: https://img.shields.io/github/stars/TanStack/form?label=%F0%9F%8C%9F

[bpl-formik]: https://bundlephobia.com/result?p=formik
[bp-formik]: https://badgen.net/bundlephobia/minzip/formik?label=💾
[gh-formik]: https://github.com/jaredpalmer/formik
[stars-formik]: https://img.shields.io/github/stars/jaredpalmer/formik?label=%F0%9F%8C%9F


[bpl-redux-form]: https://bundlephobia.com/result?p=redux-form
[bp-redux-form]: https://badgen.net/bundlephobia/minzip/redux-form?label=💾
[gh-redux-form]: https://github.com/redux-form/redux-form
[stars-redux-form]: https://img.shields.io/github/stars/redux-form/redux-form?label=%F0%9F%8C%9F

[bpl-react-hook-form]: https://bundlephobia.com/result?p=react-hook-form
[bp-react-hook-form]: https://badgen.net/bundlephobia/minzip/react-hook-form?label=💾
[gh-react-hook-form]: https://github.com/react-hook-form/react-hook-form
[stars-react-hook-form]: https://img.shields.io/github/stars/react-hook-form/react-hook-form?label=%F0%9F%8C%9F

[bpl-final-form]: https://bundlephobia.com/result?p=final-form
[bp-final-form]: https://badgen.net/bundlephobia/minzip/final-form?label=💾
[gh-final-form]: https://github.com/final-form/final-form
[stars-final-form]: https://img.shields.io/github/stars/final-form/final-form?label=%F0%9F%8C%9F
