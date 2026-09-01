import { createArrayFieldComponent } from '../ReactForm/Components.lib'
import { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import {
  createAppForm,
  createFieldWithContext,
  createFormGroupWithContext,
} from './Components.lib'
import type { DefaultOptions, FormOptions } from '@tanstack/form-core'
import type { FunctionComponent } from 'react'
import type { AppFormComponent } from './ReactAppFormApi.public'

type FormComponents = Record<string, FunctionComponent<any>>

export interface InternalReactAppFormApiInstance extends InternalReactFormApi {
  AppForm: AppFormComponent
}

type InternalReactAppFormApiConstructor<
  TFormComponents extends FormComponents,
> = new (
  options: FormOptions<any, any, any, unknown>,
  defaultOptions?: DefaultOptions,
) => InternalReactAppFormApiInstance & TFormComponents

export function createInternalReactAppFormApiClass<
  const TFormComponents extends FormComponents,
>(
  formComponents: TFormComponents,
  fieldComponents: FormComponents,
): InternalReactAppFormApiConstructor<TFormComponents> {
  class InternalReactAppFormApi
    extends InternalReactFormApi
    implements InternalReactAppFormApiInstance
  {
    AppForm: AppFormComponent

    constructor(
      options: FormOptions<any, any, any, unknown>,
      defaultOptions?: DefaultOptions,
    ) {
      super(options, defaultOptions, fieldComponents)

      const field = createFieldWithContext(this, fieldComponents, 'field')
      const groupField = createFieldWithContext(this, fieldComponents, 'field')
      const groupArrayField = createArrayFieldComponent(
        this,
        fieldComponents,
        'field',
      ) as FunctionComponent<any>

      this.AppForm = createAppForm(this)
      this.Field = field as InternalReactAppFormApi['Field']
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
