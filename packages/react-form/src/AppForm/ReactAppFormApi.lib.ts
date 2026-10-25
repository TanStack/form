import { useArrayFieldSubscription } from '../ReactForm/fieldSubscriptions.lib'
import { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import { createInternalReactAppFieldApiClass } from './ReactAppFieldApi.lib'
import {
  createAppForm,
  createFieldWithContext,
  createFormGroupWithContext,
} from './Components.lib'
import type { AnyFormOptions, DefaultOptions } from '@tanstack/form-core'
import type { AppFormComponent } from './ReactAppFormApi.public'
import type { ReactComponentTree } from './componentMap.public'

interface InternalReactAppFormApiInstance extends InternalReactFormApi {
  AppForm: AppFormComponent
}

type InternalReactAppFormApiConstructor<
  TFormComponents extends ReactComponentTree,
> = new (
  options: AnyFormOptions,
  defaultOptions?: DefaultOptions,
) => InternalReactAppFormApiInstance & TFormComponents

export function createInternalReactAppFormApiClass<
  const TFormComponents extends ReactComponentTree,
>(
  formComponents: TFormComponents,
  fieldComponents: ReactComponentTree,
): InternalReactAppFormApiConstructor<TFormComponents> {
  const InternalReactAppFieldApi =
    createInternalReactAppFieldApiClass(fieldComponents)

  class InternalReactAppFormApi
    extends InternalReactFormApi
    implements InternalReactAppFormApiInstance
  {
    AppForm: AppFormComponent

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

      this.AppForm = createAppForm(this)
      this.Field = field as InternalReactAppFormApi['Field']
      this.ArrayField = arrayField as InternalReactAppFormApi['ArrayField']
      this.FormGroup = createFormGroupWithContext(
        this,
        groupField,
        groupArrayField,
      ) as InternalReactAppFormApi['FormGroup']
    }
  }

  Object.assign(InternalReactAppFormApi.prototype, formComponents)

  return InternalReactAppFormApi as unknown as InternalReactAppFormApiConstructor<TFormComponents>
}
