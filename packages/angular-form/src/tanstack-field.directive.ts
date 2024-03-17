import {
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'
import {
  type DeepKeys,
  type DeepValue,
  FieldApi,
  FieldOptions,
  FormApi,
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
> implements OnInit
{
  @Input({ required: true }) tanstackField!: FormApi<
    TParentData,
    TFormValidator
  >
  @Input({ required: true }) fieldOpts!: FieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >

  template = inject(TemplateRef)
  viewContainer = inject(ViewContainerRef)

  ngOnInit() {
    const api = new FieldApi({
      ...this.fieldOpts,
      form: this.tanstackField,
    })

    this.viewContainer.createEmbeddedView(this.template, {
      $implicit: api,
    })
  }
}
