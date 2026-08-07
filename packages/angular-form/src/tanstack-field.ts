import {
  ChangeDetectorRef,
  Directive,
  effect,
  inject,
  input,
  signal,
} from '@angular/core'
import type {
  DeepKeys,
  DeepValue,
  ErrorVisibility,
  FieldApi,
  FieldListeners,
  FieldValidators,
  FormValidators,
  ToFieldError,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type {
  AnyInternalFieldApi,
  InternalBaseFieldMeta,
  InternalFormApi,
} from '@tanstack/form-core/internals'

export type AngularFieldApi<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<
    TFormData,
    TFieldName,
    TFieldValue
  >,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> = FieldApi<
  TFieldName,
  TFieldValue,
  ToFieldError<
    TFieldValidators,
    never,
    ToFormErrorTypes<TFormValidators, TSubmitReturn>
  >,
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>
>

@Directive()
abstract class TanStackFieldBase<
  TFormData,
  const TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  const TFieldValidators extends FieldValidators<
    TFormData,
    TFieldName,
    TFieldValue
  >,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  name = input.required<TFieldName>()
  validators = input<NoInfer<TFieldValidators>>()
  listeners =
    input<
      NoInfer<
        FieldListeners<
          TFormData,
          TFieldName,
          TFieldValue,
          ToFieldError<
            TFieldValidators,
            never,
            ToFormErrorTypes<TFormValidators, TSubmitReturn>
          >,
          TFormData,
          ToFormErrorTypes<TFormValidators, TSubmitReturn>
        >
      >
    >()
  errorVisibility =
    input<
      ErrorVisibility<
        TFormData,
        ToFormErrorTypes<TFormValidators, TSubmitReturn>
      >
    >()
  errorBoundary = input<boolean>()

  protected abstract readonly isArrayField: boolean
  protected abstract getForm(): InternalFormApi<
    TFormData,
    TFormValidators,
    TSubmitReturn
  >

  private readonly changeDetector = inject(ChangeDetectorRef)
  private readonly resetVersion = signal(0)

  private getFieldOptions() {
    return {
      validators: this.validators(),
      listeners: this.listeners(),
      errorVisibility: this.errorVisibility(),
      errorBoundary: this.errorBoundary(),
    }
  }

  private getFieldApi() {
    void this.resetVersion()
    return this.getForm()._getOrCreateFieldApi({ name: this.name() } as never)
  }

  get api(): AngularFieldApi<
    TFormData,
    TFieldName,
    TFieldValue,
    TFieldValidators,
    TFormValidators,
    TSubmitReturn
  > {
    // Angular may evaluate an exported directive reference before constructor
    // effects run, so resolve the form-owned API synchronously from the inputs.
    return this.getFieldApi() as never
  }

  constructor() {
    effect((onCleanup) => {
      const form = this.getForm()
      this.resetVersion.set(form._atoms.resetVersion.get())
      const subscription = form._atoms.resetVersion.subscribe((version) => {
        this.resetVersion.set(version)
      })
      onCleanup(() => subscription.unsubscribe())
    })

    effect(() => {
      const api = this.getFieldApi()
      api._update(this.getFieldOptions() as never)
    })

    effect((onCleanup) => {
      const api = this.getFieldApi()
      const unregister = api._register()
      onCleanup(unregister)
    })

    effect((onCleanup) => {
      const api = this.getFieldApi()
      let previous = this.selectRenderState(api)
      this.changeDetector.markForCheck()

      const subscription = api.atom.subscribe(() => {
        const next = this.selectRenderState(api)
        if (previous[0] === next[0] && previous[1] === next[1]) return
        previous = next
        this.changeDetector.markForCheck()
      })

      onCleanup(() => subscription.unsubscribe())
    })
  }

  private selectRenderState(api: AnyInternalFieldApi): readonly [any, any] {
    if (this.isArrayField) {
      return [
        api.value.length,
        (api.meta as InternalBaseFieldMeta)._arrayVersion,
      ]
    }

    return [api.value, api.meta]
  }
}

@Directive({
  selector: '[tanstackField]',
  standalone: true,
  exportAs: 'field',
})
export class TanStackField<
  TFormData,
  const TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  const TFieldValidators extends FieldValidators<
    TFormData,
    TFieldName,
    TFieldValue
  >,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> extends TanStackFieldBase<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TFormValidators,
  TSubmitReturn
> {
  tanstackField =
    input.required<
      InternalFormApi<TFormData, TFormValidators, TSubmitReturn>
    >()
  protected readonly isArrayField = false
  protected getForm() {
    return this.tanstackField()
  }
}

@Directive({
  selector: '[tanstackArrayField]',
  standalone: true,
  exportAs: 'arrayField',
})
export class TanStackArrayField<
  TFormData,
  const TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  const TFieldValidators extends FieldValidators<
    TFormData,
    TFieldName,
    TFieldValue
  >,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> extends TanStackFieldBase<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TFormValidators,
  TSubmitReturn
> {
  tanstackArrayField =
    input.required<
      InternalFormApi<TFormData, TFormValidators, TSubmitReturn>
    >()
  protected readonly isArrayField = true
  protected getForm() {
    return this.tanstackArrayField()
  }
}
