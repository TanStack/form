import { Directive, PartType, directive } from 'lit/directive.js'
import { createAtom, shallow } from '@tanstack/lit-store'
import {
  getBy,
  transformFieldOptionsFieldNames,
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
import type { Atom, ReadonlyAtom } from '@tanstack/lit-store'
import type { Part, PartInfo } from 'lit/directive.js'
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

type AnyFieldGroupFieldSlot = FieldGroupFieldSlot<any>

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

type FieldGroupFields = Record<string, AnyFieldGroupFieldSlot>

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

export type FieldGroupDefinition<TFields extends FieldGroupFields> =
  LitFieldGroupApi<FieldGroupFieldData<TFields>> & {
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

type FieldGroupFieldsPropName<TProps, TFields extends FieldGroupFields> = {
  [TPropName in keyof TProps]-?: IsSame<
    TProps[TPropName],
    FieldGroupDefinition<TFields>
  > extends true
    ? TPropName
    : never
}[keyof TProps]

type AnyLitForm<TFormData = any> = TanStackFormController<TFormData, any, any>

type FieldGroupWithFieldsFn = <
  const TFields extends FieldGroupFields,
  TProps extends object,
  TFieldsPropName extends FieldGroupFieldsPropName<TProps, TFields>,
>(
  fields: FieldGroupDefinition<TFields>,
  render: (props: TProps) => unknown,
  fieldsPropName: TFieldsPropName,
) => <TFormData>(
  props: Omit<TProps, TFieldsPropName | 'form'> & {
    form: AnyLitForm<TFormData>
  } & {
    [TPropName in TFieldsPropName]: FieldGroupFieldBindings<TFields, TFormData>
  },
) => unknown

interface FieldGroupHelper {
  strict: <TValue>() => FieldGroupFieldSlot<TValue, 'strict'>
  loose: <TValue>() => FieldGroupFieldSlot<TValue, 'loose'>
}

type DefineFieldsFn = <const TFields extends FieldGroupFields>(
  fields: TFields,
) => FieldGroupDefinition<TFields>

export interface FieldGroupHelpers {
  helper: FieldGroupHelper
  defineFields: DefineFieldsFn
  withFields: FieldGroupWithFieldsFn
}

type FieldBindings = Record<string, string>

interface ResolvedNameCacheEntry {
  binding: string
  name: string
}

function getRootSegmentEnd(name: string): number {
  const dotIndex = name.indexOf('.')
  const arrayIndex = name.indexOf('[')
  if (dotIndex === -1) return arrayIndex === -1 ? name.length : arrayIndex
  if (arrayIndex === -1) return dotIndex
  return Math.min(dotIndex, arrayIndex)
}

function resolveFieldName(
  bindings: FieldBindings,
  cache: Map<string, ResolvedNameCacheEntry>,
  fieldName: string,
) {
  const rootEnd = getRootSegmentEnd(fieldName)
  const rootName = fieldName.slice(0, rootEnd)
  const binding = bindings[rootName]
  if (binding === undefined) {
    throw new Error(
      `TanStack Form: Missing field group binding for "${rootName}".`,
    )
  }
  const cached = cache.get(fieldName)
  if (cached?.binding === binding) return cached.name
  const name = `${binding}${fieldName.slice(rootEnd)}`
  cache.set(fieldName, { binding, name })
  return name
}

function createFieldGroupApi(
  form: AnyLitForm,
  bindings: Atom<FieldBindings>,
  fieldNames: Array<string>,
): LitFieldGroupApi<any> {
  const runtimeForm = form.api as any
  const cache = new Map<string, ResolvedNameCacheEntry>()
  const resolveName = (name: string) =>
    resolveFieldName(bindings.get(), cache, name)
  const values = () => {
    const result: Record<string, unknown> = {}
    const formValues = runtimeForm.atom.get().values
    for (const name of fieldNames) {
      result[name] = getBy(formValues, resolveName(name))
    }
    return result
  }
  const atom = createAtom(values, { compare: shallow })
  const resolveOptions = (options: { name: string }) =>
    transformFieldOptionsFieldNames(options, resolveName, (base, overrides) => ({
      ...base,
      ...overrides,
    }))

  return {
    atom,
    field: (options: { name: string }, render: (field: any) => unknown) =>
      form.field(resolveOptions(options) as never, render),
    arrayField: (options: { name: string }, render: (field: any) => unknown) =>
      form.arrayField(resolveOptions(options) as never, render),
    subscribe: (
      selector: (value: any) => any,
      render: (value: any) => unknown,
      when?: (value: any) => boolean,
    ) => form.subscribe(() => selector(values()), render, when),
    getFieldValue: (name: string) =>
      runtimeForm.getFieldValue(resolveName(name)),
    setFieldValue: (name: string, value: unknown, options?: unknown) =>
      runtimeForm.setFieldValue(resolveName(name), value, options),
    resetField: (name: string) => runtimeForm.resetField(resolveName(name)),
    swapFieldValues: (
      name: string,
      indexA: number,
      indexB: number,
      options?: unknown,
    ) =>
      runtimeForm.swapFieldValues(resolveName(name), indexA, indexB, options),
    pushFieldValue: (name: string, value: unknown, options?: unknown) =>
      runtimeForm.pushFieldValue(resolveName(name), value, options),
    insertFieldValue: (
      name: string,
      index: number,
      value: unknown,
      options?: unknown,
    ) => runtimeForm.insertFieldValue(resolveName(name), index, value, options),
    clearFieldValues: (name: string, options?: unknown) =>
      runtimeForm.clearFieldValues(resolveName(name), options),
    removeFieldValue: (name: string, index: number, options?: unknown) =>
      runtimeForm.removeFieldValue(resolveName(name), index, options),
    filterFieldValues: (
      name: string,
      predicate: (...args: Array<any>) => boolean,
      options?: unknown,
    ) => runtimeForm.filterFieldValues(resolveName(name), predicate, options),
  } as never
}

class ReusableFieldGroupDirective extends Directive {
  private form?: AnyLitForm
  private fieldNames?: Array<string>
  private bindings = createAtom<FieldBindings>({}, { compare: shallow })
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
      this.api = createFieldGroupApi(form, this.bindings, fieldNames)
    }
    return render({ ...props, [propName]: this.api })
  }

  render(
    form: AnyLitForm,
    bindings: FieldBindings,
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

const helper: FieldGroupHelper = {
  strict: () => null as never,
  loose: () => null as never,
}

const defineFields = ((fields: FieldGroupFields) =>
  fields) as unknown as DefineFieldsFn

const withFields = ((
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
      bindings as FieldBindings,
      fieldNames,
      render,
      fieldsPropName,
      rest,
    )
  }
}) as unknown as FieldGroupWithFieldsFn

export function getFieldGroupHelpers(): FieldGroupHelpers {
  return { helper, defineFields, withFields }
}
