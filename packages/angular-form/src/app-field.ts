import { Directive, effect, inject } from '@angular/core'
import { TanStackFieldInjectable } from './injectable'
import { TanStackArrayField, TanStackField } from './tanstack-field'
import type {
  DeepKeys,
  DeepValue,
  FieldValidators,
  FormValidators,
} from '@tanstack/form-core'

@Directive({
  selector: '[tanstack-app-field]',
  standalone: true,
  providers: [TanStackFieldInjectable],
})
export class TanStackAppField<
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
> extends TanStackField<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TFormValidators,
  TSubmitReturn
> {
  private readonly injectable = inject(
    TanStackFieldInjectable,
  ) as TanStackFieldInjectable<any>

  constructor() {
    super()
    effect(() => this.injectable._api.set(this.api))
  }
}

@Directive({
  selector: '[tanstack-app-array-field]',
  standalone: true,
  providers: [TanStackFieldInjectable],
})
export class TanStackAppArrayField<
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
> extends TanStackArrayField<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TFormValidators,
  TSubmitReturn
> {
  private readonly injectable = inject(
    TanStackFieldInjectable,
  ) as TanStackFieldInjectable<any>

  constructor() {
    super()
    effect(() => this.injectable._api.set(this.api))
  }
}
