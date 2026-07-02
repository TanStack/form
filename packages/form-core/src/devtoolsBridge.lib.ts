interface Bridge {}

let activeBridge: Bridge | null = null
function installBridge(bridge: Bridge) {
  activeBridge = bridge
}
