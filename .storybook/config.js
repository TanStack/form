import { configure } from '@kadira/storybook'

function loadStories () {
  require('../stories/Demo.js')
  require('../stories/Simple.js')
}

configure(loadStories, module)
