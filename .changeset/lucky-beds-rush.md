---
'@tanstack/react-form-nextjs': patch
'@tanstack/react-form-remix': patch
'@tanstack/react-form-start': patch
---

Fixes bad inference from `decode-formdata`'s weird typing of the `decode` function, including handling how it incorrectly doesn't handle undefined values for the form info object.
