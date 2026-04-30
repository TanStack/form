---
'@tanstack/form-core': patch
---

`evaluate()` incorrectly treated distinct non-plain objects with no own enumerable keys (Temporal types, RegExp, getter-only class instances) as equal because the key-iteration loop vacuously succeeded. A guard now returns `false` for such objects, falling back to referential inequality.
