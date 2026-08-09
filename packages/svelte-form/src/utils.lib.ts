export function withComponentProps<
  TProps extends object,
  TExtra extends object,
>(props: TProps, extra: TExtra): TProps & TExtra {
  return new Proxy(props as TProps & TExtra, {
    get(target, property, receiver) {
      if (Reflect.has(extra, property)) return Reflect.get(extra, property)
      return Reflect.get(target, property, receiver)
    },
    has(target, property) {
      return Reflect.has(extra, property) || Reflect.has(target, property)
    },
    ownKeys(target) {
      return [
        ...new Set([...Reflect.ownKeys(target), ...Reflect.ownKeys(extra)]),
      ]
    },
    getOwnPropertyDescriptor(target, property) {
      if (Reflect.has(extra, property)) {
        return {
          configurable: true,
          enumerable: true,
          value: Reflect.get(extra, property),
          writable: false,
        }
      }
      return Reflect.getOwnPropertyDescriptor(target, property)
    },
  })
}
