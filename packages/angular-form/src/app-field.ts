import { Directive, effect, inject } from '@angular/core'
import { TanStackFieldInjectable } from './injectable'
import { TanStackArrayField, TanStackField } from './tanstack-field'
import type {
  AngularFieldData,
  AngularFieldSource,
} from './tanstack-field'
import type { DeepKeys, DeepValue, FieldValidators } from '@tanstack/form-core'

@Directive({
  selector: '[tanstack-app-field]',
  standalone: true,
  providers: [TanStackFieldInjectable],
})
export class TanStackAppField<
  TSource extends AngularFieldSource,
  const TFieldName extends DeepKeys<AngularFieldData<TSource>>,
  TFieldValue extends DeepValue<AngularFieldData<TSource>, TFieldName>,
  const TFieldValidators extends FieldValidators<
    AngularFieldData<TSource>,
    TFieldName,
    TFieldValue
  >,
> extends TanStackField<
  TSource,
  TFieldName,
  TFieldValue,
  TFieldValidators
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
  TSource extends AngularFieldSource,
  const TFieldName extends DeepKeys<AngularFieldData<TSource>>,
  TFieldValue extends DeepValue<AngularFieldData<TSource>, TFieldName>,
  const TFieldValidators extends FieldValidators<
    AngularFieldData<TSource>,
    TFieldName,
    TFieldValue
  >,
> extends TanStackArrayField<
  TSource,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  private readonly injectable = inject(
    TanStackFieldInjectable,
  ) as TanStackFieldInjectable<any>

  constructor() {
    super()
    effect(() => this.injectable._api.set(this.api))
  }
}
