import {
  Directive,
  Input,
  type OnChanges,
  type OnDestroy,
  type OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core'
import {
  type DeepKeys,
  type DeepValue,
  FieldApi,
  type FieldMeta,
  type FieldOptions,
  type FieldValidators,
  FormApi,
  type NoInfer,
  type Validator,
} from '@tanstack/form-core'

@Directive({
  selector: '[tanstackField]',
  standalone: true,
})
export class TanStackField<
    TParentData,
    TName extends DeepKeys<TParentData>,
    TFieldValidator extends
      | Validator<DeepValue<TParentData, TName>, unknown>
      | undefined = undefined,
    TFormValidator extends
      | Validator<TParentData, unknown>
      | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  >
  implements
    OnInit,
    OnChanges,
    OnDestroy,
    FieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>
{
  @Input({ required: true }) name!: TName
  @Input() defaultValue?: NoInfer<TData>
  @Input() asyncDebounceMs?: number
  @Input() asyncAlways?: boolean
  @Input() preserveValue?: boolean
  @Input() validatorAdapter?: TFieldValidator
  @Input({ required: true }) tanstackField!: FormApi<
    TParentData,
    TFormValidator
  >
  @Input() validators?: FieldValidators<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  @Input() defaultMeta?: Partial<FieldMeta>

  template = inject(TemplateRef)
  viewContainer = inject(ViewContainerRef)

  api?: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>

  private getOptions() {
    return {
      defaultValue: this.defaultValue,
      asyncDebounceMs: this.asyncDebounceMs,
      asyncAlways: this.asyncAlways,
      preserveValue: this.preserveValue,
      validatorAdapter: this.validatorAdapter,
      validators: this.validators,
      defaultMeta: this.defaultMeta,
      name: this.name,
      form: this.tanstackField,
    }
  }

  unmount?: () => void

  ngOnInit() {
    this.api = new FieldApi(this.getOptions())

    this.unmount = this.api.mount()

    this.viewContainer.createEmbeddedView(this.template, {
      $implicit: this.api,
    })
  }

  ngOnDestroy() {
    this.unmount?.()
  }

  ngOnChanges() {
    if (!this.api) return
    this.api.update(this.getOptions())
  }
}
