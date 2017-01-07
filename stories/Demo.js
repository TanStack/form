import React from 'react'
import { storiesOf } from '@kadira/storybook'
import ReactFormWrapper from './ReactFormWrapper'
import DemoForm from './DemoForm'

import bannerImg from '../media/banner.png'

storiesOf('Demos', module)
  .add('Kitchen Sink', () => (
    <div>
      <a
        target='_blank'
        href='https://github.com/tannerlinsley/react-form/'
        style={{display: 'block'}}
      >
        <img src={bannerImg} className='logo' />
      </a>
      <br />
      <br />
      <ReactFormWrapper>
        {DemoForm}
      </ReactFormWrapper>
    </div>
  ))
