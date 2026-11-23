import React, { Suspense, lazy, memo } from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import { FormComponentStatus } from './FormComponentStatus'

const { formComponent } = getFormHookHelpers()
const components = {
  MemoInside: formComponent.create(memo(FormComponentStatus), 'owner'),
  MemoOutside: memo(formComponent.create(FormComponentStatus, 'owner')),
  LazyOutside: lazy(() => import('./LazyFormStatus')),
}

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: components,
})

export function MemoLazyFormComponents({
  component,
}: {
  component: keyof typeof components
}) {
  const form = useAppForm({ defaultValues: { name: 'Alice' } })
  const Status = form[component]

  return (
    <Suspense fallback={<p>Loading status</p>}>
      <Status />
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
