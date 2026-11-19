/**
 * Returns an options object for form-core that reads each key from `source`
 * at the time of the read. The keys of `fixed` keep their values.
 *
 * `FieldApi` keeps its options by reference, and reads them when it needs them:
 *
 * ```ts
 * // @tanstack/form-core, src/FieldApi.ts
 * this.options = opts
 * // ...and later, at the time of a change:
 * this.options.listeners?.onChange?.({ value, fieldApi: this })
 * ```
 *
 * So form-core always gets the current value of each arg,
 * and nobody must push a new options object into it after an arg changes.
 *
 * The getters are enumerable, because form-core copies the options
 * with a spread before each validation.
 */
export function liveOptions<TSource extends object, TFixed extends object>(
  source: TSource,
  fixed: TFixed,
): TSource & TFixed {
  const options = { ...fixed }

  for (const key of Object.keys(source) as (keyof TSource & string)[]) {
    if (key in fixed) continue

    Object.defineProperty(options, key, {
      enumerable: true,
      get: () => source[key],
    })
  }

  return options as TSource & TFixed
}
