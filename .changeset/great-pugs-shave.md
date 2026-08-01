---
'@tanstack/solid-form': patch
---

Generate the default `formId` with Solid's `createUniqueId` so it is SSR-safe. Previously `createForm` never passed a `formId`, so `FormApi` fell back to a random uuid that differed between the server render and the client render, and binding it (`<form id={form.formId}>`) produced a hydration mismatch under SolidStart. Mirrors the existing behaviour of the react, preact and vue adapters.
