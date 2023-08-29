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
| ------------------------------------------------- | -------------------------------------------- | ------------------------------ | -------------------------------------- | ------------------------------------------------ | -------------------------------------- |
| Github Repo / Stars                               | [![][stars-tanstack-form]][gh-tanstack-form] | [![][stars-formik]][gh-formik] | [![][stars-redux-form]][gh-redux-form] | [![][stars-react-hook-form]][gh-react-hook-form] | [![][stars-final-form]][gh-final-form] |
| Supported Frameworks                              | React                                        |                                |                                        |                                                  |                                        |
| Bundle Size                                       | [![][bp-tanstack-form]][bpl-tanstack-form]   |                                |                                        |                                                  |                                        |
| First-class TypeScript support                    | ✅                                           | ❓                             | ❓                                     | ❓                                               | ❓                                     |
| Fully Inferred TypeScript (Including Deep Fields) | ✅                                           | ❓                             | ❓                                     | ❓                                               | ❓                                     |
| Headless UI components                            | ✅                                           | ❓                             | ❓                                     | ❓                                               | ❓                                     |
| Framework agnostic                                | ✅                                           | ❓                             | ❓                                     | ❓                                               | ❓                                     |
| Granular reactivity                               | ✅                                           | ❓                             | ❓                                     | ❓                                               | ❓                                     |
| Nested object/array fields                        | ✅                                           | ❓                             | ❓                                     | ❓                                               | ❓                                     |
| Async validation                                  | ✅                                           | ❓                             | ❓                                     | ❓                                               | ❓                                     |
| Built-in async validation debounce                | ✅                                           | ❓                             | ❓                                     | ❓                                               | ❓                                     |
| Schema-based Validation                           | 🔶                                           | ❓                             | ❓                                     | ❓                                               | ❓                                     |

[bpl-tanstack-form]: https://bundlephobia.com/result?p=@tanstack/react-form
[bp-tanstack-form]: https://badgen.net/bundlephobia/minzip/@tanstack/react-form?label=💾
[gh-tanstack-form]: https://github.com/TanStack/form
[stars-tanstack-form]: https://img.shields.io/github/stars/TanStack/form?label=%F0%9F%8C%9F

[gh-formik]: https://github.com/jaredpalmer/formik
[stars-formik]: https://img.shields.io/github/stars/jaredpalmer/formik?label=%F0%9F%8C%9F

[gh-redux-form]: https://github.com/redux-form/redux-form
[stars-redux-form]: https://img.shields.io/github/stars/redux-form/redux-form?label=%F0%9F%8C%9F

[gh-react-hook-form]: https://github.com/react-hook-form/react-hook-form
[stars-react-hook-form]: https://img.shields.io/github/stars/react-hook-form/react-hook-form?label=%F0%9F%8C%9F

[gh-final-form]: https://github.com/final-form/final-form
[stars-final-form]: https://img.shields.io/github/stars/final-form/final-form?label=%F0%9F%8C%9F