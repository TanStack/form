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
  FormApi,
  FormGroupOnSubmitInvalidFn,
  FormGroupSubmitFn,
  FormGroupValidators,
  ScopedErrorTypes,
  ToFormGroupErrorTypes,
} from '@tanstack/form-core'

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
  TFormError extends ScopedErrorTypes,
> {
  tanstackFormGroup = input.required<FormApi<TFormData, TFormError>>()
  name = input.required<TGroupName>()
  validators = input<NoInfer<TGroupValidators>>()
  onSubmit =
    input<
      FormGroupSubmitFn<
        TFormData,
        TGroupName,
        TGroupValue,
        TGroupValidators,
        TFormError
      >
    >()
  onSubmitInvalid =
    input<
      FormGroupOnSubmitInvalidFn<
        TFormData,
        TGroupName,
        TGroupValue,
        NoInfer<ToFormGroupErrorTypes<TGroupValidators>>,
        TFormError
      >
    >()

  private readonly changeDetector = inject(ChangeDetectorRef)
  private group: InternalFormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormError
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
