---
'@tanstack/form-core': patch
---

fix(form-core): apply updated async `defaultValues` to untouched fields even after another field has been edited, instead of skipping the whole update once any field is touched (#2229)
