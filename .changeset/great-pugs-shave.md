---
'@tanstack/solid-form': patch
---

Generate the default `formId` with Solid's `createUniqueId` so it is SSR-safe. Previously, when no `formId` was configured, `createForm` did not provide a fallback, so `FormApi` generated a random UUID that differed between the server render and the client render. Binding that generated id (`<form id={form.formId}>`) produced a hydration mismatch under SolidStart. An explicitly provided `formId` was already forwarded and is unchanged. This mirrors the existing behaviour of the React, Preact, and Vue adapters.
