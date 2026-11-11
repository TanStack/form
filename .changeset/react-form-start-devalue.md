---
'@tanstack/react-form-start': patch
---

Bump `devalue` to `^5.9.3`. Earlier versions are affected by published advisories, including two denial of service issues in `devalue.parse`, which is used to read the form state cookie.
