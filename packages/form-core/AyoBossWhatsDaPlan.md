# Field Groups?

What? Are we high?

```tsx
type StrictFieldSlot<TValue> = {
  readonly mode: 'strict'
  readonly value: TValue
}

type LooseFieldSlot<TAcceptedValue> = {
  readonly mode: 'loose'
  readonly value: TAcceptedValue
}

export type FieldSlot<TValue> = StrictFieldSlot<TValue> | LooseFieldSlot<TValue>

export const fieldSlot = {
  strict<TValue>(): StrictFieldSlot<TValue> {
    return null as never
  },
  loose<TAcceptedValue>(): LooseFieldSlot<TAcceptedValue> {
    return null as never
  },
}

type IsSame<TTypeA, TTypeB> = [TTypeA] extends [TTypeB]
  ? [TTypeB] extends [TTypeA]
    ? true
    : false
  : false

type FieldPresetNameForSlot<TFieldData, TSlot extends FieldSlot<any>> = {
  [TName in DeepKeys<TFieldData>]: TSlot extends StrictFieldSlot<infer TValue>
    ? IsSame<DeepValue<TFieldData, TName>, TValue> extends true
      ? TName
      : never
    : TSlot extends LooseFieldSlot<infer TAcceptedValue>
      ? [DeepValue<TFieldData, TName>] extends [TAcceptedValue]
        ? TName
        : never
      : never
}[DeepKeys<TFieldData>]

export type FieldPresetNames<
  TFieldData,
  TSlots extends Record<string, FieldSlot<any>>,
> = {
  [K in keyof TSlots]: FieldPresetNameForSlot<TFieldData, TSlots[K]>
}

export type FieldPresetFieldComponent<TFieldData> = <
  TName extends DeepKeys<TFieldData>,
  TValue extends DeepValue<TFieldData, TName>,
  TValidators extends FieldValidators<TFieldData, TName, TValue>,
>(
  props: ReactFormFieldProps<
    TFieldData,
    TName,
    TValue,
    TValidators,
    any,
    any,
    any,
    any,
    any
  >,
) => CrossVersionReactNode

export function createFieldPreset<
  const TSlots extends Record<string, FieldSlot<any>>,
>(options: {
  slots: TSlots
  render: <TFieldData>(context: {
    Field: FieldPresetFieldComponent<TFieldData>
    names: FieldPresetNames<TFieldData, TSlots>
  }) => CrossVersionReactNode
}) {
  return {
    slots: options.slots,
    Fields<TFieldData>(props: {
      Field: FieldPresetFieldComponent<TFieldData>
      names: FieldPresetNames<TFieldData, TSlots>
    }) {
      return options.render(props)
    },
  }
}

export const passwordPair = createFieldPreset({
  slots: {
    password: fieldSlot.strict<string>(),
    confirmPassword: fieldSlot.strict<string>(),
  },
  render: ({ Field, names }) => (
    <Field
      name={names.password}
      validators={[
        {
          triggers: ['blur', 'change'],
          run: ({ value }) =>
            typeof value === 'string' && value.length >= 8
              ? undefined
              : { message: 'Password must be at least 8 characters.' },
        },
      ]}
    >
      {(password) => (
        <>
          <password.Field>
            <password.Label>Password</password.Label>
            <password.TextInput type="password" />
            <password.Error />
          </password.Field>

          <Field
            name={names.confirmPassword}
            validators={[
              {
                triggers: ['blur', 'change'],
                watchFields: [names.password],
                run: ({ value }) =>
                  value === password.value
                    ? undefined
                    : { message: 'Passwords must match.' },
              },
            ]}
          >
            {(confirmPassword) => (
              <confirmPassword.Field>
                <confirmPassword.Label>Confirm password</confirmPassword.Label>
                <confirmPassword.TextInput type="password" />
                <confirmPassword.Error />
              </confirmPassword.Field>
            )}
          </Field>
        </>
      )}
    </Field>
  ),
})
```
