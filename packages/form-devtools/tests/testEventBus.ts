export function connectTestEventBus(): () => void {
  const handleConnect = () => {
    window.dispatchEvent(new CustomEvent('tanstack-connect-success'))
  }
  const handleDispatch = (event: Event) => {
    const payload = (event as CustomEvent).detail
    window.dispatchEvent(new CustomEvent(payload.type, { detail: payload }))
  }

  window.addEventListener('tanstack-connect', handleConnect)
  window.addEventListener('tanstack-dispatch-event', handleDispatch)

  return () => {
    window.removeEventListener('tanstack-connect', handleConnect)
    window.removeEventListener('tanstack-dispatch-event', handleDispatch)
  }
}
