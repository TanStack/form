import { Directive, PartType, directive } from 'lit/directive.js'
import { createAtom, shallow } from '@tanstack/lit-store'
import {
  InternalFieldGroupApi,
  defineFieldGroupFieldsRuntime,
  fieldGroupHelperRuntime,
} from '@tanstack/form-core/internals'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FormApiArrayMethods,
  FormApiFieldMethods,
  FormErrorTypes,
  ValidationIssue,
} from '@tanstack/form-core'
import type { ReadonlyAtom } from '@tanstack/lit-store'
import type { Part, PartInfo } from 'lit/directive.js'
import type { InternalFieldGroupBindings } from '@tanstack/form-core/internals'
import type {
  LitFieldMethods,
  LitSubscribeMethod,
  TanStackFormController,
} from './tanstack-form-controller.js'

declare const fieldGroupFieldSlotValueSymbol: unique symbol
declare const fieldGroupFieldsSymbol: unique symbol

export type FieldGroupFieldSlotMode = 'strict' | 'loose'

export interface FieldGroupFieldSlot<
  out TValue,
  out TMode extends FieldGroupFieldSlotMode = FieldGroupFieldSlotMode,
> {
  readonly mode: TMode
  readonly [fieldGroupFieldSlotValueSymbol]: TValue
}

export type AnyFieldGroupFieldSlot = FieldGroupFieldSlot<any>

type IsSame<TTypeA, TTypeB> = [TTypeA] extends [TTypeB]
  ? [TTypeB] extends [TTypeA]
    ? true
    : false
  : false

type FieldGroupFieldSlotAllows<TSlot, TValue> =
  TSlot extends FieldGroupFieldSlot<infer TAcceptedValue, infer TMode>
    ? TMode extends 'strict'
      ? IsSame<TValue, TAcceptedValue>
      : [TValue] extends [TAcceptedValue]
        ? true
        : false
    : false

type FieldGroupFieldNameForSlot<
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

export type FieldGroupFields = Record<string, AnyFieldGroupFieldSlot>

export type FieldGroupFieldData<TFields extends FieldGroupFields> = {
  [
    TFieldName in keyof TFields
  ]: TFields[TFieldName] extends FieldGroupFieldSlot<infer TValue, any>
    ? TValue
    : never
}

export type LitFieldGroupApi<TFieldData> = LitFieldMethods<
  TFieldData,
  ValidationIssue,
  unknown,
  FormErrorTypes
> &
  LitSubscribeMethod<TFieldData> &
  FormApiFieldMethods<TFieldData> &
  FormApiArrayMethods<TFieldData> & {
    atom: ReadonlyAtom<TFieldData>
  }

export type FieldGroupFieldsOf<TFieldGroup> = TFieldGroup extends {
  readonly [fieldGroupFieldsSymbol]: infer TFields
}
  ? TFields
  : never

export type LitFieldGroup<TFields extends FieldGroupFields> = LitFieldGroupApi<
  FieldGroupFieldData<TFields>
> & {
  readonly [fieldGroupFieldsSymbol]: TFields
}

type FieldGroupFieldBindingForSlot<
  TFormData,
  TSlot extends AnyFieldGroupFieldSlot,
> =
  TSlot extends FieldGroupFieldSlot<infer TValue, infer TMode>
    ? TMode extends 'strict'
      ? FieldGroupFieldNameForSlot<TFormData, TSlot>
      : DeepKeysWhereValueIncludes<TFormData, TValue>
    : never

export type FieldGroupFieldBindings<
  TFields extends FieldGroupFields,
  TFormData = any,
> = {
  [TFieldName in keyof TFields]: FieldGroupFieldBindingForSlot<
    TFormData,
    TFields[TFieldName]
  >
}

export type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> =
  FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields
    ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData>
    : never

type FieldGroupFieldsPropName<TProps, TFieldGroup> = {
  [TPropName in keyof TProps]-?: IsSame<
    TProps[TPropName],
    TFieldGroup
  > extends true
    ? TPropName
    : never
}[keyof TProps]

type AnyLitForm<TFormData = any> = TanStackFormController<TFormData, any, any>

export type FieldGroupWithFieldsFn<
  TFieldGroup extends {
    readonly [fieldGroupFieldsSymbol]: FieldGroupFields
  },
> = <
  TProps extends object,
  TFieldsPropName extends FieldGroupFieldsPropName<TProps, TFieldGroup>,
>(
  render: (props: TProps) => unknown,
  fieldsPropName: TFieldsPropName,
) => <TFormData>(
  props: Omit<TProps, TFieldsPropName | 'form'> & {
    form: AnyLitForm<TFormData>
  } & {
    [TPropName in TFieldsPropName]: FieldGroupFieldBindingsOf<
      TFieldGroup,
      TFormData
    >
  },
) => unknown

export interface FieldGroupHelper {
  strict: <TValue>() => FieldGroupFieldSlot<TValue, 'strict'>
  loose: <TValue>() => FieldGroupFieldSlot<TValue, 'loose'>
}

export interface FieldGroupDefinition<TFields extends FieldGroupFields> {
  /** The virtual field-group API injected into the bound renderer. */
  fields: LitFieldGroup<TFields>
  /** Binds a renderer's virtual field API to concrete paths in a form. */
  bindComponent: FieldGroupWithFieldsFn<LitFieldGroup<TFields>>
}

export type DefineFieldGroupFn = <const TFields extends FieldGroupFields>(
  defineFn: (helper: FieldGroupHelper) => TFields,
) => FieldGroupDefinition<TFields>

function attachLitFieldGroupMethods(
  group: InternalFieldGroupApi,
  form: AnyLitForm,
): LitFieldGroupApi<any> {
  const resolveOptions = (options: { name: string }) =>
    group._getFormFieldOptions(options, (base, overrides) => ({
      ...base,
      ...overrides,
    }))

  return Object.assign(group, {
    field: (options: { name: string }, render: (field: any) => unknown) =>
      form.field(resolveOptions(options) as never, render),
    arrayField: (options: { name: string }, render: (field: any) => unknown) =>
      form.arrayField(resolveOptions(options) as never, render),
    subscribe: (
      selector: (value: any) => any,
      render: (value: any) => unknown,
      when?: (value: any) => boolean,
    ) => form.subscribe(() => selector(group.atom.get()), render, when),
  }) as never
}

class ReusableFieldGroupDirective extends Directive {
  private form?: AnyLitForm
  private fieldNames?: Array<string>
  private bindings = createAtom<InternalFieldGroupBindings>(
    {},
    { compare: shallow },
  )
  private api?: LitFieldGroupApi<any>

  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.CHILD) {
      throw new Error('Field groups must be rendered in a child part')
    }
  }

  update(
    _part: Part,
    [form, bindings, fieldNames, render, propName, props]: Parameters<
      this['render']
    >,
  ) {
    this.bindings.set(bindings)
    if (this.form !== form || this.fieldNames !== fieldNames || !this.api) {
      this.form = form
      this.fieldNames = fieldNames
      this.api = attachLitFieldGroupMethods(
        new InternalFieldGroupApi({
          form: form.api as never,
          fieldNames,
          getBindings: () => this.bindings.get(),
        }),
        form,
      )
    }
    return render({ ...props, [propName]: this.api })
  }

  render(
    form: AnyLitForm,
    bindings: InternalFieldGroupBindings,
    fieldNames: Array<string>,
    render: (props: Record<string, unknown>) => unknown,
    propName: string,
    props: Record<string, unknown>,
  ): unknown {
    void form
    void bindings
    void fieldNames
    void render
    void propName
    void props
    return undefined
  }
}

const reusableFieldGroupDirective = directive(ReusableFieldGroupDirective)

const withFieldsRuntime = (
  fields: FieldGroupFields,
  render: (props: Record<string, unknown>) => unknown,
  fieldsPropName: string,
) => {
  const fieldNames = Object.keys(fields)
  return (props: Record<string, unknown>) => {
    const { form, [fieldsPropName]: bindings, ...rest } = props
    if (!form) {
      throw new Error('TanStack Form: Field groups must receive a `form` prop.')
    }
    return reusableFieldGroupDirective(
      form as AnyLitForm,
      bindings as InternalFieldGroupBindings,
      fieldNames,
      render,
      fieldsPropName,
      rest,
    )
  }
}

export const defineFieldGroup = ((
  defineFn: (helper: FieldGroupHelper) => FieldGroupFields,
) => {
  const fields = defineFieldGroupFieldsRuntime(
    defineFn(fieldGroupHelperRuntime as never),
  )

  return {
    fields,
    bindComponent: (
      render: (props: Record<string, unknown>) => unknown,
      fieldsPropName: string,
    ) => withFieldsRuntime(fields, render, fieldsPropName),
  }
}) as unknown as DefineFieldGroupFn
