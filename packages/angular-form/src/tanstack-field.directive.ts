import {
  Directive,
  Input,
  booleanAttribute,
  numberAttribute,
} from '@angular/core'
import { FieldApi, FieldApiOptions, FormApi } from '@tanstack/form-core'
import type { OnChanges, OnDestroy, OnInit } from '@angular/core'
import type {
  DeepKeys,
  DeepValue,
  FieldListeners,
  FieldMeta,
  FieldOptions,
  FieldValidators,
  NoInfer as NoInferHack,
  Validator,
} from '@tanstack/form-core'

@Directive({
  selector: '[tanstackField]',
  standalone: true,
  exportAs: 'field',
})
export class TanStackField<
    TParentData,
    const TName extends DeepKeys<TParentData>,
    TFieldValidator extends
      | Validator<DeepValue<TParentData, TName>, unknown>
      | undefined = undefined,
    TFormValidator extends
      | Validator<TParentData, unknown>
      | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
    TOnMountReturn = undefined,
    TOnChangeReturn = undefined,
    TOnChangeAsyncReturn = undefined,
    TOnBlurReturn = undefined,
    TOnBlurAsyncReturn = undefined,
    TOnSubmitReturn = undefined,
    TOnSubmitAsyncReturn = undefined,
    TFormOnMountReturn = undefined,
    TFormOnChangeReturn = undefined,
    TFormOnChangeAsyncReturn = undefined,
    TFormOnBlurReturn = undefined,
    TFormOnBlurAsyncReturn = undefined,
    TFormOnSubmitReturn = undefined,
    TFormOnSubmitAsyncReturn = undefined,
    TFormOnServerReturn = undefined,
  >
  implements
    OnInit,
    OnChanges,
    OnDestroy,
    FieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TOnMountReturn,
      TOnChangeReturn,
      TOnChangeAsyncReturn,
      TOnBlurReturn,
      TOnBlurAsyncReturn,
      TOnSubmitReturn,
      TOnSubmitAsyncReturn
    >
{
  @Input({ required: true }) name!: TName
  // Setting as NoInferHack as it's the same internal type cast as TanStack Form Core
  // This can be removed when TanStack Form Core is moved to TS min of 5.4
  // and the NoInfer internal util type is rm-rf'd
  @Input() defaultValue?: NoInferHack<TData>
  @Input({ transform: numberAttribute }) asyncDebounceMs?: number
  @Input({ transform: booleanAttribute }) asyncAlways?: boolean
  @Input() validatorAdapter?: TFieldValidator
  @Input({ required: true }) tanstackField!: FormApi<
    TParentData,
    TFormValidator,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >
  @Input() validators?: NoInfer<
    FieldValidators<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TOnMountReturn,
      TOnChangeReturn,
      TOnChangeAsyncReturn,
      TOnBlurReturn,
      TOnBlurAsyncReturn,
      TOnSubmitReturn,
      TOnSubmitAsyncReturn
    >
  >
  @Input() listeners?: NoInfer<
    FieldListeners<TParentData, TName, TFieldValidator, TFormValidator, TData>
  >
  @Input() defaultMeta?: Partial<FieldMeta>

  api!: FieldApi<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >

  private getOptions(): FieldApiOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  > {
    return {
      defaultValue: this.defaultValue,
      asyncDebounceMs: this.asyncDebounceMs,
      asyncAlways: this.asyncAlways,
      validatorAdapter: this.validatorAdapter,
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
