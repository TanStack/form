import React from 'react'
import { configure, storiesOf } from '@kadira/storybook'

import './reset.css'
import './fonts.css'
import './layout.css'
import '../stories/utils/prism.css'
import 'github-markdown-css/github-markdown.css'
//
import Readme from '../README.md'
//
import KitchenSink from '../stories/KitchenSink.js'
import Checkbox from '../stories/Checkbox.js'
import Text from '../stories/Text.js'
//
configure(() => {
  storiesOf('1. Docs')
    .add('Readme', () => {
      const ReadmeCmp = React.createClass({
        render () {
          return <span className='markdown-body' dangerouslySetInnerHTML={{__html: Readme}} />
        },
        componentDidMount () {
          global.Prism.highlightAll()
        }
      })
      return <ReadmeCmp />
    })
  storiesOf('2. Demos')
    .add('Kitchen Sink', KitchenSink)
    .add('Checkbox', Checkbox)
    .add('Text', Text)
}, module)
