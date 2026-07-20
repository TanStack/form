import { getOrCreateFormDevtoolsBridgeRuntime } from './runtime'

// Keep one backend runtime for the lifetime of the page. Re-evaluating a
// distributed dependency must not discard mounted forms or active field
// subscriptions. Reload the page to pick up backend or protocol changes.
getOrCreateFormDevtoolsBridgeRuntime()
