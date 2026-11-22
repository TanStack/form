import { fieldComponent } from '../field-brand'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { ComponentProps } from 'react'
import { Label } from '@/components/ui/label'

interface TanStackFormLabelProps extends ComponentProps<typeof Label> {
  field: AnyFieldApi
}

function FormLabel(props: TanStackFormLabelProps) {
  const { field } = props
  return <Label {...props} htmlFor={props.htmlFor ?? field.name} />
}

// Inject the field prop so callers do not need to pass it again.
// This component isn't generic, so that is safe.

// We don't care what type of field uses this, so loose is acceptable
export default fieldComponent.loose()(FormLabel, 'field')
