import { useBusListenerState } from '../contexts/eventClientContext'

export default function Content() {
  const eventBus = useBusListenerState()

  return (
    <div>
      <div>form devtools</div>
      <div>{JSON.stringify(eventBus()?.state)}</div>
    </div>
  )
}
