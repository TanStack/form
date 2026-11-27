declare const exactFieldSymbol: unique symbol
declare const acceptsFieldSymbol: unique symbol

export type ExactFieldBrand<out TValue> = {
  readonly [exactFieldSymbol]: TValue
}

export type AcceptsFieldBrand<out TAcceptedValue> = {
  readonly [acceptsFieldSymbol]: TAcceptedValue
}
