import { StrictMode, createElement } from 'react'
import { registerRootComponent } from 'expo'

import App from './app/index'

function Root() {
  return createElement(StrictMode, null, createElement(App))
}

registerRootComponent(Root)
