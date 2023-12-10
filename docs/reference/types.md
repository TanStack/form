---
id: types
title: Types

---

### Using TanStack Form Types

Normally, you will not need use these types directly. However, if you're debugging hard-to-reach issues or are a maintainer of one of our packages, these types can help you distinguish what's going on.

### `ValidationError`

A type representing a validation error. Possible values are `undefined`, `false`, `null`, or a `string` with an error message.

### `ValidationErrorMapKeys`
A type representing the keys used to map to `ValidationError` in `ValidationErrorMap`. It is defined with `on${Capitalize<ValidationCause>}`

### `ValidationErrorMap`

A type that represents a map with the keys as `ValidationErrorMapKeys` and the values as `ValidationError`