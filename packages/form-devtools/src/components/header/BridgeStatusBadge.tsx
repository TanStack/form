import { Match, Switch } from 'solid-js'
import { Badge } from '../ui/badge'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'

export function BridgeStatusBadge() {
  const { bridgeStatus, bridgeMountedFormCount } =
    useFormDevtoolsStore().formSelector

  return (
    <Switch>
      <Match when={bridgeStatus() === 'checking'}>
        <Badge variant="outline" role="status" class="mt-1">
          Checking form bridge…
        </Badge>
      </Match>
      <Match when={bridgeStatus() === 'unavailable'}>
        <Badge variant="destructive" role="status" class="mt-1">
          Form bridge not connected
        </Badge>
      </Match>
      <Match
        when={bridgeStatus() === 'connected' && bridgeMountedFormCount() === 0}
      >
        <Badge variant="destructive" role="status" class="mt-1">
          Bridge connected · no mounted forms
        </Badge>
      </Match>
    </Switch>
  )
}
