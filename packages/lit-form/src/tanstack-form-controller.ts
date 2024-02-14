import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { nothing } from 'lit'
import type { ElementPart, PartInfo } from 'lit/directive.js'
import { directive, PartType } from 'lit/directive.js'
import type {
  DeepKeys,
  FieldOptions,
  FormOptions,
  Validator,
  DeepValue,
} from '@tanstack/form-core'
import { FieldApi, FormApi } from '@tanstack/form-core'
import { AsyncDirective } from 'lit/async-directive.js'

type renderCallback<
  FormValues,
  Name extends DeepKeys<FormValues>,
  FieldValidator extends
    | Validator<DeepValue<FormValues, Name>, unknown>
    | undefined,
  FormValidator extends Validator<FormValues> | undefined,
> = (
  fieldOptions: FieldApi<FormValues, Name, FieldValidator, FormValidator>,
) => unknown
type fieldDirectiveType<
  FormValues,
  Name extends DeepKeys<FormValues>,
  FieldValidator extends
    | Validator<DeepValue<FormValues, Name>, unknown>
    | undefined,
  FormValidator extends Validator<FormValues> | undefined,
> = (
  form: FormApi<FormValues, FormValidator>,
  options: FieldOptions<FormValues, Name, FieldValidator, FormValidator>,
  render: renderCallback<FormValues, Name, FieldValidator, FormValidator>,
) => {
  values: {
    form: FormApi<FormValues, FormValidator>
    options: FieldOptions<FormValues, Name, FieldValidator, FormValidator>
    render: renderCallback<FormValues, Name, FieldValidator, FormValidator>
  }
}

export class TanstackFormController<
  FormValues,
  FormValidator extends Validator<FormValues> | undefined = undefined,
> implements ReactiveController
{
  #host: ReactiveControllerHost
  #subscription?: () => void

  api: FormApi<FormValues, FormValidator>

  constructor(
    host: ReactiveControllerHost,
    config?: FormOptions<FormValues, FormValidator>,
  ) {
    ;(this.#host = host).addController(this)

    this.api = new FormApi<FormValues, FormValidator>(config)
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
    Name extends DeepKeys<FormValues>,
    FieldValidator extends
      | Validator<DeepValue<FormValues, Name>, unknown>
      | undefined,
  >(
    fieldConfig: FieldOptions<FormValues, Name, FieldValidator, FormValidator>,
    render: renderCallback<FormValues, Name, FieldValidator, FormValidator>,
  ) {
    return (
      fieldDirective as unknown as fieldDirectiveType<
        FormValues,
        Name,
        FieldValidator,
        FormValidator
      >
    )(this.api, fieldConfig, render)
  }
}

class FieldDirective<
  FormValues,
  Name extends DeepKeys<FormValues>,
  FieldValidator extends
    | Validator<DeepValue<FormValues, Name>, unknown>
    | undefined = undefined,
  FormValidator extends Validator<FormValues> | undefined = undefined,
> extends AsyncDirective {
  #registered = false
  #field?: FieldApi<FormValues, Name, FieldValidator, FormValidator>
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
    _form: FormApi<FormValues, FormValidator>,
    _fieldConfig: FieldOptions<FormValues, Name, FieldValidator, FormValidator>,
    _renderCallback: renderCallback<
      FormValues,
      Name,
      FieldValidator,
      FormValidator
    >,
  ) {
    if (this.#field) {
      return _renderCallback(this.#field)
    }
    return nothing
  }
}

const fieldDirective = directive(FieldDirective)
