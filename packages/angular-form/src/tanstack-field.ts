import {
  ChangeDetectorRef,
  Directive,
  effect,
  inject,
  input,
  signal,
} from '@angular/core'
import { InternalFormGroupApi } from '@tanstack/form-core/internals'
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
  ToFormGroupErrorTypes,
} from '@tanstack/form-core'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
  AnyInternalFormApi,
  InternalBaseFieldMeta,
  InternalFormApi,
} from '@tanstack/form-core/internals'

export type AngularFieldSource =
  AnyInternalFormApi | InternalFormGroupApi<any, any, any, any, any>

export type AngularFieldData<TSource extends AngularFieldSource> =
  TSource extends InternalFormGroupApi<any, any, infer TGroupValue, any, any>
    ? TGroupValue
    : TSource extends InternalFormApi<infer TFormData, any, any>
      ? TFormData
      : never

type AngularParentFormData<TSource extends AngularFieldSource> =
  TSource extends InternalFormGroupApi<infer TFormData, any, any, any, any>
    ? TFormData
    : TSource extends InternalFormApi<infer TFormData, any, any>
      ? TFormData
      : never

type AngularSourceFormErrorTypes<TSource extends AngularFieldSource> =
  TSource extends InternalFormGroupApi<
    any,
    any,
    any,
    any,
    infer TFormErrorTypes
  >
    ? TFormErrorTypes
    : TSource extends InternalFormApi<
          any,
          infer TFormValidators,
          infer TSubmitReturn
        >
      ? ToFormErrorTypes<TFormValidators, TSubmitReturn>
      : never

type AngularSourceGroupFieldError<TSource extends AngularFieldSource> =
  TSource extends InternalFormGroupApi<
    any,
    any,
    any,
    infer TGroupValidators,
    any
  >
    ? ToFormGroupErrorTypes<TGroupValidators>['fieldError']
    : never

type AngularSourceFieldApi<
  TSource extends AngularFieldSource,
  TFieldName extends DeepKeys<AngularFieldData<TSource>>,
  TFieldValue extends DeepValue<AngularFieldData<TSource>, TFieldName>,
  TFieldValidators extends FieldValidators<
    AngularFieldData<TSource>,
    TFieldName,
    TFieldValue
  >,
> = FieldApi<
  TFieldName,
  TFieldValue,
  ToFieldError<
    TFieldValidators,
    AngularSourceGroupFieldError<TSource>,
    AngularSourceFormErrorTypes<TSource>
  >,
  AngularParentFormData<TSource>,
  AngularSourceFormErrorTypes<TSource>
>

export type AngularFieldApi<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
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
  TSource extends AngularFieldSource,
  const TFieldName extends DeepKeys<AngularFieldData<TSource>>,
  TFieldValue extends DeepValue<AngularFieldData<TSource>, TFieldName>,
  const TFieldValidators extends FieldValidators<
    AngularFieldData<TSource>,
    TFieldName,
    TFieldValue
  >,
> {
  name = input.required<TFieldName>()
  validators = input<NoInfer<TFieldValidators>>()
  listeners =
    input<
      NoInfer<
        FieldListeners<
          AngularFieldData<TSource>,
          TFieldName,
          TFieldValue,
          ToFieldError<
            TFieldValidators,
            AngularSourceGroupFieldError<TSource>,
            AngularSourceFormErrorTypes<TSource>
          >,
          AngularParentFormData<TSource>,
          AngularSourceFormErrorTypes<TSource>
        >
      >
    >()
  errorVisibility =
    input<
      ErrorVisibility<
        AngularParentFormData<TSource>,
        AngularSourceFormErrorTypes<TSource>
      >
    >()
  errorBoundary = input<boolean>()

  protected abstract readonly isArrayField: boolean
  protected abstract getSource(): TSource

  private readonly changeDetector = inject(ChangeDetectorRef)
  private readonly resetVersion = signal(0)

  private getFieldOptions(): AnyFieldApiOptions {
    const options = {
      name: this.name(),
      validators: this.validators(),
      listeners: this.listeners(),
      errorVisibility: this.errorVisibility(),
      errorBoundary: this.errorBoundary(),
    }

    const source = this.getSource()
    if (!(source instanceof InternalFormGroupApi)) return options as never

    return source._getFormFieldOptions<AnyFieldApiOptions>(
      options as AnyFieldApiOptions,
      (base, overrides) => ({ ...base, ...overrides }),
    )
  }

  private getForm(): AnyInternalFormApi {
    const source = this.getSource()
    return source instanceof InternalFormGroupApi ? source.form : source
  }

  private getFieldApi() {
    void this.resetVersion()
    return this.getForm()._getOrCreateFieldApi({
      name: this.getFieldOptions().name,
    })
  }

  get api(): AngularSourceFieldApi<
    TSource,
    TFieldName,
    TFieldValue,
    TFieldValidators
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
  TSource extends AngularFieldSource,
  const TFieldName extends DeepKeys<AngularFieldData<TSource>>,
  TFieldValue extends DeepValue<AngularFieldData<TSource>, TFieldName>,
  const TFieldValidators extends FieldValidators<
    AngularFieldData<TSource>,
    TFieldName,
    TFieldValue
  >,
> extends TanStackFieldBase<
  TSource,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  tanstackField = input.required<TSource>()
  protected readonly isArrayField = false
  protected getSource() {
    return this.tanstackField()
  }
}

@Directive({
  selector: '[tanstackArrayField]',
  standalone: true,
  exportAs: 'arrayField',
})
export class TanStackArrayField<
  TSource extends AngularFieldSource,
  const TFieldName extends DeepKeys<AngularFieldData<TSource>>,
  TFieldValue extends DeepValue<AngularFieldData<TSource>, TFieldName>,
  const TFieldValidators extends FieldValidators<
    AngularFieldData<TSource>,
    TFieldName,
    TFieldValue
  >,
> extends TanStackFieldBase<
  TSource,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  tanstackArrayField = input.required<TSource>()
  protected readonly isArrayField = true
  protected getSource() {
    return this.tanstackArrayField()
  }
}
