---
id: ValidatorEvents
title: ValidatorEvents
---

```ts
type ValidatorEvents = "change" | "blur" | "server" | "submit" | "mount";
```

Defined in: [pipeline/events.public.ts:10](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/events.public.ts#L10)

Events that identify why validation runs.

- `'change'`: A value changed.
- `'blur'`: A field was blurred.
- `'server'`: Form values are being validated on the server.
- `'submit'`: A client form submission was attempted.
- `'mount'`: A form is being constructed, or a field or form group is being mounted.
