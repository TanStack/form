import { FieldLabel } from '../FieldLabel'
import { FieldDetailMetaBadges } from './FieldDetailMetaBadges'
import { FieldDetailSettingsMenu } from './FieldDetailSettingsMenu'
import { FieldDetailValues } from './FieldDetailValues'
import { FieldDetailErrors } from './fieldErrors/FieldDetailErrors'
import type { DevtoolsFieldListRow } from '@/stores/fieldListStore'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface FieldDetailCardProps {
  field: DevtoolsFieldListRow
  class?: string
}

export function FieldDetailCard(props: FieldDetailCardProps) {
  const { fieldId, path, pathLeaf, isMounted } = props.field

  return (
    <Card class={props.class}>
      <CardHeader class="@container-normal items-center">
        <CardTitle class="items-center">
          <FieldLabel path={path} leaf={pathLeaf} />
        </CardTitle>
        <FieldDetailMetaBadges fieldId={fieldId} isMounted={isMounted} />
        <CardAction class="ml-4">
          <FieldDetailSettingsMenu fieldId={fieldId} fieldPath={path} />
        </CardAction>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <Separator />
        <FieldDetailValues fieldId={fieldId} />
        <FieldDetailErrors fieldId={fieldId} />
      </CardContent>
    </Card>
  )
}
