import { fieldComponent } from '../contexts'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { ComponentProps } from 'react'
import { Label } from '@/components/ui/label'

interface TanStackFormLabelProps extends ComponentProps<typeof Label> {
  field: AnyFieldApi
}

function FormLabel(props: TanStackFormLabelProps) {
  const { field, ...labelProps } = props
  return <Label {...labelProps} htmlFor={labelProps.htmlFor ?? field.name} />
}

// We use fieldComponent instead of fieldBrand so that we don't have to pass `field` again.
// This component isn't generic, so that is safe.

// We don't care what type of field uses this, so loose is acceptable
export const TanStackFormLabel = fieldComponent.loose(FormLabel, 'field')
