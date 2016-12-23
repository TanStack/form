import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories/Simple.js');
  require('../stories/Demo.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
