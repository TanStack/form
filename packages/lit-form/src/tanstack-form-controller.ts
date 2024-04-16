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
> = (
  fieldOptions: FieldApi<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
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
> = (
  form: FormApi<TParentData, TFormValidator>,
  options: FieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
  render: renderCallback<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
) => {
  values: {
    form: FormApi<TParentData, TFormValidator>
    options: FieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >
    render: renderCallback<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >
  }
}

export class TanStackFormController<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> implements ReactiveController
{
  #host: ReactiveControllerHost
  #subscription?: () => void

  api: FormApi<TParentData, TFormValidator>

  constructor(
    host: ReactiveControllerHost,
    config?: FormOptions<TParentData, TFormValidator>,
  ) {
    ;(this.#host = host).addController(this)

    this.api = new FormApi<TParentData, TFormValidator>(config)
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
      TData
    >,
    render: renderCallback<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
  ) {
    return (
      fieldDirective as unknown as fieldDirectiveType<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData
      >
    )(this.api, fieldConfig, render)
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
> extends AsyncDirective {
  #registered = false
  #field?: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>
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
    _form: FormApi<TParentData, TFormValidator>,
    _fieldConfig: FieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
    _renderCallback: renderCallback<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
  ) {
    if (this.#field) {
      return _renderCallback(this.#field)
    }
    return nothing
  }
}

const fieldDirective = directive(FieldDirective)
