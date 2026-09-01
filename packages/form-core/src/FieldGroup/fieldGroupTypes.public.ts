import type { DeepKeys, DeepValue } from '../deep-keys.public'

declare const fieldGroupFieldSlotValueSymbol: unique symbol

/**
 * Controls how a virtual field's value type is matched to concrete form field
 * paths.
 *
 * `strict` requires an exact type match. `loose` also accepts narrower value
 * types that are assignable to the virtual field's declared type.
 */
export type FieldGroupFieldSlotMode = 'strict' | 'loose'

/**
 * Describes the value type and matching rule for one virtual field in a
 * reusable field group.
 *
 * Slots are type markers consumed by a field-group definition. Their
 * properties are not available at runtime.
 *
 * Create slots with `FieldGroupHelper.strict` or `FieldGroupHelper.loose`
 * inside a field-group definition instead of constructing them directly.
 *
 * @typeParam TValue - The value type declared for the virtual field.
 * @typeParam TMode - Library-managed. Do not specify explicitly.
 */
export interface FieldGroupFieldSlot<
  out TValue,
  out TMode extends FieldGroupFieldSlotMode = FieldGroupFieldSlotMode,
> {
  /** Represents the slot's value-type matching rule at the type level. */
  readonly mode: TMode
  /** Preserves the declared value type for type-level inference. */
  readonly [fieldGroupFieldSlotValueSymbol]: TValue
}

/** A field-group slot with its value type and matching mode erased. */
export type AnyFieldGroupFieldSlot = FieldGroupFieldSlot<any>

/**
 * A virtual field slot that binds only to form fields with exactly `TValue`.
 *
 * @typeParam TValue - The value type the concrete form field must match.
 */
export type StrictFieldGroupFieldSlot<TValue> = FieldGroupFieldSlot<
  TValue,
  'strict'
>

/**
 * A virtual field slot that binds to form fields whose value type is
 * assignable to `TValue`.
 *
 * @typeParam TValue - The value type that compatible concrete field values
 * must be assignable to.
 */
export type LooseFieldGroupFieldSlot<TValue> = FieldGroupFieldSlot<
  TValue,
  'loose'
>

/**
 * Extracts the value type declared by a field-group slot.
 *
 * @typeParam TSlot - The slot whose declared value type is extracted.
 */
export type FieldGroupFieldSlotValue<TSlot> =
  TSlot extends FieldGroupFieldSlot<infer TValue> ? TValue : never

/**
 * Extracts whether a field-group slot uses strict or loose matching.
 *
 * @typeParam TSlot - The slot whose matching mode is extracted.
 */
export type FieldGroupFieldSlotModeOf<TSlot> =
  TSlot extends FieldGroupFieldSlot<any, infer TMode> ? TMode : never

type IsSame<TTypeA, TTypeB> = [TTypeA] extends [TTypeB]
  ? [TTypeB] extends [TTypeA]
    ? true
    : false
  : false

/**
 * Reports whether a concrete field value type satisfies a field-group slot's
 * matching rule.
 *
 * Strict slots require the two value types to be identical. Loose slots accept
 * a concrete value type that is assignable to the slot's declared value type.
 *
 * @typeParam TSlot - The virtual field slot that supplies the matching rule.
 * @typeParam TValue - The concrete form field value type to test.
 */
export type FieldGroupFieldSlotAllows<TSlot, TValue> =
  TSlot extends FieldGroupFieldSlot<infer TAcceptedValue, infer TMode>
    ? TMode extends 'strict'
      ? IsSame<TValue, TAcceptedValue>
      : [TValue] extends [TAcceptedValue]
        ? true
        : false
    : false

/**
 * Produces the union of deep field paths whose value types satisfy a
 * field-group slot.
 *
 * @typeParam TFieldData - The parent form data whose field paths are searched.
 * @typeParam TSlot - The virtual field slot that each path must satisfy.
 */
export type FieldGroupFieldNameForSlot<
  TFieldData,
  TSlot extends AnyFieldGroupFieldSlot,
> = {
  [TFieldName in DeepKeys<TFieldData>]: FieldGroupFieldSlotAllows<
    TSlot,
    DeepValue<TFieldData, TFieldName>
  > extends true
    ? TFieldName
    : never
}[DeepKeys<TFieldData>]

/** A reusable field-group schema keyed by its virtual field names. */
export type FieldGroupFields = Record<string, AnyFieldGroupFieldSlot>

/**
 * Maps each virtual field name to the compatible deep paths in field data.
 *
 * @typeParam TFieldData - The parent form data whose field paths are searched.
 * @typeParam TFields - The virtual field schema whose slots constrain each
 * path.
 */
export type FieldGroupFieldNames<
  TFieldData,
  TFields extends FieldGroupFields,
> = {
  [TFieldName in keyof TFields]: FieldGroupFieldNameForSlot<
    TFieldData,
    TFields[TFieldName]
  >
}

/**
 * Converts a virtual field schema into the value shape exposed by its field
 * group API.
 *
 * @typeParam TFields - The virtual field schema whose value types are
 * extracted.
 */
export type FieldGroupFieldData<TFields extends FieldGroupFields> = {
  [
    TFieldName in keyof TFields
  ]: TFields[TFieldName] extends FieldGroupFieldSlot<infer TValue, any>
    ? TValue
    : never
}

/**
 * Produces the concrete form paths that can bind to one virtual field slot.
 *
 * @typeParam TFormData - The parent form data whose field paths are searched.
 * @typeParam TSlot - The virtual field slot that each path must satisfy.
 */
export type FieldGroupFieldBindingForSlot<
  TFormData,
  TSlot extends AnyFieldGroupFieldSlot,
> = FieldGroupFieldNameForSlot<TFormData, TSlot>

/**
 * Maps every virtual field name to the compatible concrete paths in a parent
 * form.
 *
 * A supplied binding map is complete: every virtual field in `TFields` must be
 * assigned a compatible path from `TFormData`.
 *
 * @typeParam TFields - The virtual field schema whose keys become binding
 * keys.
 * @typeParam TFormData - The parent form data whose paths can be bound.
 */
export type FieldGroupFieldBindings<
  TFields extends FieldGroupFields,
  TFormData = any,
> = {
  [TFieldName in keyof TFields]: FieldGroupFieldBindingForSlot<
    TFormData,
    TFields[TFieldName]
  >
}

type FieldGroupIdentityBindings<TFields extends FieldGroupFields> = {
  [TFieldName in keyof TFields]: Extract<TFieldName, string>
}

type FieldGroupFieldsPropsDefinition<
  TFields extends FieldGroupFields,
  TFormData,
  TFieldsPropName extends PropertyKey,
> = {
  [TPropName in TFieldsPropName]: FieldGroupFieldBindings<TFields, TFormData>
}

/**
 * Builds the concrete-field bindings prop accepted by a bound field-group
 * component.
 *
 * The prop is optional only when every virtual field name is already a
 * compatible path in the parent form. Omitting it then binds each virtual
 * field to the same-named path. Otherwise, callers must supply a complete
 * binding map.
 *
 * @typeParam TFields - The virtual field schema whose keys require bindings.
 * @typeParam TFormData - The parent form data used to validate paths and
 * identity bindings.
 * @typeParam TFieldsPropName - The component prop that carries the binding
 * map.
 */
export type FieldGroupFieldBindingsProps<
  TFields extends FieldGroupFields,
  TFormData,
  TFieldsPropName extends PropertyKey,
> = unknown extends TFormData
  ? FieldGroupFieldsPropsDefinition<TFields, TFormData, TFieldsPropName>
  : FieldGroupIdentityBindings<TFields> extends FieldGroupFieldBindings<
        TFields,
        TFormData
      >
    ? Partial<
        FieldGroupFieldsPropsDefinition<TFields, TFormData, TFieldsPropName>
      >
    : FieldGroupFieldsPropsDefinition<TFields, TFormData, TFieldsPropName>

/**
 * Finds the component prop whose value type exactly matches a field-group API.
 *
 * @typeParam TProps - The component props searched for the field-group API.
 * @typeParam TFieldGroup - The field-group API type that a prop must exactly
 * match.
 */
export type FieldGroupFieldsPropName<TProps, TFieldGroup> = {
  [TPropName in keyof TProps]-?: IsSame<
    TProps[TPropName],
    TFieldGroup
  > extends true
    ? TPropName
    : never
}[keyof TProps]

/**
 * Declares the virtual fields in a reusable field group and how their value
 * types may bind to concrete form fields.
 *
 * @example
 * ```ts
 * const profileFields = defineFieldGroup(({ strict, loose }) => ({
 *   name: strict(''),
 *   status: loose<string>(),
 * }))
 * ```
 */
export interface FieldGroupHelper {
  /**
   * Declares a virtual field whose value type must exactly match the value type
   * of the concrete form field it binds to.
   *
   * @example
   * ```tsx
   * const passwordFieldGroup = defineFieldGroup(({ strict }) => ({
   *   password: strict<string>(),
   *   confirmPassword: strict<string>(),
   * }))
   * ```
   */
  strict: {
    /**
     * @typeParam TValue - Inferred from the representative value.
     * @param value - A representative value used only for type inference.
     * @returns A field slot that uses strict value-type matching.
     */
    <TValue>(value: TValue): StrictFieldGroupFieldSlot<TValue>
    /**
     * @typeParam TValue - The value type the concrete form field must match
     * exactly.
     * @returns A field slot that uses strict value-type matching.
     */
    <TValue>(): StrictFieldGroupFieldSlot<TValue>
  }
  /**
   * Declares a virtual field that can bind to form fields whose value type is
   * assignable to the declared type.
   *
   * @example
   * ```tsx
   * const passwordFieldGroup = defineFieldGroup(({ loose }) => ({
   *   password: loose<string>(),
   *   confirmPassword: loose<string>(),
   * }))
   * ```
   */
  loose: {
    /**
     * @typeParam TValue - Inferred from the representative value.
     * @param value - A representative value used only for type inference.
     * @returns A field slot that uses assignable value-type matching.
     */
    <TValue>(value: TValue): LooseFieldGroupFieldSlot<TValue>
    /**
     * @typeParam TValue - The value type that compatible concrete field values
     * must be assignable to.
     * @returns A field slot that uses assignable value-type matching.
     */
    <TValue>(): LooseFieldGroupFieldSlot<TValue>
  }
}
