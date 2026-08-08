import {
  ChangeDetectorRef,
  Directive,
  effect,
  inject,
  input,
} from '@angular/core'
import { InternalFormGroupApi } from '@tanstack/form-core/internals'
import type {
  DeepKeys,
  DeepValue,
  FormGroupOptions,
  FormGroupValidators,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type { InternalFormApi } from '@tanstack/form-core/internals'

@Directive({
  selector: '[tanstackFormGroup]',
  standalone: true,
  exportAs: 'formGroup',
})
export class TanStackFormGroup<
  TFormData,
  const TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  const TGroupValidators extends FormGroupValidators<TGroupValue>,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  tanstackFormGroup =
    input.required<InternalFormApi<TFormData, TFormValidators, TSubmitReturn>>()
  name = input.required<TGroupName>()
  validators = input<NoInfer<TGroupValidators>>()
  onSubmit =
    input<
      FormGroupOptions<
        TFormData,
        TGroupName,
        TGroupValue,
        TGroupValidators,
        ToFormErrorTypes<TFormValidators, TSubmitReturn>
      >['onSubmit']
    >()
  onSubmitInvalid =
    input<
      FormGroupOptions<
        TFormData,
        TGroupName,
        TGroupValue,
        TGroupValidators,
        ToFormErrorTypes<TFormValidators, TSubmitReturn>
      >['onSubmitInvalid']
    >()

  private readonly changeDetector = inject(ChangeDetectorRef)
  private group: InternalFormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    ToFormErrorTypes<TFormValidators, TSubmitReturn>
  > | null = null

  private getOptions() {
    return {
      form: this.tanstackFormGroup(),
      name: this.name(),
      validators: this.validators(),
      onSubmit: this.onSubmit(),
      onSubmitInvalid: this.onSubmitInvalid(),
    }
  }

  get api() {
    if (!this.group) {
      this.group = new InternalFormGroupApi(this.getOptions() as never)
    }
    return this.group
  }

  constructor() {
    effect(() => this.api.update(this.getOptions() as never))

    effect((onCleanup) => {
      const group = this.api
      group.mount()
      onCleanup(() => group._cleanup())
    })

    effect((onCleanup) => {
      const subscription = this.api.atom.subscribe(() => {
        this.changeDetector.markForCheck()
      })
      onCleanup(() => subscription.unsubscribe())
    })
  }
}
