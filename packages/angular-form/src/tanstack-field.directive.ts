import {
  Directive,
  Input,
  booleanAttribute,
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
  NoInfer as NoInferHack,
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
  implements
    OnInit,
    OnChanges,
    OnDestroy,
    FieldOptions<
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
{
  @Input({ required: true }) name!: TName
  // Setting as NoInferHack as it's the same internal type cast as TanStack Form Core
  // This can be removed when TanStack Form Core is moved to TS min of 5.4
  // and the NoInfer internal util type is rm-rf'd
  @Input() defaultValue?: NoInferHack<TData>
  @Input({ transform: numberAttribute }) asyncDebounceMs?: number
  @Input({ transform: booleanAttribute }) asyncAlways?: boolean
  @Input({ required: true }) tanstackField!: FormApi<
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
  @Input() validators?: NoInfer<
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
  @Input() listeners?: NoInfer<FieldListeners<TParentData, TName, TData>>
  @Input() defaultMeta?: Partial<
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
  @Input() disableErrorFlat?: boolean

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
      defaultValue: this.defaultValue,
      asyncDebounceMs: this.asyncDebounceMs,
      asyncAlways: this.asyncAlways,
      disableErrorFlat: this.disableErrorFlat,
      validators: this.validators,
      listeners: this.listeners,
      defaultMeta: this.defaultMeta,
      name: this.name,
      form: this.tanstackField,
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
