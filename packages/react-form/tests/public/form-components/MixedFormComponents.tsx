import React, { Suspense, lazy, memo } from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { AnyReactFormApi } from '../../../src'

function Notice({ message }: { message: string }) {
  return <p>{message}</p>
}

function FormStatus({ form }: { form: AnyReactFormApi }) {
  return (
    <form.Subscribe selector={(state) => state.isDirty}>
      {(isDirty) => (
        <output aria-label="Form status">
          {isDirty ? 'Edited' : 'Pristine'}
        </output>
      )}
    </form.Subscribe>
  )
}

const MemoNotice = memo(Notice)
const LazyNotice = lazy(() => Promise.resolve({ default: Notice }))
const LazyStatus = lazy(() => Promise.resolve({ default: FormStatus }))
const { formComponent } = getFormHookHelpers()
const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {
    MemoNotice,
    LazyNotice,
    Status: formComponent.create({
      component: LazyStatus,
      replaceProperty: 'form',
    }),
  },
})

export function MixedFormComponents() {
  const form = useAppForm({ defaultValues: { name: 'Alice' } })

  return (
    <Suspense fallback={<p>Loading components</p>}>
      <form.MemoNotice message="Memo component" />
      <form.LazyNotice message="Lazy component" />
      <form.Status />
      <form.Field name="name">
        {(field) => (
          <input
            aria-label="Name"
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>
    </Suspense>
  )
}
