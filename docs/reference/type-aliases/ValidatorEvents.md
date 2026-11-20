---
id: ValidatorEvents
title: ValidatorEvents
---

```ts
type ValidatorEvents = "change" | "blur" | "server" | "submit" | "mount";
```

Defined in: [events.public.ts:10](https://github.com/TanStack/form/blob/main/packages/form-core/src/events.public.ts#L10)

Events that identify why a validator runs.

- `'change'`: A value changed.
- `'blur'`: A field was blurred.
- `'server'`: Form values are being validated on the server.
- `'submit'`: A client form submission was attempted.
- `'mount'`: Initial values are being validated.
