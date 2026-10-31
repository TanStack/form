type Primitive = string | number | boolean | bigint | symbol | null | undefined

export type BuiltInType = Primitive | Date | RegExp | Function

export type Editable<T> = T extends BuiltInType
  ? T | null | undefined
  : T extends ReadonlyArray<unknown>
    ? ReadonlyArray<Editable<T[number]>> | null | undefined
    : T extends object
      ? EditableObject<T> | null | undefined
      : T | null | undefined

type EditableObject<in out T extends object> = {
  [K in keyof T]?: Editable<T[K]>
}

type InferUnionObject<
  in out TBase extends object,
  in out TIncoming extends object,
> = {
  [K in keyof TBase | keyof TIncoming]: K extends keyof TBase
    ? K extends keyof TIncoming
      ? InferUnion<TBase[K], TIncoming[K]>
      : TBase[K]
    : K extends keyof TIncoming
      ? TIncoming[K] | undefined
      : never
}

export type InferUnion<TBase, TIncoming> = [TBase] extends [never]
  ? TIncoming
  : TBase extends BuiltInType
    ? TBase | TIncoming
    : TIncoming extends BuiltInType
      ? TBase | TIncoming
      : TBase extends ReadonlyArray<unknown>
        ? TIncoming extends ReadonlyArray<unknown>
          ? Array<InferUnion<TBase[number], TIncoming[number]>>
          : TBase | TIncoming
        : TBase extends object
          ? TIncoming extends object
            ? InferUnionObject<TBase, TIncoming>
            : TBase | TIncoming
          : TBase | TIncoming
