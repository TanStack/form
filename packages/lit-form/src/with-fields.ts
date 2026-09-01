import { Directive, PartType, directive } from 'lit/directive.js'
import { createAtom, shallow } from '@tanstack/lit-store'
import {
  InternalFieldGroupApi,
  defineFieldGroupFieldsRuntime,
  fieldGroupHelperRuntime,
} from '@tanstack/form-core/internals'
import type {
  FieldGroupFieldBindings,
  FieldGroupFieldBindingsProps,
  FieldGroupFieldData,
  FieldGroupFields,
  FieldGroupFieldsPropName,
  FieldGroupHelper,
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

declare const fieldGroupFieldsSymbol: unique symbol

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
  readonly [fieldGroupFieldsSymbol]: infer TFields extends FieldGroupFields
}
  ? TFields
  : never

export type LitFieldGroup<TFields extends FieldGroupFields> = LitFieldGroupApi<
  FieldGroupFieldData<TFields>
> & {
  readonly [fieldGroupFieldsSymbol]: TFields
}

export type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> =
  FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields
    ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData>
    : never

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
  } & FieldGroupFieldBindingsProps<
      FieldGroupFieldsOf<TFieldGroup>,
      TFormData,
      TFieldsPropName
    >,
) => unknown

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
  private bindings = createAtom<InternalFieldGroupBindings | undefined>(
    undefined,
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
    bindings: InternalFieldGroupBindings | undefined,
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
      bindings as InternalFieldGroupBindings | undefined,
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
