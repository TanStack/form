---
"@tanstack/form-core": patch
---

fix: prevent unnecessary re-renders when there are no async validators

Fields were re-rendering twice on each keystroke because `isValidating` was being set to `true` then `false` even when there were no async validators to run. This fix checks if there are actual async validators before toggling the `isValidating` state.

Fixes #1130
