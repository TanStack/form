---
'@tanstack/form-core': patch
---

Fix `DeepKeys` and `DeepValue` failing with "Type instantiation is excessively deep and possibly infinite" (TS2589) for self-referencing types such as recursive JSON types. Expansion of a path now stops when a container type repeats on the path, and the remaining path is typed as an unknown accessor that also accepts consecutive array indexes such as `data[0][0]`. Types without self-references are unchanged.
