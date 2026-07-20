import { FieldLabel } from '../FieldLabel'
import { FieldDetailMetaBadges } from './FieldDetailMetaBadges'
import { FieldDetailSettingsMenu } from './FieldDetailSettingsMenu'
import { FieldDetailValues } from './FieldDetailValues'
import { FieldDetailErrors } from './fieldErrors/FieldDetailErrors'
import { FieldDetailSettingsActions } from './FieldDetailSettingsActions'
import type { DevtoolsFieldListRow } from '@/stores/fieldListStore'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'
import { cn } from '@/utils'

interface FieldDetailCardProps {
  field: DevtoolsFieldListRow
  class?: string
}

export function FieldDetailCard(props: FieldDetailCardProps) {
  const { selectedFieldRow, subscribedFormId } =
    useFormDevtoolsStore().fieldList

  const path = () => props.field.path
  const leaf = () => props.field.pathLeaf
  const fieldId = () => props.field.fieldId
  const isMounted = () => props.field.isMounted

  return (
    <Card
      class={cn('data-selected:ring-2 data-selected:ring-ring/50', props.class)}
      data-selected={selectedFieldRow()?.fieldId === fieldId()}
    >
      <CardHeader class="@container-normal items-center">
        <CardTitle class="items-center">
          <FieldLabel path={path()} leaf={leaf()} />
        </CardTitle>
        <FieldDetailMetaBadges fieldId={fieldId()} isMounted={isMounted()} />
        <CardAction class="ml-4">
          <FieldDetailSettingsActions
            fieldId={fieldId()}
            formInstanceId={subscribedFormId()}
          />
          <FieldDetailSettingsMenu fieldId={fieldId()} fieldPath={path()} />
        </CardAction>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <Separator />
        <FieldDetailValues fieldId={fieldId()} />
        <FieldDetailErrors fieldId={fieldId()} isMounted={isMounted()} />
      </CardContent>
    </Card>
  )
}
