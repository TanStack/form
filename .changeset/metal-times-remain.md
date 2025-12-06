---
'@tanstack/react-form': patch
'@tanstack/react-form-nextjs': patch
---

uses the formId option by default as the initial fallback value, only calling Math.random() as a fallback if no formId is provided.

- useId is not available in React 17, so in order for "cache components" to work the user must provide a deterministic formId (`useForm({ formId: 'my-form' })`).
- This enables static rendering as well as continued React 17 compatibility.
