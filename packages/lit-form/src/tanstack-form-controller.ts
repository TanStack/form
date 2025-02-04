import { nothing } from 'lit'
import { PartType, directive } from 'lit/directive.js'
import { FieldApi, FormApi } from '@tanstack/form-core'
import { AsyncDirective } from 'lit/async-directive.js'
import type {
  DeepKeys,
  DeepValue,
  FieldOptions,
  FormOptions,
  Validator,
} from '@tanstack/form-core'
import type { ElementPart, PartInfo } from 'lit/directive.js'
import type { ReactiveController, ReactiveControllerHost } from 'lit'

type renderCallback<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TParentMetaExtension = never,
> = (
  fieldOptions: FieldApi<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  >,
) => unknown

type fieldDirectiveType<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TParentMetaExtension = never,
> = (
  form: FormApi<TParentData, TFormValidator>,
  options: FieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  >,
  render: renderCallback<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  >,
) => {
  values: {
    form: FormApi<TParentData, TFormValidator, TParentMetaExtension>
    options: FieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TParentMetaExtension
    >
    render: renderCallback<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TParentMetaExtension
    >
  }
}

export class TanStackFormController<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TParentMetaExtension = never,
> implements ReactiveController
{
  #host: ReactiveControllerHost
  #subscription?: () => void

  api: FormApi<TParentData, TFormValidator, TParentMetaExtension>

  constructor(
    host: ReactiveControllerHost,
    config?: FormOptions<TParentData, TFormValidator, TParentMetaExtension>,
  ) {
    ;(this.#host = host).addController(this)

    this.api = new FormApi<TParentData, TFormValidator, TParentMetaExtension>(
      config,
    )
  }

  hostConnected() {
    this.#subscription = this.api.store.subscribe(() => {
      this.#host.requestUpdate()
    })
  }

  hostDisconnected() {
    this.#subscription?.()
  }

  field<
    TName extends DeepKeys<TParentData>,
    TFieldValidator extends
      | Validator<DeepValue<TParentData, TName>, unknown>
      | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  >(
    fieldConfig: FieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TParentMetaExtension
    >,
    render: renderCallback<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TParentMetaExtension
    >,
  ) {
    return (
      fieldDirective as unknown as fieldDirectiveType<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData,
        TParentMetaExtension
      >
    )(this.api as any, fieldConfig, render)
  }
}

class FieldDirective<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TParentMetaExtension = never,
> extends AsyncDirective {
  #registered = false
  #field?: FieldApi<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  >
  #unmount?: () => void

  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.CHILD) {
      throw new Error(
        'The `field` directive must be used in the `child` attribute',
      )
    }
  }

  update(
    _: ElementPart,
    [form, fieldConfig, _render]: Parameters<this['render']>,
  ) {
    if (!this.#registered) {
      if (!this.#field) {
        const options = { ...fieldConfig, form }

        this.#field = new FieldApi(options)
        this.#unmount = this.#field.mount()
      }

      this.#registered = true
    }

    return this.render(form, fieldConfig, _render)
  }

  protected disconnected() {
    super.disconnected()
    this.#unmount?.()
  }

  protected reconnected() {
    super.reconnected()
    if (this.#field) {
      this.#unmount = this.#field.mount()
    }
  }

  render(
    _form: FormApi<TParentData, TFormValidator, TParentMetaExtension>,
    _fieldConfig: FieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TParentMetaExtension
    >,
    _renderCallback: renderCallback<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TParentMetaExtension
    >,
  ) {
    if (this.#field) {
      return _renderCallback(this.#field)
    }
    return nothing
  }
}

const fieldDirective = directive(FieldDirective)
