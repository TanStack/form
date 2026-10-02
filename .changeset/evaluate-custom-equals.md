---
'@tanstack/form-core': patch
---

Support value types that expose a custom `equals()` method (Temporal types, Luxon `DateTime`, etc.) in the deep-equality check. Previously two equal instances were reported as unequal because they have no own enumerable keys, so a field backed by such a value stayed dirty even after being reset to its original value (#2195).
