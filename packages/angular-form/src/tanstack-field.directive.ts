import {
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'
import { FieldApi, FieldOptions, FormApi } from '@tanstack/form-core'

@Directive({
  selector: '[tanstackField]',
  standalone: true,
})
export class TanStackField implements OnInit {
  @Input({ required: true }) tanstackField!: FormApi<any, any>
  @Input({ required: true }) fieldOpts!: FieldOptions<any, any>

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
