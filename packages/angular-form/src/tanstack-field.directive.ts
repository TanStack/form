import {
  Directive,
  booleanAttribute,
  input,
  numberAttribute,
} from '@angular/core'
import {
  FieldApi,
  FieldApiOptions,
  FieldAsyncValidateOrFn,
  FieldValidateOrFn,
  FormApi,
} from '@tanstack/form-core'
import type {
  DeepKeys,
  DeepValue,
  FieldListeners,
  FieldMeta,
  FieldOptions,
  FieldValidators,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { OnChanges, OnDestroy, OnInit } from '@angular/core'

@Directive({
  selector: '[tanstackField]',
  standalone: true,
  exportAs: 'field',
})
export class TanStackField<
    TParentData,
    const TName extends DeepKeys<TParentData>,
    TData extends DeepValue<TParentData, TName>,
    TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnChangeAsync extends
      | undefined
      | FieldAsyncValidateOrFn<TParentData, TName, TData>,
    TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnBlurAsync extends
      | undefined
      | FieldAsyncValidateOrFn<TParentData, TName, TData>,
    TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnSubmitAsync extends
      | undefined
      | FieldAsyncValidateOrFn<TParentData, TName, TData>,
    TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
    TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
    TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
    TSubmitMeta,
  >
  implements OnInit, OnChanges, OnDestroy
{
  name = input.required<TName>()
  defaultValue = input<NoInfer<TData>>()
  asyncDebounceMs = input(undefined as never as number, {
    transform: numberAttribute,
  })
  asyncAlways = input(undefined as never as boolean, {
    transform: booleanAttribute,
  })
  tanstackField =
    input.required<
      FormApi<
        TParentData,
        TFormOnMount,
        TFormOnChange,
        TFormOnChangeAsync,
        TFormOnBlur,
        TFormOnBlurAsync,
        TFormOnSubmit,
        TFormOnSubmitAsync,
        TFormOnServer,
        TSubmitMeta
      >
    >()

  validators =
    input<
      NoInfer<
        FieldValidators<
          TParentData,
          TName,
          TData,
          TOnMount,
          TOnChange,
          TOnChangeAsync,
          TOnBlur,
          TOnBlurAsync,
          TOnSubmit,
          TOnSubmitAsync
        >
      >
    >()

  listeners = input<NoInfer<FieldListeners<TParentData, TName, TData>>>()
  defaultMeta =
    input<
      Partial<
        FieldMeta<
          TParentData,
          TName,
          TData,
          TOnMount,
          TOnChange,
          TOnChangeAsync,
          TOnBlur,
          TOnBlurAsync,
          TOnSubmit,
          TOnSubmitAsync,
          TFormOnMount,
          TFormOnChange,
          TFormOnChangeAsync,
          TFormOnBlur,
          TFormOnBlurAsync,
          TFormOnSubmit,
          TFormOnSubmitAsync
        >
      >
    >()

  disableErrorFlat = input<boolean>()

  api!: FieldApi<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnServer,
    TSubmitMeta
  >

  private getOptions(): FieldApiOptions<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnServer,
    TSubmitMeta
  > {
    return {
      defaultValue: this.defaultValue(),
      asyncDebounceMs: this.asyncDebounceMs(),
      asyncAlways: this.asyncAlways(),
      disableErrorFlat: this.disableErrorFlat(),
      validators: this.validators(),
      listeners: this.listeners(),
      defaultMeta: this.defaultMeta(),
      name: this.name(),
      form: this.tanstackField(),
    }
  }

  unmount?: () => void

  ngOnInit() {
    this.api = new FieldApi(this.getOptions())

    this.unmount = this.api.mount()
  }

  ngOnDestroy() {
    this.unmount?.()
  }

  ngOnChanges() {
    const api = this.api as typeof this.api | undefined
    if (!api) return
    api.update(this.getOptions())
  }
}
