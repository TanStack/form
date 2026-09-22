---
'@tanstack/react-form': patch
'@tanstack/form-core': patch
'@tanstack/vue-form': patch
---

Fix: Move mounted fields onto the current field API after array mutations

Removing or swapping array items kills and moves field APIs while the components rendering them stay mounted under the same name. Those components kept the field API they resolved on mount, so a value or error that shifted to their index never rendered. The form now tracks field API identity changes and adapters resolve their name again when it changes.
