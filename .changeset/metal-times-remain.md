---
'@tanstack/react-form': patch
'@tanstack/react-form-nextjs': patch
---

use React 18's useId hook by default for formId generation, only calling Math.random() as a fallback if no formId is provided.
