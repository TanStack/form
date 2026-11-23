import React from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { ReactNode } from 'react'
import type { AppFormHookResult, ReactFormType } from '../../../src'

const { formComponent } = getFormHookHelpers()

// An explicit result type breaks the dependency through the same hook's registry.
const hooks: AppFormHookResult<{
  formComponents: { Save: (props: { label: string }) => ReactNode }
  fieldComponents: {}
}> = createFormHook({
  fieldComponents: {},
  formComponents: { Save: formComponent.create(SameHookSave, 'form') },
})

const { appFormOptions, useAppForm } = hooks

function SameHookSave({
  form,
  label,
}: {
  form: ReactFormType<typeof appFormOptions>
  label: string
}) {
  return <button onClick={() => void form.handleSubmit()}>{label}</button>
}

function SameHookComponents() {
  const form = useAppForm({ defaultValues: { name: '' } })
  return <form.Save label="Save" />
}

void SameHookComponents
