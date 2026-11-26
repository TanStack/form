import React, { useState } from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { AnyReactFormApi } from '../../../src'

function OrdinaryCounter({ form, owner }: { form: string; owner: string }) {
  const [count, setCount] = useState(0)

  return (
    <>
      <output aria-label="Ordinary props">{`${form} / ${owner}`}</output>
      <output aria-label="Ordinary count">{count}</output>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment ordinary state
      </button>
    </>
  )
}

function FormActions({ form }: { form: AnyReactFormApi }) {
  const [count, setCount] = useState(0)

  return (
    <>
      <output aria-label="Component count">{count}</output>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment component state
      </button>
      <button type="button" onClick={() => void form.handleSubmit()}>
        Submit
      </button>
    </>
  )
}

const { formComponent } = getFormHookHelpers()
const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {
    FormActions: formComponent.create({
      component: FormActions,
      replaceProperty: 'form',
    }),
    OrdinaryCounter,
  },
})

export function StableFormComponents({
  onSubmit,
}: {
  onSubmit: (version: number) => void
}) {
  const [version, setVersion] = useState(0)
  const form = useAppForm({
    defaultValues: { name: 'Alice' },
    onSubmit: () => onSubmit(version),
  })

  return (
    <>
      <button type="button" onClick={() => setVersion((value) => value + 1)}>
        Update form options
      </button>
      <form.FormActions />
      <form.OrdinaryCounter form="Caller form" owner="Caller owner" />
    </>
  )
}
