import React from 'react'

import { attachReactFormComponents } from '../ReactForm/Components.lib'
import { FormContext } from './contexts.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core-v2/internals'
import type { FunctionComponent } from 'react'

import type {
  AppFormComponent,
  ReactAppFormApi,
} from './ReactAppFormApi.public'
import type { CrossVersionReactNode } from '../types.public'

type AnyReactAppFormApi = ReactAppFormApi<
  any,
  any,
  any,
  Record<string, FunctionComponent<any>>,
  Record<string, FunctionComponent<any>>
>

export function attachReactAppFormComponents(
  form: AnyInternalFormApi,
  formComponents: Record<string, FunctionComponent<any>>,
  fieldComponents: Record<string, FunctionComponent<any>>,
): AnyReactAppFormApi {
  const resultForm = attachReactFormComponents(
    form,
    fieldComponents,
  ) as never as AnyReactAppFormApi
  resultForm.AppForm = createAppForm(form)

  return Object.assign(resultForm, formComponents)
}

function createAppForm(form: AnyInternalFormApi): AppFormComponent {
  const AppForm: FunctionComponent<{
    children: Exclude<CrossVersionReactNode, Promise<any>>
  }> = function AppFormComponent(props) {
    // eslint-disable-next-line @eslint-react/no-context-provider
    return <FormContext.Provider value={form as never} {...props} />
  }

  AppForm.displayName = 'TanStackForm.AppForm'

  return AppForm
}
