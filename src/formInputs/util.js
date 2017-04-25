export const buildHandler = (override, fn) => e =>
  !override
    ? fn(e)
    : override(e, (...args) => fn(e, ...args))

