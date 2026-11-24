import { useArrayFieldSubscription } from '../ReactForm/fieldSubscriptions.lib'
import { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import { defineLazyInstanceProp } from '../utils.lib'
import { createInternalReactAppFieldApiClass } from './ReactAppFieldApi.lib'
import {
  createFieldWithContext,
  createFormGroupWithContext,
} from './Components.lib'
import { bindFormComponent } from './helpers/helperFactories.lib'
import type { AnyFormOptions, DefaultOptions } from '@tanstack/form-core'
import type {
  ReactComponentTree,
  ReactFormComponents,
} from './componentMap.public'
import type { BoundFormComponents } from './helpers/formComponent.public'

type InternalReactAppFormApiConstructor<
  TFormComponents extends ReactFormComponents,
> = new (
  options: AnyFormOptions,
  defaultOptions?: DefaultOptions,
) => InternalReactFormApi & BoundFormComponents<TFormComponents>

export function createInternalReactAppFormApiClass<
  const TFormComponents extends ReactFormComponents,
>(
  formComponents: TFormComponents,
  fieldComponents: ReactComponentTree,
): InternalReactAppFormApiConstructor<TFormComponents> {
  const InternalReactAppFieldApi =
    createInternalReactAppFieldApiClass(fieldComponents)

  class InternalReactAppFormApi extends InternalReactFormApi {
    override get _FieldApi(): typeof InternalReactAppFieldApi {
      return InternalReactAppFieldApi
    }

    constructor(options: AnyFormOptions, defaultOptions?: DefaultOptions) {
      super(options, defaultOptions)

      const field = createFieldWithContext(this, 'field')
      const arrayField = createFieldWithContext(
        this,
        'field',
        useArrayFieldSubscription,
      )
      const groupField = createFieldWithContext(this, 'field')
      const groupArrayField = createFieldWithContext(
        this,
        'field',
        useArrayFieldSubscription,
      )
      arrayField.displayName = 'TanStackForm.ArrayField'
      groupArrayField.displayName = 'TanStackForm.ArrayField'

      this.Field = field as InternalReactAppFormApi['Field']
      this.ArrayField = arrayField as InternalReactAppFormApi['ArrayField']
      this.FormGroup = createFormGroupWithContext(
        this,
        groupField,
        groupArrayField,
      ) as InternalReactAppFormApi['FormGroup']
    }
  }

  for (const [name, component] of Object.entries(formComponents)) {
    defineLazyInstanceProp(
      InternalReactAppFormApi.prototype,
      name,
      (instance) => bindFormComponent(component, instance, name),
    )
  }

  return InternalReactAppFormApi as never
}
