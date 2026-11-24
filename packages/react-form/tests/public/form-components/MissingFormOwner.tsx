import React from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import { FormComponentStatus } from './FormComponentStatus'

const { formComponent } = getFormHookHelpers()
const Status = formComponent.create({
  component: FormComponentStatus,
  replaceProperty: 'owner',
})
const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
})

export function MissingFormOwner() {
  const form = useAppForm({ defaultValues: { name: 'Alice' } })
  const extraProps = { owner: form, label: 'Unowned status' }

  return <Status {...extraProps} />
}
