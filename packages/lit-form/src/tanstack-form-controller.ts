import { nothing } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { PartType, directive } from 'lit/directive.js'
import { TanStackStoreSelector, shallow } from '@tanstack/lit-store'
import {
  InternalFormApi,
  InternalFormGroupApi,
} from '@tanstack/form-core/internals'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  FieldValidators,
  FormApi,
  FormErrorTypes,
  FormGroupApi,
  FormGroupOptions,
  FormGroupState,
  FormGroupValidators,
  FormOptions,
  FormState,
  FormValidators,
  ToFieldError,
  ToFormErrorTypes,
  ToFormGroupErrorTypes,
} from '@tanstack/form-core'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
  AnyInternalFormApi,
  InternalBaseFieldMeta,
} from '@tanstack/form-core/internals'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { Part, PartInfo } from 'lit/directive.js'

type SelectionSource<TValue> = {
  get: () => TValue
  subscribe: (listener: (value: TValue) => void) => {
    unsubscribe: () => void
  }
}

type RenderCallback<TValue> = (value: TValue) => unknown

type LitFieldOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupFieldError,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> = FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupFieldError,
  TFormData,
  TFormErrorTypes
>

type LitFieldRenderApi<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupFieldError,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> = FieldApi<
  TFieldName,
  TFieldValue,
  ToFieldError<NoInfer<TFieldValidators>, TGroupFieldError, TFormErrorTypes>,
  TFormData,
  TFormErrorTypes
>

export interface LitFieldMethods<
  TFieldData,
  TGroupFieldError,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> {
  field<
    const TFieldName extends DeepKeys<TFieldData>,
    const TFieldValidators extends FieldValidators<
      TFieldData,
      TFieldName,
      DeepValue<TFieldData, TFieldName>
    >,
  >(
    options: LitFieldOptions<
      TFieldData,
      TFieldName,
      DeepValue<TFieldData, TFieldName>,
      TFieldValidators,
      TGroupFieldError,
      TFormData,
      TFormErrorTypes
    >,
    render: RenderCallback<
      LitFieldRenderApi<
        TFieldData,
        TFieldName,
        DeepValue<TFieldData, TFieldName>,
        TFieldValidators,
        TGroupFieldError,
        TFormData,
        TFormErrorTypes
      >
    >,
  ): unknown

  arrayField<
    const TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>,
    const TFieldValidators extends FieldValidators<
      TFieldData,
      TFieldName,
      DeepValue<TFieldData, TFieldName>
    >,
  >(
    options: LitFieldOptions<
      TFieldData,
      TFieldName,
      DeepValue<TFieldData, TFieldName>,
      TFieldValidators,
      TGroupFieldError,
      TFormData,
      TFormErrorTypes
    >,
    render: RenderCallback<
      LitFieldRenderApi<
        TFieldData,
        TFieldName,
        DeepValue<TFieldData, TFieldName>,
        TFieldValidators,
        TGroupFieldError,
        TFormData,
        TFormErrorTypes
      >
    >,
  ): unknown
}

export interface LitSubscribeMethod<TState> {
  subscribe<TSelected>(
    selector: (state: TState) => TSelected,
    render: RenderCallback<NoInfer<TSelected>>,
    when?: (selected: NoInfer<TSelected>) => boolean,
  ): unknown
}

export type LitFormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
  TFormErrorTypes extends FormErrorTypes,
> = FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupErrorTypes,
  TFormErrorTypes
> &
  LitFieldMethods<
    TGroupValue,
    TGroupErrorTypes['fieldError'],
    TFormData,
    TFormErrorTypes
  > &
  LitSubscribeMethod<FormGroupState<TGroupValue, TGroupErrorTypes>>

export class TanStackFormController<
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>
  implements
    ReactiveController,
    LitFieldMethods<
      TFormData,
      never,
      TFormData,
      ToFormErrorTypes<TFormValidators, TSubmitReturn>
    >,
    LitSubscribeMethod<
      FormState<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>>
    >
{
  readonly #form: InternalFormApi<TFormData, TFormValidators, TSubmitReturn>
  #unmount?: () => void

  get api(): FormApi<
    TFormData,
    ToFormErrorTypes<TFormValidators, TSubmitReturn>
  > {
    return this.#form
  }

  constructor(
    host: ReactiveControllerHost,
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) {
    this.#form = new InternalFormApi(options)
    new TanStackStoreSelector(host, () => this.#form._atoms.resetVersion)
    host.addController(this)
  }

  hostConnected() {
    this.#disconnect()
    this.#unmount = this.#form.mount()
  }

  hostDisconnected() {
    this.#disconnect()
  }

  #disconnect() {
    this.#unmount?.()
    this.#unmount = undefined
  }

  /** Updates reactive form options without replacing the form instance. */
  update(options: FormOptions<TFormData, TFormValidators, TSubmitReturn>) {
    this.#form._update(options)
  }

  field<
    const TFieldName extends DeepKeys<TFormData>,
    const TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>
    >,
  >(
    options: LitFieldOptions<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      never,
      TFormData,
      ToFormErrorTypes<TFormValidators, TSubmitReturn>
    >,
    render: RenderCallback<
      LitFieldRenderApi<
        TFormData,
        TFieldName,
        DeepValue<TFormData, TFieldName>,
        TFieldValidators,
        never,
        TFormData,
        ToFormErrorTypes<TFormValidators, TSubmitReturn>
      >
    >,
  ): unknown {
    return fieldDirective(
      this.#form,
      options as unknown as AnyFieldApiOptions,
      render,
      false,
    )
  }

  arrayField<
    const TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
    const TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>
    >,
  >(
    options: LitFieldOptions<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      never,
      TFormData,
      ToFormErrorTypes<TFormValidators, TSubmitReturn>
    >,
    render: RenderCallback<
      LitFieldRenderApi<
        TFormData,
        TFieldName,
        DeepValue<TFormData, TFieldName>,
        TFieldValidators,
        never,
        TFormData,
        ToFormErrorTypes<TFormValidators, TSubmitReturn>
      >
    >,
  ): unknown {
    return fieldDirective(
      this.#form,
      options as unknown as AnyFieldApiOptions,
      render,
      true,
    )
  }

  subscribe<TSelected>(
    selector: (
      state: FormState<
        TFormData,
        ToFormErrorTypes<TFormValidators, TSubmitReturn>
      >,
    ) => TSelected,
    render: RenderCallback<NoInfer<TSelected>>,
    when?: (selected: NoInfer<TSelected>) => boolean,
  ): unknown {
    return subscribeDirective(this.#form.atom, selector, render, when)
  }

  formGroup<
    const TGroupName extends DeepKeys<TFormData>,
    TGroupValue extends DeepValue<TFormData, TGroupName>,
    const TGroupValidators extends FormGroupValidators<TGroupValue>,
  >(
    options: Omit<
      FormGroupOptions<
        TFormData,
        TGroupName,
        TGroupValue,
        TGroupValidators,
        ToFormErrorTypes<TFormValidators, TSubmitReturn>
      >,
      'form'
    >,
    render: RenderCallback<
      LitFormGroupApi<
        TFormData,
        TGroupName,
        TGroupValue,
        ToFormGroupErrorTypes<TGroupValidators>,
        ToFormErrorTypes<TFormValidators, TSubmitReturn>
      >
    >,
  ): unknown {
    return formGroupDirective(this.#form, options, render)
  }
}

type AnyRender = (value: any) => unknown

class FieldDirective extends AsyncDirective {
  #form?: AnyInternalFormApi
  #options?: AnyFieldApiOptions
  #renderCallback?: AnyRender
  #isArrayField = false
  #field?: AnyInternalFieldApi
  #unregister?: () => void
  #unsubscribe?: () => void
  #selection?: readonly [any, any]

  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.CHILD) {
      throw new Error('The `field` directive must be used in a child part')
    }
  }

  update(
    _part: Part,
    [form, options, renderCallback, isArrayField]: Parameters<this['render']>,
  ) {
    this.#form = form
    this.#options = options
    this.#renderCallback = renderCallback
    this.#isArrayField = isArrayField
    if (this.isConnected) this.#connect()
    return this.#renderValue()
  }

  render(
    form: AnyInternalFormApi,
    options: AnyFieldApiOptions,
    renderCallback: AnyRender,
    isArrayField: boolean,
  ) {
    void form
    void options
    void renderCallback
    void isArrayField
    return nothing
  }

  #connect() {
    if (!this.#form || !this.#options || !this.#renderCallback) return

    const field = this.#form._getOrCreateFieldApi(this.#options)
    if (field !== this.#field) {
      this.#disconnect()
      this.#field = field
    } else {
      const { name: _name, ...fieldOptions } = this.#options
      field._update(fieldOptions)
    }

    if (!this.#unregister) {
      this.#unregister = field._register()
      this.#selection = this.#select(field)
    }
    if (!this.#unsubscribe) {
      this.#unsubscribe = field.atom.subscribe(() => {
        const next = this.#select(field)
        if (
          this.#selection?.[0] === next[0] &&
          this.#selection?.[1] === next[1]
        ) {
          return
        }
        this.#selection = next
        this.setValue(this.#renderValue())
      }).unsubscribe
    }
  }

  #select(field: AnyInternalFieldApi): readonly [any, any] {
    if (this.#isArrayField) {
      return [
        field.value.length,
        (field.meta as InternalBaseFieldMeta)._arrayVersion,
      ]
    }
    return [field.value, field.meta]
  }

  #renderValue() {
    return this.#field && this.#renderCallback
      ? this.#renderCallback(this.#field)
      : nothing
  }

  #disconnect() {
    this.#unsubscribe?.()
    this.#unsubscribe = undefined
    this.#unregister?.()
    this.#unregister = undefined
    this.#selection = undefined
  }

  protected disconnected() {
    super.disconnected()
    this.#disconnect()
  }

  protected reconnected() {
    super.reconnected()
    this.#connect()
    this.setValue(this.#renderValue())
  }
}

class SubscribeDirective extends AsyncDirective {
  #source?: SelectionSource<any>
  #selector?: (state: any) => any
  #renderCallback?: AnyRender
  #when?: (selected: any) => boolean
  #selected?: any
  #hasSelected = false
  #unsubscribe?: () => void

  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.CHILD) {
      throw new Error('The `subscribe` directive must be used in a child part')
    }
  }

  update(
    _part: Part,
    [source, selector, renderCallback, when]: Parameters<this['render']>,
  ) {
    const sourceChanged = source !== this.#source
    this.#source = source
    this.#selector = selector
    this.#renderCallback = renderCallback
    this.#when = when
    if (sourceChanged) this.#disconnect()
    if (this.isConnected) this.#connect()
    if (!sourceChanged) {
      this.#selected = selector(source.get())
      this.#hasSelected = true
    }
    return this.#renderValue()
  }

  render(
    source: SelectionSource<any>,
    selector: (state: any) => any,
    renderCallback: AnyRender,
    when?: (selected: any) => boolean,
  ) {
    void source
    void selector
    void renderCallback
    void when
    return nothing
  }

  #connect() {
    if (
      this.#unsubscribe ||
      !this.#source ||
      !this.#selector ||
      !this.#renderCallback
    ) {
      return
    }

    this.#selected = this.#selector(this.#source.get())
    this.#hasSelected = true
    this.#unsubscribe = this.#source.subscribe((state: any) => {
      const next = this.#selector!(state)
      if (this.#hasSelected && shallow(this.#selected, next)) return
      this.#selected = next
      this.#hasSelected = true
      this.setValue(this.#renderValue())
    }).unsubscribe
  }

  #renderValue() {
    if (!this.#hasSelected || !this.#renderCallback) return nothing
    if (this.#when && !this.#when(this.#selected)) return nothing
    return this.#renderCallback(this.#selected)
  }

  #disconnect() {
    this.#unsubscribe?.()
    this.#unsubscribe = undefined
    this.#hasSelected = false
    this.#selected = undefined
  }

  protected disconnected() {
    super.disconnected()
    this.#disconnect()
  }

  protected reconnected() {
    super.reconnected()
    this.#connect()
    this.setValue(this.#renderValue())
  }
}

type AnyInternalFormGroupApi = InternalFormGroupApi<any, any, any, any, any> &
  LitFieldMethods<any, any, any, any> &
  LitSubscribeMethod<any>

class FormGroupDirective extends AsyncDirective {
  #form?: AnyInternalFormApi
  #options?: Omit<FormGroupOptions<any, any, any, any, any>, 'form'>
  #renderCallback?: AnyRender
  #group?: AnyInternalFormGroupApi
  #unsubscribe?: () => void
  #mounted = false

  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.CHILD) {
      throw new Error('The `formGroup` directive must be used in a child part')
    }
  }

  update(
    _part: Part,
    [form, options, renderCallback]: Parameters<this['render']>,
  ) {
    this.#form = form
    this.#options = options
    this.#renderCallback = renderCallback
    if (this.isConnected) this.#connect()
    return this.#renderValue()
  }

  render(
    form: AnyInternalFormApi,
    options: Omit<FormGroupOptions<any, any, any, any, any>, 'form'>,
    renderCallback: AnyRender,
  ) {
    void form
    void options
    void renderCallback
    return nothing
  }

  #connect() {
    if (!this.#form || !this.#options || !this.#renderCallback) return

    if (
      !this.#group ||
      this.#group.form !== this.#form ||
      this.#group.name !== this.#options.name
    ) {
      this.#disconnect(true)
      this.#group = attachGroupMethods(
        new InternalFormGroupApi({
          ...this.#options,
          form: this.#form,
        } as never),
        this.#form,
      )
    } else {
      this.#group.update({ ...this.#options, form: this.#form } as never)
    }

    if (!this.#mounted) {
      this.#group.mount()
      this.#mounted = true
    }
    if (!this.#unsubscribe) {
      this.#unsubscribe = this.#group.atom.subscribe(() => {
        this.setValue(this.#renderValue())
      }).unsubscribe
    }
  }

  #renderValue() {
    return this.#group && this.#renderCallback
      ? this.#renderCallback(this.#group)
      : nothing
  }

  #disconnect(destroy = false) {
    this.#unsubscribe?.()
    this.#unsubscribe = undefined
    if (this.#mounted) this.#group?._cleanup()
    this.#mounted = false
    if (destroy) this.#group = undefined
  }

  protected disconnected() {
    super.disconnected()
    this.#disconnect()
  }

  protected reconnected() {
    super.reconnected()
    this.#connect()
    this.setValue(this.#renderValue())
  }
}

function attachGroupMethods(
  group: InternalFormGroupApi<any, any, any, any, any>,
  form: AnyInternalFormApi,
): AnyInternalFormGroupApi {
  const result = group as AnyInternalFormGroupApi
  result.field = (options, render) =>
    fieldDirective(
      form,
      group._getFormFieldOptions(options, (base, overrides) => ({
        ...base,
        ...overrides,
      })),
      render,
      false,
    )
  result.arrayField = (options, render) =>
    fieldDirective(
      form,
      group._getFormFieldOptions(options, (base, overrides) => ({
        ...base,
        ...overrides,
      })),
      render,
      true,
    )
  result.subscribe = (selector, render, when) =>
    subscribeDirective(group.atom, selector, render, when)
  return result
}

const fieldDirective = directive(FieldDirective)
const subscribeDirective = directive(SubscribeDirective)
const formGroupDirective = directive(FormGroupDirective)
