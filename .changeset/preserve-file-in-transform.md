---
'@tanstack/form-core': patch
---

Preserve `File` and `Blob` values when a form `transform` runs. `mergeAndUpdate` deep-copied the form state and turned these values into empty plain objects, which dropped file attachments whenever a transform (for example merging server validation errors) ran.
