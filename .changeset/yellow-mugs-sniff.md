---
'@tanstack/solid-form': patch
---

Using any Signal inside the Form.AppField render function no longer causes the entire component to re-run whenever that Signal changes.
