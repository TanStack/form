import React from 'react'
import type { AnyReactFormApi } from '../../../src'

export function FormComponentStatus({
  owner,
  label = 'Form status',
}: {
  owner: AnyReactFormApi
  label?: string
}) {
  return (
    <owner.Subscribe selector={(state) => state.isDirty}>
      {(isDirty) => (
        <output aria-label={label}>{isDirty ? 'Edited' : 'Pristine'}</output>
      )}
    </owner.Subscribe>
  )
}
